'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Brain, Loader2, Users, AlertTriangle, TrendingUp, TrendingDown, Activity, PieChart, BarChart3, Scale } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPie, Pie, Cell } from 'recharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

interface SubgroupData {
  name: string
  current: number
  target: number
  baseline: number
  gap: number
  trend: 'improving' | 'stable' | 'declining'
}

const defaultSubgroups: SubgroupData[] = [
  { name: 'All Students', current: 52, target: 60, baseline: 48, gap: 0, trend: 'improving' },
  { name: 'English Learners', current: 38, target: 50, baseline: 32, gap: -14, trend: 'improving' },
  { name: 'Socioeconomically Disadvantaged', current: 41, target: 55, baseline: 36, gap: -11, trend: 'stable' },
  { name: 'Students with Disabilities', current: 28, target: 40, baseline: 24, gap: -24, trend: 'stable' },
  { name: 'Foster Youth', current: 22, target: 35, baseline: 18, gap: -30, trend: 'improving' },
  { name: 'Homeless Students', current: 30, target: 45, baseline: 26, gap: -22, trend: 'declining' },
  { name: 'African American', current: 35, target: 50, baseline: 30, gap: -17, trend: 'stable' },
  { name: 'Hispanic/Latino', current: 42, target: 55, baseline: 38, gap: -10, trend: 'improving' },
  { name: 'Asian', current: 68, target: 75, baseline: 62, gap: 16, trend: 'improving' },
  { name: 'White', current: 62, target: 70, baseline: 58, gap: 10, trend: 'stable' }
]

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#06B6D4', '#84CC16']

export default function EquityPage() {
  const [user, setUser] = useState<any>(null)
  const [subgroups, setSubgroups] = useState<SubgroupData[]>(defaultSubgroups)
  const [selectedSubgroup, setSelectedSubgroup] = useState<SubgroupData | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [projectionYears, setProjectionYears] = useState(5)
  const [interventionEffect, setInterventionEffect] = useState(5)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/login'
      } else {
        setUser(user)
      }
    })
  }, [])

  // Calculate equity gap metrics
  const calculateEquityMetrics = () => {
    const gaps = subgroups.map(s => s.gap)
    const largestGap = Math.min(...gaps.filter(g => g < 0))
    const avgGap = gaps.filter(g => g < 0).reduce((a, b) => a + b, 0) / gaps.filter(g => g < 0).length
    
    // Equity score: 100 = perfect equity
    const equityScore = Math.max(0, 100 + (largestGap * 2) + avgGap)
    
    // Gap closure rate needed
    const gapClosureRate = (subgroups.filter(s => s.gap < 0).length / subgroups.length) * 100
    
    return { largestGap, avgGap, equityScore, gapClosureRate }
  }

  // Project future performance
  const projectPerformance = (subgroup: SubgroupData, years: number) => {
    const annualGrowthRate = interventionEffect / 100
    const projections = []
    
    for (let year = 1; year <= years; year++) {
      let projected: number
      if (subgroup.trend === 'improving') {
        projected = subgroup.current + (subgroup.current * annualGrowthRate * year)
      } else if (subgroup.trend === 'declining') {
        projected = subgroup.current - (subgroup.current * (annualGrowthRate / 2) * year)
      } else {
        projected = subgroup.current + (subgroup.current * (annualGrowthRate / 3) * year)
      }
      projections.push({
        year: `Year ${year}`,
        value: Math.min(100, Math.max(0, projected)),
        target: subgroup.target
      })
    }
    return projections
  }

  const runAIAnalysis = async () => {
    setAnalyzing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'equity_projection',
          data: { 
            subgroups: subgroups.map(s => ({
              name: s.name,
              current: s.current,
              target: s.target,
              gap: s.gap
            })),
            context: 'K-12 District'
          }
        })
      })
      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
    setAnalyzing(false)
  }

  const metrics = calculateEquityMetrics()
  
  // Chart data
  const gapChartData = subgroups
    .filter(s => s.name !== 'All Students')
    .sort((a, b) => a.gap - b.gap)
    .map(s => ({
      name: s.name,
      gap: s.gap,
      status: s.gap <= -20 ? 'critical' : s.gap <= -10 ? 'warning' : 'ok'
    }))

  const trendChartData = selectedSubgroup ? projectPerformance(selectedSubgroup, projectionYears) : []

  const getGapColor = (gap: number) => {
    if (gap <= -20) return 'bg-red-500'
    if (gap <= -10) return 'bg-yellow-500'
    if (gap >= 0) return 'bg-green-500'
    return 'bg-orange-500'
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="h-4 w-4 text-green-400" />
    if (trend === 'declining') return <TrendingDown className="h-4 w-4 text-red-400" />
    return <Activity className="h-4 w-4 text-yellow-400" />
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <a href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Scale className="h-6 w-6 text-white" />
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
              <Scale className="h-8 w-8 text-purple-400" />
              Equity Projections
            </h1>
            <p className="text-white/60">Analyze achievement gaps and project equity-focused outcomes</p>
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

        {/* Equity Score Dashboard */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-white/50 mb-1">Equity Score</div>
            <div className={`text-3xl font-bold ${
              metrics.equityScore >= 70 ? 'text-green-400' : 
              metrics.equityScore >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.equityScore.toFixed(0)}
            </div>
            <div className="text-xs text-white/40">/ 100</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-white/50 mb-1">Largest Gap</div>
            <div className="text-3xl font-bold text-red-400">
              {metrics.largestGap}%
            </div>
            <div className="text-xs text-white/40">vs All Students</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-white/50 mb-1">Avg Gap</div>
            <div className="text-3xl font-bold text-orange-400">
              {metrics.avgGap.toFixed(1)}%
            </div>
            <div className="text-xs text-white/40">subgroups below</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-white/50 mb-1">Subgroups At Risk</div>
            <div className="text-3xl font-bold text-yellow-400">
              {subgroups.filter(s => s.gap <= -10).length}
            </div>
            <div className="text-xs text-white/40">of {subgroups.length}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gap Analysis */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="font-semibold text-white mb-4">Achievement Gap Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gapChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={10} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="gap" radius={[0, 4, 4, 0]}>
                  {gapChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.status === 'critical' ? '#EF4444' : entry.status === 'warning' ? '#F59E0B' : '#10B981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-white/60">Critical (&lt;-20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500" />
                <span className="text-white/60">Warning (-10 to -20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-white/60">On Track</span>
              </div>
            </div>
          </div>

          {/* Subgroup Table */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="font-semibold text-white mb-4">Subgroup Performance</h3>
            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-800">
                  <tr className="text-left text-white/50">
                    <th className="pb-2">Subgroup</th>
                    <th className="pb-2">Current</th>
                    <th className="pb-2">Target</th>
                    <th className="pb-2">Gap</th>
                    <th className="pb-2">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {subgroups.map((sg, i) => (
                    <tr 
                      key={i} 
                      className={`border-t border-slate-700/50 cursor-pointer ${selectedSubgroup?.name === sg.name ? 'bg-purple-500/20' : ''}`}
                      onClick={() => setSelectedSubgroup(sg)}
                    >
                      <td className="py-2 text-white">{sg.name}</td>
                      <td className="py-2 text-white">{sg.current}%</td>
                      <td className="py-2 text-white/70">{sg.target}%</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${getGapColor(sg.gap)} text-white`}>
                          {sg.gap > 0 ? '+' : ''}{sg.gap}%
                        </span>
                      </td>
                      <td className="py-2">{getTrendIcon(sg.trend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Projection Settings */}
        <div className="mt-6 bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="font-semibold text-white mb-4">Projection Settings</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">Projection Years</label>
              <input
                type="range"
                min="3"
                max="10"
                value={projectionYears}
                onChange={(e) => setProjectionYears(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-white text-sm">{projectionYears} years</div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Annual Intervention Effect (%)</label>
              <input
                type="range"
                min="1"
                max="15"
                value={interventionEffect}
                onChange={(e) => setInterventionEffect(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-white text-sm">{interventionEffect}% annual improvement</div>
            </div>
          </div>
        </div>

        {/* Selected Subgroup Projection */}
        {selectedSubgroup && (
          <div className="mt-6 bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="font-semibold text-white mb-4">
              {selectedSubgroup.name} - {projectionYears} Year Projection
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} name="Projected" />
                <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} strokeDasharray="5,5" dot={false} name="Target" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-purple-500" />
                <span className="text-white/60 text-sm">Projected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-green-500 border-dashed" style={{ borderTopWidth: 2, borderStyle: 'dashed' }} />
                <span className="text-white/60 text-sm">Target</span>
              </div>
            </div>
            
            {/* Time to target */}
            <div className="mt-4 p-4 bg-slate-900 rounded-lg">
              {(() => {
                const yearsToTarget = Math.log(selectedSubgroup.target / selectedSubgroup.current) / Math.log(1 + interventionEffect / 100)
                const willMeetTarget = yearsToTarget <= projectionYears
                return (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white/50">Years to Meet Target</div>
                      <div className="text-xl font-bold text-white">{isFinite(yearsToTarget) ? yearsToTarget.toFixed(1) : 'N/A'}</div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${willMeetTarget ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {willMeetTarget ? 'On Track' : 'Needs Acceleration'}
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {/* AI Analysis Results */}
        {analysisResult && (
          <div className="mt-6 bg-slate-800 rounded-xl p-4 border border-purple-500/30">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              AI Equity Analysis
            </h3>
            {analysisResult.gaps && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-white/50 mb-2">Critical Gaps</h4>
                  {analysisResult.gaps.slice(0, 5).map((gap: any, i: number) => (
                    <div key={i} className="bg-slate-900 rounded-lg p-3 mb-2">
                      <div className="flex justify-between">
                        <span className="text-white">{gap.metric}</span>
                        <span className="text-red-400">{gap.subgroupVsDistrict}</span>
                      </div>
                      <div className="text-xs text-white/50">{gap.trend} trend</div>
                    </div>
                  ))}
                </div>
                {analysisResult.interventions && (
                  <div>
                    <h4 className="text-sm text-white/50 mb-2">Recommended Interventions</h4>
                    {analysisResult.interventions.slice(0, 4).map((int: any, i: number) => (
                      <div key={i} className="bg-slate-900 rounded-lg p-3 mb-2">
                        <div className="text-white text-sm">{int.target}</div>
                        <div className="text-xs text-purple-400">{int.approach}</div>
                        <div className="text-xs text-green-400">{int.expectedImpact}% expected improvement</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {analysisResult.equityScore && (
              <div className="mt-4 p-4 bg-purple-500/10 rounded-lg">
                <div className="text-sm text-purple-300">AI Equity Score: {analysisResult.equityScore}/100</div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
