'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Brain, Plus, Trash2, Loader2, AlertTriangle, CheckCircle, Clock, Users, TrendingUp, X } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

interface Scenario {
  id: string
  name: string
  description: string
  probability: number
  timeline: string
  riskScore: number
  equityImpact: 'high' | 'medium' | 'low'
  drivers: string[]
  indicators: string[]
  actions: string[]
  stakeholders: string[]
}

const defaultScenarios: Scenario[] = [
  {
    id: '1',
    name: 'Baseline',
    description: 'Current trends continue as expected',
    probability: 40,
    timeline: 'ongoing',
    riskScore: 25,
    equityImpact: 'low',
    drivers: ['Status quo maintained', 'Stable funding'],
    indicators: ['Enrollment stable', 'Test scores maintain'],
    actions: ['Continue current programs'],
    stakeholders: ['Board', 'Administration']
  },
  {
    id: '2',
    name: 'Transformation',
    description: 'Major technology and AI integration',
    probability: 25,
    timeline: '3-5 years',
    riskScore: 45,
    equityImpact: 'medium',
    drivers: ['AI adoption', 'Digital transformation'],
    indicators: ['Tech infrastructure needs', 'Training requirements'],
    actions: ['Invest in PD', 'Upgrade systems'],
    stakeholders: ['Tech dept', 'Teachers', 'IT']
  },
  {
    id: '3',
    name: 'Collapse',
    description: 'Significant budget cuts and enrollment decline',
    probability: 10,
    timeline: '1-2 years',
    riskScore: 85,
    equityImpact: 'high',
    drivers: ['Economic downturn', 'Funding reduction'],
    indicators: ['Budget projections', 'Enrollment trends'],
    actions: ['Build reserves', 'Prioritize core services'],
    stakeholders: ['Finance', 'Board']
  },
  {
    id: '4',
    name: 'Constraint',
    description: 'Limited resources, focused priorities',
    probability: 15,
    timeline: '2-3 years',
    riskScore: 55,
    equityImpact: 'medium',
    drivers: ['Funding constraints', 'Policy changes'],
    indicators: ['Budget announcements', 'Policy updates'],
    actions: ['Prioritize essentials', 'Seek grants'],
    stakeholders: ['Admin', 'Grant writers']
  },
  {
    id: '5',
    name: 'Wildcard',
    description: 'Unexpected disruption or opportunity',
    probability: 10,
    timeline: 'unpredictable',
    riskScore: 70,
    equityImpact: 'high',
    drivers: ['External factors', 'Unexpected events'],
    indicators: ['Monitor signals', 'Stay agile'],
    actions: ['Build flexibility', 'Create contingency plans'],
    stakeholders: ['All']
  }
]

export default function ScenarioMatrixPage() {
  const [user, setUser] = useState<any>(null)
  const [scenarios, setScenarios] = useState<Scenario[]>(defaultScenarios)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newScenario, setNewScenario] = useState<Partial<Scenario>>({
    name: '',
    description: '',
    probability: 20,
    timeline: '1-2 years',
    riskScore: 50,
    equityImpact: 'medium',
    drivers: [],
    indicators: [],
    actions: [],
    stakeholders: []
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
          type: 'scenario_analysis',
          data: { scenarios }
        })
      })
      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
    setAnalyzing(false)
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400 bg-red-400/10'
    if (score >= 50) return 'text-orange-400 bg-orange-400/10'
    if (score >= 30) return 'text-yellow-400 bg-yellow-400/10'
    return 'text-green-400 bg-green-400/10'
  }

  const getEquityColor = (impact: string) => {
    if (impact === 'high') return 'text-red-400'
    if (impact === 'medium') return 'text-yellow-400'
    return 'text-green-400'
  }

  const radarData = scenarios.map(s => ({
    scenario: s.name,
    risk: s.riskScore,
    probability: s.probability * 2,
    equity: s.equityImpact === 'high' ? 100 : s.equityImpact === 'medium' ? 60 : 30
  }))

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <a href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
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
              <TrendingUp className="h-8 w-8 text-purple-400" />
              Scenario Matrix
            </h1>
            <p className="text-white/60">Map and analyze strategic scenarios with AI</p>
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
              <Plus className="h-4 w-4" /> Add Scenario
            </button>
          </div>
        </div>

        {/* Scenario Cards Grid */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario)}
              className={`bg-slate-800 rounded-xl p-4 border-2 cursor-pointer transition-all hover:scale-105 ${
                selectedScenario?.id === scenario.id ? 'border-purple-500' : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">{scenario.name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs ${getRiskColor(scenario.riskScore)}`}>
                  {scenario.riskScore}
                </span>
              </div>
              <p className="text-xs text-white/60 mb-3 line-clamp-2">{scenario.description}</p>
              <div className="flex justify-between text-xs">
                <span className="text-white/50">{scenario.probability}%</span>
                <span className={getEquityColor(scenario.equityImpact)}>{scenario.equityImpact} equity</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">Scenario Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="scenario" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6B7280' }} />
                <Radar name="Risk" dataKey="risk" stroke="#F97316" fill="#F97316" fillOpacity={0.3} />
                <Radar name="Probability" dataKey="probability" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Selected Scenario Details */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              {selectedScenario ? selectedScenario.name : 'Select a Scenario'}
            </h2>
            {selectedScenario ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/50">Description</label>
                  <p className="text-white">{selectedScenario.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 rounded-lg p-3">
                    <div className="text-xs text-white/50">Probability</div>
                    <div className="text-xl font-bold text-white">{selectedScenario.probability}%</div>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <div className="text-xs text-white/50">Risk Score</div>
                    <div className={`text-xl font-bold ${getRiskColor(selectedScenario.riskScore).replace('bg-', '')}`}>
                      {selectedScenario.riskScore}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/50">Timeline</label>
                  <p className="text-white flex items-center gap-2">
                    <Clock className="h-4 w-4" /> {selectedScenario.timeline}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-white/50">Key Drivers</label>
                  <ul className="list-disc list-inside text-white/70">
                    {selectedScenario.drivers.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
                <div>
                  <label className="text-sm text-white/50">Early Indicators</label>
                  <ul className="list-disc list-inside text-white/70">
                    {selectedScenario.indicators.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
                <div>
                  <label className="text-sm text-white/50">Recommended Actions</label>
                  <ul className="list-disc list-inside text-white/70">
                    {selectedScenario.actions.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
                <div>
                  <label className="text-sm text-white/50">Affected Stakeholders</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedScenario.stakeholders.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-700 rounded text-xs text-white/70">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-white/50">Click on a scenario to view details</p>
            )}
          </div>
        </div>

        {/* AI Analysis Results */}
        {analysisResult && (
          <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              AI Analysis Results
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-white/50 mb-2">Scenario Assessments</h3>
                {analysisResult.analyses?.map((a: any, i: number) => (
                  <div key={i} className="bg-slate-900 rounded-lg p-3 mb-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-white">{a.scenario}</span>
                      <span className={`${getRiskColor(a.riskScore)} px-2 rounded text-xs`}>
                        Risk: {a.riskScore}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">{a.drivingFactors?.slice(0, 2).join(', ')}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-sm text-white/50 mb-2">Priority Actions</h3>
                <ul className="space-y-2">
                  {analysisResult.priorityActions?.map((action: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-white">
                      <CheckCircle className="h-4 w-4 text-green-400" /> {action}
                    </li>
                  ))}
                </ul>
                {analysisResult.crossScenarioInsights && (
                  <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
                    <p className="text-sm text-purple-300">{analysisResult.crossScenarioInsights}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Scenario Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add New Scenario</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/50 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Scenario Name</label>
                <input
                  type="text"
                  value={newScenario.name}
                  onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., Tech Integration"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Description</label>
                <textarea
                  value={newScenario.description}
                  onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">Probability %</label>
                  <input
                    type="number"
                    value={newScenario.probability}
                    onChange={(e) => setNewScenario({ ...newScenario, probability: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Risk Score</label>
                  <input
                    type="number"
                    value={newScenario.riskScore}
                    onChange={(e) => setNewScenario({ ...newScenario, riskScore: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (newScenario.name) {
                    setScenarios([...scenarios, { ...newScenario, id: Date.now().toString() } as Scenario])
                    setShowAddModal(false)
                    setNewScenario({ name: '', description: '', probability: 20, timeline: '1-2 years', riskScore: 50, equityImpact: 'medium', drivers: [], indicators: [], actions: [], stakeholders: [] })
                  }
                }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium"
              >
                Add Scenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
