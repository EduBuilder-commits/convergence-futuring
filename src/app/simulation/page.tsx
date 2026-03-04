'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { 
  Brain, Layers, Target, TrendingUp, Users, Zap,
  Play, Pause, RotateCcw, Download, Save, Loader2,
  AlertTriangle, CheckCircle, Info, BarChart3
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

// Simulation Types
interface SimulationConfig {
  question: string
  baseValue: number
  minValue: number
  maxValue: number
  iterations: number
  variables: Variable[]
}

interface Variable {
  name: string
  lowEstimate: number
  highEstimate: number
  distribution: 'normal' | 'uniform' | 'triangular'
}

interface SimulationResult {
  median: number
  mean: number
  stdDev: number
  p10: number
  p25: number
  p75: number
  p90: number
  confidence: number
  riskScore: number
  data: number[]
  iterations: number
}

export default function SimulationPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  
  const [question, setQuestion] = useState('')
  const [baseValue, setBaseValue] = useState(1000)
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(2000)
  const [iterations, setIterations] = useState(10000)
  
  const [variables, setVariables] = useState<Variable[]>([
    { name: 'Variable 1', lowEstimate: -20, highEstimate: 30, distribution: 'triangular' }
  ])
  
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [simulationsThisWeek, setSimulationsThisWeek] = useState(0)

  // Tier-based limits
  const TIER_LIMITS = {
    free: { simulations: 2, maxIterations: 1000 },
    pro: { simulations: Infinity, maxIterations: 100000 },
    enterprise: { simulations: Infinity, maxIterations: 1000000 }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/login'
      } else {
        setUser(user)
        // Fetch profile for tier
        supabase.from('profiles').select('*').eq('id', user.id).single()
          .then(({ data }) => {
            setProfile(data)
            // Check simulation count this week (stored in localStorage for demo)
            const count = parseInt(localStorage.getItem('simulationsThisWeek') || '0')
            setSimulationsThisWeek(count)
          })
      }
    })
  }, [])

  const getUserTier = () => profile?.subscription_tier || 'free'
  const getLimit = () => TIER_LIMITS[getUserTier() as keyof typeof TIER_LIMITS] || TIER_LIMITS.free

  const canRunSimulation = () => {
    const limit = getLimit()
    if (limit.simulations === Infinity) return true
    return simulationsThisWeek < limit.simulations
  }

  const getRemainingSimulations = () => {
    const limit = getLimit()
    if (limit.simulations === Infinity) return 'Unlimited'
    return Math.max(0, limit.simulations - simulationsThisWeek)
  }

  const handleSimulationComplete = () => {
    // Increment counter for free tier
    if (getUserTier() === 'free') {
      const newCount = simulationsThisWeek + 1
      setSimulationsThisWeek(newCount)
      localStorage.setItem('simulationsThisWeek', newCount.toString())
    }
  }

  // Monte Carlo Simulation Engine
  const runSimulation = useCallback(async () => {
    setRunning(true)
    
    // Run simulation in chunks to avoid blocking
    const results: number[] = []
    const chunkSize = 1000
    let iterationsRun = 0
    
    const runChunk = () => {
      for (let i = 0; i < chunkSize && iterationsRun < iterations; i++) {
        let value = baseValue
        
        for (const variable of variables) {
          let randomValue: number
          
          if (variable.distribution === 'uniform') {
            randomValue = variable.lowEstimate + Math.random() * (variable.highEstimate - variable.lowEstimate)
          } else if (variable.distribution === 'triangular') {
            const mode = (variable.lowEstimate + variable.highEstimate + baseValue) / 3
            const u = Math.random()
            randomValue = u < (mode - variable.lowEstimate) / (variable.highEstimate - variable.lowEstimate)
              ? variable.lowEstimate + Math.sqrt(u * (variable.highEstimate - variable.lowEstimate) * (mode - variable.lowEstimate))
              : variable.highEstimate - Math.sqrt((1 - u) * (variable.highEstimate - variable.lowEstimate) * (variable.highEstimate - mode))
          } else {
            // Normal distribution using Box-Muller
            const u1 = Math.random()
            const u2 = Math.random()
            const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
            const range = (variable.highEstimate - variable.lowEstimate) / 4
            randomValue = z * range + (variable.lowEstimate + variable.highEstimate) / 2
          }
          
          value = value * (1 + randomValue / 100)
        }
        
        results.push(Math.max(minValue, Math.min(maxValue, value)))
      }
      
      iterationsRun += chunkSize
      
      if (iterationsRun < iterations) {
        setTimeout(runChunk, 0)
      } else {
        calculateResults(results)
        setRunning(false)
        handleSimulationComplete()
      }
    }
    
    runChunk()
  }, [baseValue, minValue, maxValue, iterations, variables])

  const calculateResults = (data: number[]) => {
    const sorted = [...data].sort((a, b) => a - b)
    const n = sorted.length
    
    const mean = data.reduce((a, b) => a + b, 0) / n
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n
    const stdDev = Math.sqrt(variance)
    
    const getPercentile = (p: number) => sorted[Math.floor(p * n)]
    
    // Risk score: lower variance = lower risk
    const riskScore = Math.max(0, Math.min(100, 100 - (stdDev / mean) * 100))
    
    const simulationResult: SimulationResult = {
      median: getPercentile(0.5),
      mean,
      stdDev,
      p10: getPercentile(0.1),
      p25: getPercentile(0.25),
      p75: getPercentile(0.75),
      p90: getPercentile(0.9),
      confidence: 95,
      riskScore,
      data: sorted.slice(0, 100), // Sample for display
      iterations: n
    }
    
    setResult(simulationResult)
    
    // Create histogram data
    const histogramData = []
    const bucketCount = 20
    const bucketSize = (maxValue - minValue) / bucketCount
    for (let i = 0; i < bucketCount; i++) {
      const bucketStart = minValue + i * bucketSize
      const bucketEnd = bucketStart + bucketSize
      const count = data.filter(d => d >= bucketStart && d < bucketEnd).length
      histogramData.push({
        range: `${Math.round(bucketStart)}-${Math.round(bucketEnd)}`,
        count,
        probability: (count / n) * 100
      })
    }
    setChartData(histogramData)
  }

  const addVariable = () => {
    setVariables([...variables, { 
      name: `Variable ${variables.length + 1}`, 
      lowEstimate: -20, 
      highEstimate: 30, 
      distribution: 'triangular' 
    }])
  }

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index))
  }

  const updateVariable = (index: number, field: keyof Variable, value: any) => {
    const updated = [...variables]
    updated[index] = { ...updated[index], [field]: value }
    setVariables(updated)
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Low', color: 'text-green-400', icon: CheckCircle }
    if (score >= 60) return { level: 'Medium', color: 'text-yellow-400', icon: AlertTriangle }
    if (score >= 40) return { level: 'High', color: 'text-orange-400', icon: AlertTriangle }
    return { level: 'Very High', color: 'text-red-400', icon: AlertTriangle }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-green-400" />
            Monte Carlo Simulation
          </h1>
          <p className="text-white/60">Run probability simulations with 10,000+ iterations</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">Simulation Question</h2>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you want to predict? e.g., What will enrollment be in 2030?"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                rows={3}
              />
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">Parameters</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">Base Value</label>
                  <input
                    type="number"
                    value={baseValue}
                    onChange={(e) => setBaseValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Iterations</label>
                  <select
                    value={iterations}
                    onChange={(e) => setIterations(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value={1000}>1,000</option>
                    <option value={5000}>5,000</option>
                    <option value={10000}>10,000</option>
                    <option value={50000}>50,000</option>
                    <option value={100000}>100,000</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">Min Value</label>
                  <input
                    type="number"
                    value={minValue}
                    onChange={(e) => setMinValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Max Value</label>
                  <input
                    type="number"
                    value={maxValue}
                    onChange={(e) => setMaxValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Variables</h2>
                <button onClick={addVariable} className="text-purple-400 hover:text-purple-300 text-sm">
                  + Add Variable
                </button>
              </div>
              
              <div className="space-y-4">
                {variables.map((variable, index) => (
                  <div key={index} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <div className="flex justify-between items-center mb-3">
                      <input
                        type="text"
                        value={variable.name}
                        onChange={(e) => updateVariable(index, 'name', e.target.value)}
                        className="bg-transparent border-none text-white font-medium focus:outline-none"
                      />
                      <button 
                        onClick={() => removeVariable(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                        disabled={variables.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-white/50 mb-1">Low Estimate (%)</label>
                        <input
                          type="number"
                          value={variable.lowEstimate}
                          onChange={(e) => updateVariable(index, 'lowEstimate', Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 mb-1">High Estimate (%)</label>
                        <input
                          type="number"
                          value={variable.highEstimate}
                          onChange={(e) => updateVariable(index, 'highEstimate', Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 mb-1">Distribution</label>
                        <select
                          value={variable.distribution}
                          onChange={(e) => updateVariable(index, 'distribution', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                        >
                          <option value="triangular">Triangular</option>
                          <option value="normal">Normal</option>
                          <option value="uniform">Uniform</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier Limits Info */}
            <div className="bg-slate-800 rounded-lg p-3 mb-4 flex justify-between items-center">
              <div>
                <span className="text-white/70 text-sm">Your tier: </span>
                <span className={`font-semibold ${
                  getUserTier() === 'enterprise' ? 'text-purple-400' :
                  getUserTier() === 'pro' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {getUserTier().toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-white/70 text-sm">Simulations this week: </span>
                <span className="font-semibold text-white">{getRemainingSimulations()}</span>
              </div>
            </div>

            <button
              onClick={runSimulation}
              disabled={running || !canRunSimulation()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {running ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : !canRunSimulation() ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
              {running ? 'Running Simulation...' : !canRunSimulation() ? 'Weekly Limit Reached' : 'Run Simulation'}
            </button>
            {!canRunSimulation() && (
              <p className="text-center text-white/50 text-sm">
                Upgrade to Pro for unlimited simulations
              </p>
            )}
          </div>

          {/* Results */}
          <div className="space-y-6">
            {result ? (
              <>
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h2 className="text-lg font-semibold text-white mb-4">Results</h2>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-900 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">{result.mean.toFixed(0)}</div>
                      <div className="text-xs text-white/50">Mean</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">{result.median.toFixed(0)}</div>
                      <div className="text-xs text-white/50">Median</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">{result.stdDev.toFixed(0)}</div>
                      <div className="text-xs text-white/50">Std Dev</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-900 rounded-lg p-4">
                      <div className="text-sm text-white/50 mb-1">P10 (Conservative)</div>
                      <div className="text-xl font-bold text-red-400">{result.p10.toFixed(0)}</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4">
                      <div className="text-sm text-white/50 mb-1">P90 (Optimistic)</div>
                      <div className="text-xl font-bold text-green-400">{result.p90.toFixed(0)}</div>
                    </div>
                  </div>

                  {/* Risk Score */}
                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70">Risk Score</span>
                      <span className={`font-bold ${getRiskLevel(result.riskScore).color}`}>
                        {getRiskLevel(result.riskScore).level}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          result.riskScore >= 80 ? 'bg-green-500' :
                          result.riskScore >= 60 ? 'bg-yellow-500' :
                          result.riskScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.riskScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h2 className="text-lg font-semibold text-white mb-4">Probability Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="range" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="probability" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Save & Export */}
                <div className="flex gap-4">
                  <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                    <Save className="h-4 w-4" /> Save Simulation
                  </button>
                  <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" /> Export PDF
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
                <BarChart3 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Simulation Run Yet</h3>
                <p className="text-slate-400">
                  Configure your parameters and run a Monte Carlo simulation to see probability distributions
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
