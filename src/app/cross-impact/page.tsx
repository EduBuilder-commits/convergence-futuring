'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Brain, Loader2, Plus, X, Zap, ArrowRight, ArrowLeft } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

interface Force {
  id: string
  name: string
  description: string
  category: 'technology' | 'political' | 'economic' | 'social' | 'environmental'
}

interface Impact {
  from: string
  to: string
  strength: 'strong' | 'medium' | 'weak'
  direction: 'positive' | 'negative'
  timeline: 'short' | 'medium' | 'long'
}

const defaultForces: Force[] = [
  { id: '1', name: 'AI Adoption', description: 'Increasing AI integration in schools', category: 'technology' },
  { id: '2', name: 'Funding Changes', description: 'Changes in state/federal funding', category: 'political' },
  { id: '3', name: 'Enrollment Shifts', description: 'Changing student population', category: 'economic' },
  { id: '4', name: 'Teacher Shortage', description: 'Staffing challenges', category: 'social' },
  { id: '5', name: 'Tech Infrastructure', description: 'District technology systems', category: 'technology' },
  { id: '6', name: 'Policy Changes', description: 'New education regulations', category: 'political' }
]

const defaultImpacts: Impact[] = [
  { from: '1', to: '2', strength: 'medium', direction: 'positive', timeline: 'medium' },
  { from: '1', to: '4', strength: 'strong', direction: 'positive', timeline: 'long' },
  { from: '1', to: '5', strength: 'strong', direction: 'positive', timeline: 'short' },
  { from: '2', to: '3', strength: 'strong', direction: 'negative', timeline: 'short' },
  { from: '2', to: '4', strength: 'medium', direction: 'negative', timeline: 'medium' },
  { from: '3', to: '2', strength: 'strong', direction: 'positive', timeline: 'long' },
  { from: '4', to: '1', strength: 'weak', direction: 'negative', timeline: 'long' }
]

export default function CrossImpactPage() {
  const [user, setUser] = useState<any>(null)
  const [forces, setForces] = useState<Force[]>(defaultForces)
  const [impacts, setImpacts] = useState<Impact[]>(defaultImpacts)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [showAddForce, setShowAddForce] = useState(false)
  const [showAddImpact, setShowAddImpact] = useState(false)
  const [selectedForce, setSelectedForce] = useState<Force | null>(null)
  const [newForce, setNewForce] = useState<Partial<Force>>({ name: '', description: '', category: 'technology' })
  const [newImpact, setNewImpact] = useState<Partial<Impact>>({ from: '', to: '', strength: 'medium', direction: 'positive', timeline: 'medium' })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/login'
      } else {
        setUser(user)
      }
    })
  }, [])

  const runAIAnalysis = async () => {
    setAnalyzing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cross_impact',
          data: { forces, impacts }
        })
      })
      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
    setAnalyzing(false)
  }

  const getImpactStrength = (from: string, to: string) => {
    const impact = impacts.find(i => i.from === from && i.to === to)
    return impact?.strength || 'none'
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technology': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'political': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'economic': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'social': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'environmental': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getCellColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'weak': return 'bg-blue-500'
      default: return 'bg-slate-800'
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <a href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Convergence</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Zap className="h-8 w-8 text-purple-400" />
              Cross-Impact Matrix
            </h1>
            <p className="text-white/60">Map force interactions and system dynamics</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={runAIAnalysis}
              disabled={analyzing}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              AI Analysis
            </button>
            <button
              onClick={() => setShowAddForce(true)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Force
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Matrix */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">Impact Matrix</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-white/50 text-xs">FROM \ TO</th>
                      {forces.map(force => (
                        <th key={force.id} className="p-2">
                          <div 
                            className={`text-xs p-2 rounded border ${getCategoryColor(force.category)} cursor-pointer`}
                            onClick={() => setSelectedForce(force)}
                          >
                            {force.name.substring(0, 12)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {forces.map(force => (
                      <tr key={force.id}>
                        <td className="p-2">
                          <div className={`text-xs p-2 rounded border ${getCategoryColor(force.category)}`}>
                            {force.name.substring(0, 12)}
                          </div>
                        </td>
                        {forces.map(target => (
                          <td key={target.id} className="p-1">
                            {force.id !== target.id && (
                              <button
                                onClick={() => {
                                  const existing = impacts.find(i => i.from === force.id && i.to === target.id)
                                  if (existing) {
                                    setImpacts(impacts.filter(i => i !== existing))
                                  } else {
                                    setImpacts([...impacts, { 
                                      from: force.id, 
                                      to: target.id, 
                                      strength: 'medium',
                                      direction: 'positive',
                                      timeline: 'medium'
                                    }])
                                  }
                                }}
                                className={`w-full h-10 rounded ${getCellColor(getImpactStrength(force.id, target.id))} ${
                                  getImpactStrength(force.id, target.id) !== 'none' ? 'opacity-80 hover:opacity-100' : 'opacity-30 hover:opacity-50'
                                }`}
                                title={getImpactStrength(force.id, target.id) !== 'none' ? 
                                  `${forces.find(f => f.id === force.id)?.name} → ${forces.find(f => f.id === target.id)?.name}` : 
                                  'Click to add impact'}
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span className="text-white/60">Strong</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500" />
                  <span className="text-white/60">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500" />
                  <span className="text-white/60">Weak</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-800 opacity-30" />
                  <span className="text-white/60">None</span>
                </div>
              </div>
            </div>

            {/* Force List */}
            <div className="mt-4 bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h3 className="font-semibold text-white mb-3">Forces</h3>
              <div className="flex flex-wrap gap-2">
                {forces.map(force => (
                  <div 
                    key={force.id} 
                    className={`px-3 py-1 rounded-full text-xs border ${getCategoryColor(force.category)} cursor-pointer`}
                    onClick={() => setSelectedForce(force)}
                  >
                    {force.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            {selectedForce ? (
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <h3 className="font-semibold text-white mb-3">{selectedForce.name}</h3>
                <p className="text-white/60 text-sm mb-3">{selectedForce.description}</p>
                <div className={`inline-block px-2 py-1 rounded text-xs ${getCategoryColor(selectedForce.category)}`}>
                  {selectedForce.category}
                </div>
                
                <div className="mt-4">
                  <h4 className="text-xs text-white/50 mb-2">Affected By</h4>
                  {impacts.filter(i => i.to === selectedForce.id).map((impact, i) => {
                    const source = forces.find(f => f.id === impact.from)
                    return source ? (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/70 mb-1">
                        <ArrowLeft className="h-3 w-3" />
                        {source.name} ({impact.strength})
                      </div>
                    ) : null
                  })}
                  {impacts.filter(i => i.to === selectedForce.id).length === 0 && (
                    <p className="text-white/40 text-sm">No incoming impacts</p>
                  )}
                </div>
                
                <div className="mt-3">
                  <h4 className="text-xs text-white/50 mb-2">Impacts</h4>
                  {impacts.filter(i => i.from === selectedForce.id).map((impact, i) => {
                    const target = forces.find(f => f.id === impact.to)
                    return target ? (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/70 mb-1">
                        <ArrowRight className="h-3 w-3" />
                        {target.name} ({impact.strength})
                      </div>
                    ) : null
                  })}
                  {impacts.filter(i => i.from === selectedForce.id).length === 0 && (
                    <p className="text-white/40 text-sm">No outgoing impacts</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
                <Zap className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                <p className="text-white/50 text-sm">Select a force to view details</p>
              </div>
            )}

            {/* AI Insights */}
            {analysisResult && (
              <div className="mt-4 bg-slate-800 rounded-xl p-4 border border-purple-500/30">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  AI Insights
                </h4>
                {analysisResult.leveragePoints && (
                  <div className="mb-3">
                    <div className="text-xs text-white/50 mb-1">Leverage Points</div>
                    <ul className="space-y-1">
                      {analysisResult.leveragePoints.map((point: string, i: number) => (
                        <li key={i} className="text-white text-sm">• {point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysisResult.feedbackLoops && (
                  <div className="mb-3">
                    <div className="text-xs text-white/50 mb-1">Feedback Loops</div>
                    <p className="text-white text-sm">{analysisResult.feedbackLoops}</p>
                  </div>
                )}
                {analysisResult.strategicRecommendations && (
                  <div>
                    <div className="text-xs text-white/50 mb-1">Recommendations</div>
                    <ul className="space-y-1">
                      {analysisResult.strategicRecommendations.map((rec: string, i: number) => (
                        <li key={i} className="text-purple-300 text-sm">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Force Modal */}
      {showAddForce && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add Force</h2>
              <button onClick={() => setShowAddForce(false)} className="text-white/50 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Name</label>
                <input
                  type="text"
                  value={newForce.name}
                  onChange={(e) => setNewForce({ ...newForce, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Description</label>
                <textarea
                  value={newForce.description}
                  onChange={(e) => setNewForce({ ...newForce, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Category</label>
                <select
                  value={newForce.category}
                  onChange={(e) => setNewForce({ ...newForce, category: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="technology">Technology</option>
                  <option value="political">Political</option>
                  <option value="economic">Economic</option>
                  <option value="social">Social</option>
                  <option value="environmental">Environmental</option>
                </select>
              </div>
              <button
                onClick={() => {
                  if (newForce.name) {
                    setForces([...forces, { ...newForce, id: Date.now().toString() } as Force])
                    setShowAddForce(false)
                    setNewForce({ name: '', description: '', category: 'technology' })
                  }
                }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium"
              >
                Add Force
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
