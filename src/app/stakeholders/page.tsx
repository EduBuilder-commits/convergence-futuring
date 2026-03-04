'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Brain, Loader2, Plus, Trash2, X, Users, User, UserCheck, UserX, MessageSquare } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

interface Stakeholder {
  id: string
  name: string
  group: string
  power: 'high' | 'medium' | 'low'
  interest: 'high' | 'medium' | 'low'
  concerns: string[]
  support: 'high' | 'medium' | 'low'
  resistance: 'high' | 'medium' | 'low'
}

const defaultStakeholders: Stakeholder[] = [
  {
    id: '1',
    name: 'School Board',
    group: 'Governance',
    power: 'high',
    interest: 'high',
    concerns: ['Budget', 'Student outcomes', 'Compliance'],
    support: 'high',
    resistance: 'low'
  },
  {
    id: '2',
    name: 'Superintendent',
    group: 'Administration',
    power: 'high',
    interest: 'high',
    concerns: ['Strategic alignment', 'Resource allocation'],
    support: 'high',
    resistance: 'low'
  },
  {
    id: '3',
    name: 'Teachers Union',
    group: 'Labor',
    power: 'high',
    interest: 'high',
    concerns: ['Working conditions', 'Compensation', 'Class sizes'],
    support: 'medium',
    resistance: 'medium'
  },
  {
    id: '4',
    name: 'Teachers',
    group: 'Staff',
    power: 'medium',
    interest: 'high',
    concerns: ['Workload', 'Professional development', 'Support'],
    support: 'high',
    resistance: 'low'
  },
  {
    id: '5',
    name: 'Parents',
    group: 'Community',
    power: 'medium',
    interest: 'high',
    concerns: ['Student safety', 'Academic quality', 'Communication'],
    support: 'high',
    resistance: 'low'
  },
  {
    id: '6',
    name: 'Students',
    group: 'Community',
    power: 'low',
    interest: 'high',
    concerns: ['Learning environment', 'Technology', 'College prep'],
    support: 'medium',
    resistance: 'low'
  },
  {
    id: '7',
    name: 'District Finance',
    group: 'Administration',
    power: 'high',
    interest: 'high',
    concerns: ['Budget constraints', 'Efficiency', 'Compliance'],
    support: 'high',
    resistance: 'medium'
  },
  {
    id: '8',
    name: 'Community Groups',
    group: 'Community',
    power: 'medium',
    interest: 'medium',
    concerns: ['Equity', 'Access', 'Services'],
    support: 'medium',
    resistance: 'low'
  }
]

export default function StakeholderAnalysisPage() {
  const [user, setUser] = useState<any>(null)
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(defaultStakeholders)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newStakeholder, setNewStakeholder] = useState<Partial<Stakeholder>>({
    name: '', group: '', power: 'medium', interest: 'medium', concerns: [], support: 'medium', resistance: 'low'
  })

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
          type: 'stakeholder_analysis',
          data: { stakeholders }
        })
      })
      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
    setAnalyzing(false)
  }

  const getPowerInterestPosition = (power: string, interest: string) => {
    if (power === 'high' && interest === 'high') return { x: 75, y: 75, label: 'Manage Closely', color: 'bg-green-500' }
    if (power === 'high' && interest === 'medium') return { x: 75, y: 50, label: 'Keep Satisfied', color: 'bg-blue-500' }
    if (power === 'high' && interest === 'low') return { x: 75, y: 25, label: 'Keep Informed', color: 'bg-yellow-500' }
    if (power === 'medium' && interest === 'high') return { x: 50, y: 75, label: 'Keep Informed', color: 'bg-blue-400' }
    if (power === 'medium' && interest === 'medium') return { x: 50, y: 50, label: 'Monitor', color: 'bg-gray-500' }
    if (power === 'medium' && interest === 'low') return { x: 50, y: 25, label: 'Monitor', color: 'bg-gray-400' }
    if (power === 'low' && interest === 'high') return { x: 25, y: 75, label: 'Keep Informed', color: 'bg-purple-500' }
    if (power === 'low' && interest === 'medium') return { x: 25, y: 50, label: 'Monitor', color: 'bg-gray-300' }
    return { x: 25, y: 25, label: 'Minimal Effort', color: 'bg-gray-200' }
  }

  const getResistanceColor = (resistance: string) => {
    if (resistance === 'high') return 'text-red-400'
    if (resistance === 'medium') return 'text-yellow-400'
    return 'text-green-400'
  }

  const getSupportColor = (support: string) => {
    if (support === 'high') return 'text-green-400'
    if (support === 'medium') return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <a href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
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
              <Users className="h-8 w-8 text-purple-400" />
              Stakeholder Analysis
            </h1>
            <p className="text-white/60">Power/Interest grid with AI-powered engagement strategies</p>
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
              onClick={() => setShowAddModal(true)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Stakeholder
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Power/Interest Grid */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">Power/Interest Grid</h2>
              
              {/* Grid */}
              <div className="relative bg-slate-900 rounded-lg p-4" style={{ height: '400px' }}>
                {/* Grid Lines */}
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-slate-700" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-slate-700" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-slate-700" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-slate-700" />
                
                {/* Labels */}
                <div className="absolute top-2 left-4 text-xs text-white/40">Low Power</div>
                <div className="absolute top-2 right-4 text-xs text-white/40">High Power</div>
                <div className="absolute bottom-2 left-4 text-xs text-white/40 rotate-0">Low Interest →</div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-white/40">High Interest →</div>
                
                {/* Stakeholder Dots */}
                {stakeholders.map((sh) => {
                  const pos = getPowerInterestPosition(sh.power, sh.interest)
                  return (
                    <div
                      key={sh.id}
                      onClick={() => setSelectedStakeholder(sh)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group ${pos.color} rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold hover:scale-125 transition-transform`}
                      style={{ left: `${pos.x}%`, top: `${100 - pos.y}%` }}
                    >
                      {sh.name.charAt(0)}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        {sh.name}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
                <div className="text-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mb-1" />
                  <span className="text-white/60">Manage Closely</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mx-auto mb-1" />
                  <span className="text-white/60">Keep Satisfied</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 rounded-full bg-purple-500 mx-auto mb-1" />
                  <span className="text-white/60">Keep Informed</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 rounded-full bg-gray-500 mx-auto mb-1" />
                  <span className="text-white/60">Monitor</span>
                </div>
              </div>
            </div>

            {/* Stakeholder List */}
            <div className="mt-6 bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h3 className="font-semibold text-white mb-3">All Stakeholders</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {stakeholders.map((sh) => (
                  <div
                    key={sh.id}
                    onClick={() => setSelectedStakeholder(sh)}
                    className={`bg-slate-900 rounded-lg p-3 cursor-pointer hover:bg-slate-700 ${selectedStakeholder?.id === sh.id ? 'border border-purple-500' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white">{sh.name}</div>
                        <div className="text-xs text-white/50">{sh.group}</div>
                      </div>
                      <div className="flex gap-2">
                        <span className={getSupportColor(sh.support)} title="Support">
                          {sh.support === 'high' ? <UserCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </span>
                        <span className={getResistanceColor(sh.resistance)} title="Resistance">
                          {sh.resistance === 'high' ? <UserX className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div>
            {selectedStakeholder ? (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">{selectedStakeholder.name}</h3>
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-lg p-3">
                    <div className="text-xs text-white/50 mb-1">Group</div>
                    <div className="text-white">{selectedStakeholder.group}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 rounded-lg p-3">
                      <div className="text-xs text-white/50 mb-1">Power</div>
                      <div className="text-white capitalize">{selectedStakeholder.power}</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <div className="text-xs text-white/50 mb-1">Interest</div>
                      <div className="text-white capitalize">{selectedStakeholder.interest}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 rounded-lg p-3">
                      <div className="text-xs text-white/50 mb-1">Support</div>
                      <div className={getSupportColor(selectedStakeholder.support)}>{selectedStakeholder.support}</div>
                    </div>
                    <div className="bg-s-lg p-3late-900 rounded">
                      <div className="text-xs text-white/50 mb-1">Resistance</div>
                      <div className={getResistanceColor(selectedStakeholder.resistance)}>{selectedStakeholder.resistance}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-2">Key Concerns</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStakeholder.concerns.map((c, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-700 rounded text-xs text-white/70">{c}</span>
                      ))}
                    </div>
                  </div>
                  {analysisResult?.stakeholderPositions && (
                    <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                      <div className="text-xs text-purple-300 mb-1">AI Engagement Strategy</div>
                      {analysisResult.stakeholderPositions.find((s: any) => s.name === selectedStakeholder.name)?.engagementStrategy && (
                        <p className="text-white text-sm">
                          {analysisResult.stakeholderPositions.find((s: any) => s.name === selectedStakeholder.name).engagementStrategy}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
                <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-white/50">Select a stakeholder to view details</p>
              </div>
            )}

            {/* AI Recommendations */}
            {analysisResult && (
              <div className="mt-4 bg-slate-800 rounded-xl p-4 border border-purple-500/30">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  AI Recommendations
                </h4>
                {analysisResult.coalitions && (
                  <div className="mb-3">
                    <div className="text-xs text-white/50 mb-1">Potential Coalitions</div>
                    <p className="text-white text-sm">{analysisResult.coalitions}</p>
                  </div>
                )}
                {analysisResult.recommendedActions && (
                  <div>
                    <div className="text-xs text-white/50 mb-1">Priority Actions</div>
                    <ul className="space-y-1">
                      {analysisResult.recommendedActions.map((action: string, i: number) => (
                        <li key={i} className="text-white text-sm flex items-start gap-2">
                          <MessageSquare className="h-3 w-3 text-purple-400 mt-1 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Stakeholder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add Stakeholder</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/50 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Name</label>
                <input
                  type="text"
                  value={newStakeholder.name}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Group</label>
                <input
                  type="text"
                  value={newStakeholder.group}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, group: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">Power</label>
                  <select
                    value={newStakeholder.power}
                    onChange={(e) => setNewStakeholder({ ...newStakeholder, power: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Interest</label>
                  <select
                    value={newStakeholder.interest}
                    onChange={(e) => setNewStakeholder({ ...newStakeholder, interest: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => {
                  if (newStakeholder.name) {
                    setStakeholders([...stakeholders, { ...newStakeholder, id: Date.now().toString(), concerns: [] } as Stakeholder])
                    setShowAddModal(false)
                    setNewStakeholder({ name: '', group: '', power: 'medium', interest: 'medium', concerns: [], support: 'medium', resistance: 'low' })
                  }
                }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium"
              >
                Add Stakeholder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
