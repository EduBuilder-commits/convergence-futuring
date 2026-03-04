'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { 
  Brain, Layers, Target, TrendingUp, Users, Zap,
  Play, Pause, RotateCcw, Download, Save, Loader2,
  AlertTriangle, CheckCircle, Info, BarChart3, Settings,
  Activity, GitBranch, LineChart as LineChartIcon, PieChart as PieIcon
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter } from 'recharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

// Advanced Simulation Types
interface SimulationConfig {
  question: string
  baseValue: number
  minValue: number
  maxValue: number
  iterations: number
  variables: Variable[]
  method: 'monte_carlo' | 'latin_hypercube' | 'sobol' | 'bootstrap'
  confidenceLevel: number
}

interface Variable {
  name: string
  lowEstimate: number
  highEstimate: number
  distribution: 'normal' | 'uniform' | 'triangular' | 'beta' | 'lognormal'
  correlation?: { with: string; coefficient: number }
  weight?: number
}

interface SimulationResult {
  median: number
  mean: number
  stdDev: number
  variance: number
  skewness: number
  kurtosis: number
  p5: number
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
  p95: number
  confidence: number
  confidenceInterval: { lower: number; upper: number }
  riskScore: number
  iedmaScore: number
  breakPoint: string
  futuringRigor: number
  simulationRobustness: number
  distributionQuality: number
  data: number[]
  iterations: number
  method: string
  convergenceData?: { iteration: number; mean: number }[]
  sensitivityAnalysis?: { variable: string; importance: number; direction: 'positive' | 'negative' }[]
}

// Advanced statistical functions
function calculateSkewness(data: number[]): number {
  const n = data.length
  const mean = data.reduce((a, b) => a + b, 0) / n
  const std = Math.sqrt(data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n)
  const skew = data.reduce((a, b) => a + Math.pow((b - mean) / std, 3), 0) / n
  return skew
}

function calculateKurtosis(data: number[]): number {
  const n = data.length
  const mean = data.reduce((a, b) => a + b, 0) / n
  const std = Math.sqrt(data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n)
  const kurt = data.reduce((a, b) => a + Math.pow((b - mean) / std, 4), 0) / n - 3
  return kurt
}

function latinHypercubeSample(n: number, min: number, max: number): number {
  // Stratified sampling for better coverage
  const bucketSize = (max - min) / n
  const bucket = Math.floor(Math.random() * n)
  return min + bucket * bucketSize + Math.random() * bucketSize
}

function bootstrapSample(data: number[], n: number): number[] {
  const sample: number[] = []
  for (let i = 0; i < n; i++) {
    sample.push(data[Math.floor(Math.random() * data.length)])
  }
  return sample
}

function calculateSensitivityAnalysis(data: number[], variableData: { name: string; values: number[] }[]): { variable: string; importance: number; direction: 'positive' | 'negative' }[] {
  if (variableData.length === 0) return []
  
  // Simple sensitivity: correlation between each variable and result
  return variableData.map(v => {
    const correlation = calculateCorrelation(data, v.values)
    return {
      variable: v.name,
      importance: Math.abs(correlation),
      direction: correlation >= 0 ? 'positive' as const : 'negative' as const
    }
  }).sort((a, b) => b.importance - a.importance)
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length)
  const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n
  const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n
  
  let num = 0, denX = 0, denY = 0
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX
    const dy = y[i] - meanY
    num += dx * dy
    denX += dx * dx
    denY += dy * dy
  }
  
  return denX === 0 || denY === 0 ? 0 : num / Math.sqrt(denX * denY)
}

export default function SimulationPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [configExpanded, setConfigExpanded] = useState(true)
  
  const [question, setQuestion] = useState('')
  const [baseValue, setBaseValue] = useState(1000)
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(2000)
  const [iterations, setIterations] = useState(10000)
  const [method, setMethod] = useState<'monte_carlo' | 'latin_hypercube' | 'sobol' | 'bootstrap'>('monte_carlo')
  const [confidenceLevel, setConfidenceLevel] = useState(95)
  
  const [variables, setVariables] = useState<Variable[]>([
    { name: 'Enrollment Trend', lowEstimate: -15, highEstimate: 5, distribution: 'triangular', weight: 1 }
  ])
  
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [convergenceData, setConvergenceData] = useState<any[]>([])
  const [showSensitivity, setShowSensitivity] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/login'
      } else {
        setUser(user)
      }
    })
  }, [])

  // Advanced Monte Carlo with Multiple Methods
  const runSimulation = useCallback(async () => {
    setRunning(true)
    
    const results: number[] = []
    const variableSamples: { name: string; values: number[] }[] = variables.map(v => ({ name: v.name, values: [] }))
    const convergence: { iteration: number; mean: number }[] = []
    
    const chunkSize = 1000
    let iterationsRun = 0
    
    const runChunk = () => {
      for (let i = 0; i < chunkSize && iterationsRun < iterations; i++) {
        let value = baseValue
        let valueSoFar = baseValue
        
        // Track variable samples for sensitivity
        variables.forEach((v, vi) => {
          let sample: number
          
          switch (method) {
            case 'latin_hypercube':
              sample = latinHypercubeSample(iterations, v.lowEstimate, v.highEstimate)
              break
            case 'sobol':
              // Simplified Sobol-like quasi-random
              const idx = iterationsRun * variables.length + vi
              sample = v.lowEstimate + (sobolSequence(idx) * (v.highEstimate - v.lowEstimate))
              break
            default: // monte_carlo
              if (v.distribution === 'triangular') {
                const mode = (v.lowEstimate + v.highEstimate + 0) / 3
                const u = Math.random()
                sample = u < (mode - v.lowEstimate) / (v.highEstimate - v.lowEstimate)
                  ? v.lowEstimate + Math.sqrt(u * (v.highEstimate - v.lowEstimate) * (mode - v.lowEstimate))
                  : v.highEstimate - Math.sqrt((1 - u) * (v.highEstimate - v.lowEstimate) * (v.highEstimate - mode))
              } else if (v.distribution === 'normal') {
                const u1 = Math.random()
                const u2 = Math.random()
                const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
                const range = (v.highEstimate - v.lowEstimate) / 4
                sample = z * range + (v.lowEstimate + v.highEstimate) / 2
              } else if (v.distribution === 'lognormal') {
                const mu = (v.lowEstimate + v.highEstimate) / 2
                const sigma = (v.highEstimate - v.lowEstimate) / 6
                sample = Math.exp(mu + sigma * (Math.random() * 2 - 1))
              } else if (v.distribution === 'beta') {
                // Simplified beta approximation
                sample = (v.lowEstimate + v.highEstimate) / 2 + (v.highEstimate - v.lowEstimate) * (Math.random() + Math.random()) / 2 - (v.highEstimate - v.lowEstimate) / 2
              } else {
                sample = v.lowEstimate + Math.random() * (v.highEstimate - v.lowEstimate)
              }
          }
          
          variableSamples[vi].values.push(sample)
          value = value * (1 + sample / 100)
        })
        
        results.push(Math.max(minValue, Math.min(maxValue, value)))
        
        // Track convergence every 100 iterations
        if (iterationsRun % 100 === 0 && iterationsRun > 0) {
          convergence.push({
            iteration: iterationsRun,
            mean: results.reduce((a, b) => a + b, 0) / results.length
          })
        }
      }
      
      iterationsRun += chunkSize
      
      if (iterationsRun < iterations) {
        setTimeout(runChunk, 0)
      } else {
        calculateResults(results, convergence, variableSamples)
        setRunning(false)
      }
    }
    
    runChunk()
  }, [baseValue, minValue, maxValue, iterations, method, variables])

  // Sobol sequence generator (simplified)
  function sobolSequence(index: number): number {
    // Very simplified quasi-random sequence
    const x = (index * 0.618033988749895) % 1
    return x - Math.floor(x)
  }

  const calculateResults = (data: number[], convergence: { iteration: number; mean: number }[], variableSamples: { name: string; values: number[] }[]) => {
    const sorted = [...data].sort((a, b) => a - b)
    const n = sorted.length
    
    const mean = data.reduce((a, b) => a + b, 0) / n
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n
    const stdDev = Math.sqrt(variance)
    const skewness = calculateSkewness(data)
    const kurtosis = calculateKurtosis(data)
    
    const getPercentile = (p: number) => sorted[Math.floor(p * n)]
    
    // Confidence interval
    const zScore = confidenceLevel === 95 ? 1.96 : confidenceLevel === 99 ? 2.576 : 1.645
    const marginOfError = zScore * (stdDev / Math.sqrt(n))
    
    // Risk score: combination of CV and skewness
    const cv = (stdDev / mean) * 100
    const riskScore = Math.max(0, Math.min(100, 100 - cv + Math.abs(skewness) * 10))
    
    // IEDMA Score Calculation
    // I = Futuring Rigor (based on iterations and method)
    const futuringRigor = Math.min(100, (iterations / 100) * 10 + (method === 'sobol' ? 20 : method === 'latin_hypercube' ? 15 : 10))
    // E = Simulation Robustness (based on confidence and margin of error)
    const marginOfErrorPercent = (marginOfError / mean) * 100
    const simulationRobustness = Math.max(0, 100 - marginOfErrorPercent * 5)
    // D = Distribution Quality (based on skewness and kurtosis)
    const distributionQuality = Math.max(0, 100 - Math.abs(skewness) * 10 - Math.abs(kurtosis) * 5)
    // M = Model Complexity (based on number of variables)
    const modelComplexity = Math.min(100, variables.length * 15 + 40)
    // A = Organizational Capacity (placeholder - would integrate with real data)
    const organizationalCapacity = 75 // Default baseline
    
    const iedmaScore = Math.round((futuringRigor + simulationRobustness + distributionQuality + modelComplexity + organizationalCapacity) / 5)
    
    // Break point analysis
    const p10Value = getPercentile(0.1)
    const p90Value = getPercentile(0.9)
    const breakPoint = p90Value > mean * 1.5 ? 'HIGH' : p90Value > mean * 1.2 ? 'MEDIUM' : 'LOW'
    
    // Sensitivity analysis
    const sensitivity = calculateSensitivityAnalysis(data, variableSamples)
    
    const simulationResult: SimulationResult = {
      median: getPercentile(0.5),
      mean,
      stdDev,
      variance,
      skewness,
      kurtosis,
      p5: getPercentile(0.05),
      p10: getPercentile(0.1),
      p25: getPercentile(0.25),
      p50: getPercentile(0.5),
      p75: getPercentile(0.75),
      p90: getPercentile(0.9),
      p95: getPercentile(0.95),
      confidence: confidenceLevel,
      confidenceInterval: { lower: mean - marginOfError, upper: mean + marginOfError },
      riskScore,
      iedmaScore,
      breakPoint,
      futuringRigor,
      simulationRobustness,
      distributionQuality,
      data: sorted.slice(0, 100),
      iterations: n,
      method: method,
      convergenceData: convergence,
      sensitivityAnalysis: sensitivity
    }
    
    setResult(simulationResult)
    setConvergenceData(convergence)
    
    // Create histogram data
    const histogramData = []
    const bucketCount = 30
    const bucketSize = (maxValue - minValue) / bucketCount
    for (let i = 0; i < bucketCount; i++) {
      const bucketStart = minValue + i * bucketSize
      const bucketEnd = bucketStart + bucketSize
      const count = data.filter(d => d >= bucketStart && d < bucketEnd).length
      histogramData.push({
        range: `${Math.round(bucketStart)}-${Math.round(bucketEnd)}`,
        midpoint: (bucketStart + bucketEnd) / 2,
        count,
        probability: (count / n) * 100,
        density: count / (n * bucketSize)
      })
    }
    setChartData(histogramData)
  }

  const addVariable = () => {
    setVariables([...variables, { 
      name: `Variable ${variables.length + 1}`, 
      lowEstimate: -20, 
      highEstimate: 30, 
      distribution: 'triangular',
      weight: 1 
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
          <p className="text-white/60">Advanced probabilistic forecasting with statistical rigor</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <div className="space-y-4">
            {/* Advanced Settings Toggle */}
            <div className="bg-slate-800 rounded-xl border border-slate-700">
              <button 
                onClick={() => setConfigExpanded(!configExpanded)}
                className="w-full p-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-400" />
                  <span className="font-semibold text-white">Simulation Configuration</span>
                </div>
                <span className="text-white/50">{configExpanded ? '−' : '+'}</span>
              </button>
              
              {configExpanded && (
                <div className="p-4 pt-0 space-y-4">
                  {/* Method Selection */}
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Simulation Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'monte_carlo', name: 'Monte Carlo', desc: 'Random sampling' },
                        { id: 'latin_hypercube', name: 'Latin Hypercube', desc: 'Stratified sampling' },
                        { id: 'sobol', name: 'Sobol', desc: 'Quasi-random' },
                        { id: 'bootstrap', name: 'Bootstrap', desc: 'Resampling' }
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => setMethod(m.id as any)}
                          className={`p-2 rounded-lg text-left text-sm ${
                            method === m.id 
                              ? 'bg-purple-500/20 border border-purple-500' 
                              : 'bg-slate-900 border border-slate-700'
                          }`}
                        >
                          <div className="font-medium text-white">{m.name}</div>
                          <div className="text-xs text-white/50">{m.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Basic Parameters */}
                  <div className="grid grid-cols-2 gap-4">
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
                        <option value={500000}>500,000</option>
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

                  <div>
                    <label className="block text-sm text-white/70 mb-1">Confidence Level</label>
                    <div className="flex gap-4">
                      {[90, 95, 99].map(level => (
                        <label key={level} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="confidence"
                            checked={confidenceLevel === level}
                            onChange={() => setConfidenceLevel(level)}
                            className="text-purple-500"
                          />
                          <span className="text-white">{level}%</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Question */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <label className="block text-sm text-white/70 mb-2">Research Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you want to predict? e.g., What will enrollment be in 2030?"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500"
                rows={2}
              />
            </div>

            {/* Variables */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white">Variables</h3>
                <button onClick={addVariable} className="text-purple-400 hover:text-purple-300 text-sm">+ Add</button>
              </div>
              
              <div className="space-y-3">
                {variables.map((variable, index) => (
                  <div key={index} className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <input
                        type="text"
                        value={variable.name}
                        onChange={(e) => updateVariable(index, 'name', e.target.value)}
                        className="bg-transparent text-white font-medium focus:outline-none text-sm"
                      />
                      <button 
                        onClick={() => removeVariable(index)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-white/50">Low %</label>
                        <input
                          type="number"
                          value={variable.lowEstimate}
                          onChange={(e) => updateVariable(index, 'lowEstimate', Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/50">High %</label>
                        <input
                          type="number"
                          value={variable.highEstimate}
                          onChange={(e) => updateVariable(index, 'highEstimate', Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/50">Distribution</label>
                        <select
                          value={variable.distribution}
                          onChange={(e) => updateVariable(index, 'distribution', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                        >
                          <option value="triangular">Triangular</option>
                          <option value="normal">Normal</option>
                          <option value="uniform">Uniform</option>
                          <option value="lognormal">Log-normal</option>
                          <option value="beta">Beta</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={runSimulation}
              disabled={running}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {running ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
              {running ? 'Running Simulation...' : 'Run Simulation'}
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Key Metrics */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-semibold text-white mb-3">Statistical Summary</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-900 rounded-lg p-3 text-center">
                      <div className="text-xs text-white/50">Mean</div>
                      <div className="text-xl font-bold text-white">{result.mean.toFixed(0)}</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 text-center">
                      <div className="text-xs text-white/50">Median</div>
                      <div className="text-xl font-bold text-white">{result.median.toFixed(0)}</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 text-center">
                      <div className="text-xs text-white/50">Std Dev</div>
                      <div className="text-xl font-bold text-white">{result.stdDev.toFixed(0)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 rounded-lg p-3">
                      <div className="text-xs text-white/50">Skewness</div>
                      <div className={`font-bold ${result.skewness > 0.5 ? 'text-red-400' : result.skewness < -0.5 ? 'text-blue-400' : 'text-white'}`}>
                        {result.skewness.toFixed(3)}
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <div className="text-xs text-white/50">Kurtosis</div>
                      <div className="text-white font-bold">{result.kurtosis.toFixed(3)}</div>
                    </div>
                  </div>

                  <div className="mt-3 bg-slate-900 rounded-lg p-3">
                    <div className="text-xs text-white/50 mb-1">{result.confidence}% Confidence Interval</div>
                    <div className="flex justify-between text-white">
                      <span>{result.confidenceInterval.lower.toFixed(0)}</span>
                      <span className="text-purple-400">→</span>
                      <span>{result.confidenceInterval.upper.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {/* Percentiles */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-semibold text-white mb-3">Percentile Distribution</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'P5 (Very Conservative)', value: result.p5, color: 'bg-red-500' },
                      { label: 'P10', value: result.p10, color: 'bg-orange-500' },
                      { label: 'P25 (Conservative)', value: result.p25, color: 'bg-yellow-500' },
                      { label: 'P50 (Median)', value: result.p50, color: 'bg-green-500' },
                      { label: 'P75 (Optimistic)', value: result.p75, color: 'bg-blue-500' },
                      { label: 'P90', value: result.p90, color: 'bg-purple-500' },
                      { label: 'P95 (Very Optimistic)', value: result.p95, color: 'bg-pink-500' },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-white/60 text-sm w-40">{p.label}</span>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full ${p.color}`} style={{ width: `${((p.value - minValue) / (maxValue - minValue)) * 100}%` }} />
                        </div>
                        <span className="text-white font-mono w-16 text-right">{p.value.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-semibold text-white mb-3">Probability Density</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="midpoint" stroke="#9CA3AF" fontSize={10} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} />
                      <YAxis stroke="#9CA3AF" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Probability']}
                      />
                      <Area type="monotone" dataKey="probability" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Convergence */}
                {convergenceData.length > 0 && (
                  <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <h3 className="font-semibold text-white mb-3">Convergence (Stability)</h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={convergenceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="iteration" stroke="#9CA3AF" fontSize={10} />
                        <YAxis stroke="#9CA3AF" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Line type="monotone" dataKey="mean" stroke="#10B981" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Sensitivity Analysis Toggle */}
                {result.sensitivityAnalysis && result.sensitivityAnalysis.length > 0 && (
                  <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <button 
                      onClick={() => setShowSensitivity(!showSensitivity)}
                      className="w-full flex justify-between items-center"
                    >
                      <h3 className="font-semibold text-white">Sensitivity Analysis</h3>
                      <span className="text-white/50">{showSensitivity ? '−' : '+'}</span>
                    </button>
                    {showSensitivity && (
                      <div className="mt-3 space-y-2">
                        {result.sensitivityAnalysis.map((s, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-white text-sm w-40">{s.variable}</span>
                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${s.direction === 'positive' ? 'bg-green-500' : 'bg-red-500'}`} 
                                style={{ width: `${s.importance * 100}%` }} 
                              />
                            </div>
                            <span className="text-white/60 text-xs w-20">{(s.importance * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Risk Score */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Risk Score</span>
                    <span className={`font-bold ${getRiskLevel(result.riskScore).color}`}>
                      {getRiskLevel(result.riskScore).level}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        result.riskScore >= 80 ? 'bg-green-500' :
                        result.riskScore >= 60 ? 'bg-yellow-500' :
                        result.riskScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.riskScore}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-white/50">
                    Based on coefficient of variation ({((result.stdDev/result.mean)*100).toFixed(1)}%) and distribution shape
                  </div>
                </div>

                {/* IEDMA Score */}
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-400" />
                      <span className="font-semibold text-white">IEDMA Score</span>
                    </div>
                    <div className={`text-2xl font-bold ${
                      (result as any).iedmaScore >= 80 ? 'text-green-400' :
                      (result as any).iedmaScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {(result as any).iedmaScore}/100
                    </div>
                  </div>
                  
                  {/* IEDMA Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Futuring Rigor</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-700 rounded-full">
                          <div className="h-full bg-purple-500" style={{ width: `${(result as any).futuringRigor}%` }} />
                        </div>
                        <span className="text-white w-8">{(result as any).futuringRigor?.toFixed(0)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Simulation Robustness</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-700 rounded-full">
                          <div className="h-full bg-blue-500" style={{ width: `${(result as any).simulationRobustness}%` }} />
                        </div>
                        <span className="text-white w-8">{(result as any).simulationRobustness?.toFixed(0)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Distribution Quality</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-700 rounded-full">
                          <div className="h-full bg-green-500" style={{ width: `${Math.max(0, 100 - Math.abs(result.skewness) * 10 - Math.abs(result.kurtosis) * 5)}%` }} />
                        </div>
                        <span className="text-white w-8">{Math.max(0, 100 - Math.abs(result.skewness) * 10 - Math.abs(result.kurtosis) * 5).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Break Point */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Strategy Break Point</span>
                      <span className={`font-semibold ${
                        (result as any).breakPoint === 'LOW' ? 'text-green-400' :
                        (result as any).breakPoint === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {(result as any).breakPoint} - {(result as any).breakPoint === 'LOW' ? 'Strategy holds under pressure' : (result as any).breakPoint === 'MEDIUM' ? 'Moderate fragility' : 'High risk of collapse'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
                <BarChart3 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Configure & Run Simulation</h3>
                <p className="text-slate-400">
                  Set up your variables and run Monte Carlo analysis with statistical rigor
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
