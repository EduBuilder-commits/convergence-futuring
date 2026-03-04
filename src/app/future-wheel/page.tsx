'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Brain, Loader2, RotateCcw, ZoomIn, ZoomOut, X, Plus, ArrowRight } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

interface Impact {
  text: string
  type: 'positive' | 'negative' | 'neutral'
  order: number
}

interface FutureWheelData {
  center: string
  firstOrder: Impact[]
  secondOrder: Impact[]
  thirdOrder: Impact[]
}

export default function FutureWheelPage() {
  const [user, setUser] = useState<any>(null)
  const [centerTrend, setCenterTrend] = useState('AI Integration in Schools')
  const [context, setContext] = useState('K-12 Education District')
  const [wheelData, setWheelData] = useState<FutureWheelData>({
    center: 'AI Integration',
    firstOrder: [
      { text: 'Automated grading', type: 'neutral', order: 1 },
      { text: 'Personalized learning', type: 'positive', order: 1 },
      { text: 'Teacher workload reduction', type: 'positive', order: 1 },
      { text: 'Digital divide widening', type: 'negative', order: 1 }
    ],
    secondOrder: [
      { text: 'Curriculum redesign needed', type: 'negative', order: 2 },
      { text: 'New assessment methods', type: 'neutral', order: 2 },
      { text: 'Parent engagement tools', type: 'positive', order: 2 },
      { text: 'Equity concerns emerge', type: 'negative', order: 2 }
    ],
    thirdOrder: [
      { text: 'Policy changes required', type: 'neutral', order: 3 },
      { text: 'Budget reallocation', type: 'negative', order: 3 },
      { text: 'Community debates', type: 'negative', order: 3 }
    ]
  })
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [zoom, setZoom] = useState(1)
  const [selectedImpact, setSelectedImpact] = useState<Impact | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newImpact, setNewImpact] = useState<{ text: string; type: 'positive' | 'negative' | 'neutral'; order: number }>({
    text: '', type: 'positive', order: 1
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
          type: 'future_wheel',
          data: { trend: centerTrend, context }
        })
      })
      const result = await response.json()
      setAnalysisResult(result)
      if (result.firstOrder) {
        setWheelData({
          center: result.center || centerTrend,
          firstOrder: result.firstOrder || [],
          secondOrder: result.secondOrder || [],
          thirdOrder: result.thirdOrder || []
        })
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    }
    setAnalyzing(false)
  }

  const getImpactColor = (type: string, order: number) => {
    const baseColors = {
      positive: { 1: 'bg-green-500', 2: 'bg-green-400/70', 3: 'bg-green-300/50' },
      negative: { 1: 'bg-red-500', 2: 'bg-red-400/70', 3: 'bg-red-300/50' },
      neutral: { 1: 'bg-blue-500', 2: 'bg-blue-400/70', 3: 'bg-blue-300/50' }
    }
    return baseColors[type as keyof typeof baseColors]?.[order as keyof typeof baseColors.positive] || 'bg-gray-500'
  }

  const addImpact = () => {
    if (!newImpact.text) return
    const orderKey = newImpact.order as 1 | 2 | 3
    if (orderKey === 1) {
      setWheelData({ ...wheelData, firstOrder: [...wheelData.firstOrder, newImpact] })
    } else if (orderKey === 2) {
      setWheelData({ ...wheelData, secondOrder: [...wheelData.secondOrder, newImpact] })
    } else {
      setWheelData({ ...wheelData, thirdOrder: [...wheelData.thirdOrder, newImpact] })
    }
    setNewImpact({ text: '', type: 'positive', order: 1 })
    setShowAddModal(false)
  }

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
              <RotateCcw className="h-8 w-8 text-purple-400" />
              Future Wheel
            </h1>
            <p className="text-white/60">Map direct and indirect impacts of trends</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
              <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="p-2 text-white/70 hover:text-white">
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-white/70 text-sm">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-2 text-white/70 hover:text-white">
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={runAIAnalysis}
              disabled={analyzing}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              AI Analysis
            </button>
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Central Trend/Force</label>
              <input
                type="text"
                value={centerTrend}
                onChange={(e) => setCenterTrend(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Context</label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Future Wheel Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">Impact Wheel</h2>
              <div 
                className="relative flex items-center justify-center"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
              >
                <svg viewBox="0 0 500 500" className="w-full max-w-lg">
                  {/* Third Order Ring */}
                  <circle cx="250" cy="250" r="200" fill="none" stroke="#374151" strokeWidth="2" strokeDasharray="5,5" />
                  <circle cx="250" cy="250" r="160" fill="none" stroke="#4B5563" strokeWidth="40" opacity="0.3" />
                  
                  {/* Second Order Ring */}
                  <circle cx="250" cy="250" r="120" fill="none" stroke="#374151" strokeWidth="2" strokeDasharray="5,5" />
                  <circle cx="250" cy="250" r="80" fill="none" stroke="#6B7280" strokeWidth="40" opacity="0.3" />
                  
                  {/* First Order Ring */}
                  <circle cx="250" cy="250" r="60" fill="none" stroke="#374151" strokeWidth="2" />
                  
                  {/* Center */}
                  <circle cx="250" cy="250" r="25" fill="url(#centerGradient)" />
                  <text x="250" y="255" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                    {wheelData.center.substring(0, 10)}
                  </text>
                  
                  <defs>
                    <radialGradient id="centerGradient">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </radialGradient>
                  </defs>
                  
                  {/* First Order Impacts */}
                  {wheelData.firstOrder.map((impact, i) => {
                    const angle = (i * 360 / wheelData.firstOrder.length - 90) * Math.PI / 180
                    const x = 250 + 42 * Math.cos(angle)
                    const y = 250 + 42 * Math.sin(angle)
                    return (
                      <g key={`f1-${i}`} onClick={() => setSelectedImpact(impact)} style={{ cursor: 'pointer' }}>
                        <circle cx={x} cy={y} r="12" className={getImpactColor(impact.type, 1)} />
                        <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="5">{impact.text.substring(0, 8)}</text>
                        <line x1="250" y1="250" x2={x} y2={y} stroke="#9CA3AF" strokeWidth="1" />
                      </g>
                    )
                  })}
                  
                  {/* Second Order Impacts */}
                  {wheelData.secondOrder.map((impact, i) => {
                    const angle = (i * 360 / Math.max(wheelData.secondOrder.length, 1) - 90) * Math.PI / 180
                    const x = 250 + 100 * Math.cos(angle)
                    const y = 250 + 100 * Math.sin(angle)
                    return (
                      <g key={`f2-${i}`} onClick={() => setSelectedImpact(impact)} style={{ cursor: 'pointer' }}>
                        <circle cx={x} cy={y} r="10" className={getImpactColor(impact.type, 2)} />
                        <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="4">{impact.text.substring(0, 10)}</text>
                      </g>
                    )
                  })}
                  
                  {/* Third Order Impacts */}
                  {wheelData.thirdOrder.map((impact, i) => {
                    const angle = (i * 360 / Math.max(wheelData.thirdOrder.length, 1) - 90) * Math.PI / 180
                    const x = 250 + 180 * Math.cos(angle)
                    const y = 250 + 180 * Math.sin(angle)
                    return (
                      <g key={`f3-${i}`} onClick={() => setSelectedImpact(impact)} style={{ cursor: 'pointer' }}>
                        <circle cx={x} cy={y} r="8" className={getImpactColor(impact.type, 3)} />
                        <text x={x} y={y + 3} textAnchor="middle" fill="white" fontSize="3">{impact.text.substring(0, 12)}</text>
                      </g>
                    )
                  })}
                </svg>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-white/60 text-sm">Positive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-white/60 text-sm">Negative</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-white/60 text-sm">Neutral</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Impact
              </button>
            </div>
          </div>

          {/* Details Panel */}
          <div className="space-y-4">
            {/* First Order */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-green-400" />
                First Order (Direct)
              </h3>
              <div className="space-y-2">
                {wheelData.firstOrder.map((impact, i) => (
                  <div key={i} className="bg-slate-900 rounded-lg p-2 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getImpactColor(impact.type, 1)}`} />
                    <span className="text-white text-sm">{impact.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Second Order */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-yellow-400" />
                Second Order (Indirect)
              </h3>
              <div className="space-y-2">
                {wheelData.secondOrder.map((impact, i) => (
                  <div key={i} className="bg-slate-900 rounded-lg p-2 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getImpactColor(impact.type, 2)}`} />
                    <span className="text-white text-sm">{impact.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Third Order */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-400" />
                Third Order (Ripple)
              </h3>
              <div className="space-y-2">
                {wheelData.thirdOrder.map((impact, i) => (
                  <div key={i} className="bg-slate-900 rounded-lg p-2 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getImpactColor(impact.type, 3)}`} />
                    <span className="text-white text-sm">{impact.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            {analysisResult && (
              <div className="bg-slate-800 rounded-xl p-4 border border-purple-500/30">
                <h3 className="font-semibold text-white mb-3">AI Insights</h3>
                {analysisResult.interconnections && (
                  <p className="text-white/70 text-sm mb-2">
                    <strong>Connections:</strong> {analysisResult.interconnections}
                  </p>
                )}
                {analysisResult.criticalUncertainties && (
                  <p className="text-white/70 text-sm">
                    <strong>Uncertainties:</strong> {analysisResult.criticalUncertainties}
                  </p>
                )}
                {analysisResult.strategicImplications && (
                  <p className="text-purple-300 text-sm mt-2">{analysisResult.strategicImplications}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Impact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add Impact</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/50 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Impact Description</label>
                <input
                  type="text"
                  value={newImpact.text}
                  onChange={(e) => setNewImpact({ ...newImpact, text: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., Budget cuts"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Type</label>
                <select
                  value={newImpact.type}
                  onChange={(e) => setNewImpact({ ...newImpact, type: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Order</label>
                <select
                  value={newImpact.order}
                  onChange={(e) => setNewImpact({ ...newImpact, order: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value={1}>First Order (Direct)</option>
                  <option value={2}>Second Order (Indirect)</option>
                  <option value={3}>Third Order (Ripple)</option>
                </select>
              </div>
              <button
                onClick={addImpact}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium"
              >
                Add Impact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
