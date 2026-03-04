'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Upload, FileText, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Brain, Loader2, Download, BarChart3, PieChart, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell } from 'recharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

interface DataPoint {
  year: string
  value: number
  subgroup?: string
}

interface Dataset {
  id: string
  name: string
  metric: string
  data: DataPoint[]
}

const sampleDatasets: Dataset[] = [
  {
    id: '1',
    name: 'Enrollment History',
    metric: 'Total Enrollment',
    data: [
      { year: '2020', value: 34500 },
      { year: '2021', value: 33800 },
      { year: '2022', value: 33100 },
      { year: '2023', value: 32600 },
      { year: '2024', value: 32100 },
      { year: '2025', value: 31600 }
    ]
  },
  {
    id: '2',
    name: 'Chronic Absenteeism',
    metric: 'Percentage',
    data: [
      { year: '2020', value: 8.2 },
      { year: '2021', value: 12.5 },
      { year: '2022', value: 15.1 },
      { year: '2023', value: 14.8 },
      { year: '2024', value: 15.5 },
      { year: '2025', value: 14.2 }
    ]
  },
  {
    id: '3',
    name: 'EL Progress',
    metric: 'ELPI Rate',
    data: [
      { year: '2020', value: 58.2 },
      { year: '2021', value: 55.1 },
      { year: '2022', value: 52.3 },
      { year: '2023', value: 54.1 },
      { year: '2024', value: 53.4 },
      { year: '2025', value: 55.8 }
    ]
  },
  {
    id: '4',
    name: 'Subgroup Performance',
    metric: 'ELA Proficiency',
    data: [
      { year: '2023', value: 52, subgroup: 'All Students' },
      { year: '2023', value: 38, subgroup: 'EL Students' },
      { year: '2023', value: 41, subgroup: 'SED Students' },
      { year: '2023', value: 35, subgroup: 'Foster Youth' },
      { year: '2023', value: 48, subgroup: 'Hispanic' },
      { year: '2023', value: 65, subgroup: 'Asian' },
      { year: '2023', value: 58, subgroup: 'White' }
    ]
  }
]

export default function DataPage() {
  const [user, setUser] = useState<any>(null)
  const [datasets, setDatasets] = useState<Dataset[]>(sampleDatasets)
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/login'
      } else {
        setUser(user)
        if (sampleDatasets.length > 0) {
          setSelectedDataset(sampleDatasets[0])
        }
      }
    })
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    // In production, parse CSV/Excel and upload to Supabase
    // For demo, simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    setUploading(false)
    alert('File uploaded! (Demo mode - parsing would happen here)')
  }

  const runTrendAnalysis = async () => {
    if (!selectedDataset) return
    setAnalyzing(true)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'trend_analysis',
          data: { historical: selectedDataset.data }
        })
      })
      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
    setAnalyzing(false)
  }

  const calculateTrend = (data: DataPoint[]) => {
    if (data.length < 2) return 0
    const values = data.map(d => d.value)
    const first = values[0]
    const last = values[values.length - 1]
    return ((last - first) / first) * 100
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-400" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-400" />
    return <Activity className="h-4 w-4 text-gray-400" />
  }

  const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899']

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <a href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
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
              <FileText className="h-8 w-8 text-purple-400" />
              Data & Trends
            </h1>
            <p className="text-white/60">Upload district data and analyze historical trends</p>
          </div>
          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.xlsx,.json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload Data
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Dataset List */}
          <div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h2 className="font-semibold text-white mb-4">Datasets</h2>
              <div className="space-y-2">
                {datasets.map((ds) => (
                  <button
                    key={ds.id}
                    onClick={() => setSelectedDataset(ds)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedDataset?.id === ds.id
                        ? 'bg-purple-500/20 border border-purple-500'
                        : 'bg-slate-900 hover:bg-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white text-sm">{ds.name}</div>
                        <div className="text-xs text-white/50">{ds.metric}</div>
                      </div>
                      {getTrendIcon(calculateTrend(ds.data))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h3 className="font-semibold text-white mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Data Points</span>
                  <span className="text-white font-medium">{selectedDataset?.data.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Trend</span>
                  <span className={`font-medium ${calculateTrend(selectedDataset?.data || []) > 0 ? 'text-green-400' : calculateTrend(selectedDataset?.data || []) < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {calculateTrend(selectedDataset?.data || []).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Latest</span>
                  <span className="text-white font-medium">
                    {selectedDataset?.data[selectedDataset.data.length - 1]?.value || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Chart */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">{selectedDataset?.name}</h2>
                <button
                  onClick={runTrendAnalysis}
                  disabled={analyzing || !selectedDataset}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  {analyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Brain className="h-3 w-3" />}
                  AI Analysis
                </button>
              </div>
              
              {selectedDataset?.data[0]?.subgroup ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={selectedDataset.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="subgroup" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={selectedDataset?.data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Data Table */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold text-white mb-4">Data Points</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 text-white/50">Year</th>
                      {selectedDataset?.data[0]?.subgroup && (
                        <th className="text-left py-2 text-white/50">Subgroup</th>
                      )}
                      <th className="text-right py-2 text-white/50">Value</th>
                      <th className="text-right py-2 text-white/50">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDataset?.data.map((d, i) => {
                      const prev = i > 0 ? selectedDataset.data[i - 1].value : d.value
                      const change = i > 0 ? ((d.value - prev) / prev) * 100 : 0
                      return (
                        <tr key={i} className="border-b border-slate-700/50">
                          <td className="py-2 text-white">{d.year}</td>
                          {d.subgroup && <td className="py-2 text-white/70">{d.subgroup}</td>}
                          <td className="py-2 text-white text-right font-medium">{d.value}</td>
                          <td className={`py-2 text-right ${change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-white/40'}`}>
                            {i > 0 ? `${change > 0 ? '+' : ''}${change.toFixed(1)}%` : '-'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Analysis Results */}
            {analysisResult && (
              <div className="bg-slate-800 rounded-xl p-6 border border-purple-500/30">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Trend Analysis
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="text-xs text-white/50 mb-1">Trend Summary</div>
                    <p className="text-white">{analysisResult.trendSummary || 'Analysis complete'}</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="text-xs text-white/50 mb-1">Growth Rate</div>
                    <p className="text-white">{analysisResult.growthRate || 'Calculated'}</p>
                  </div>
                  {analysisResult.equityGaps && (
                    <div className="bg-slate-900 rounded-lg p-4 md:col-span-2">
                      <div className="text-xs text-white/50 mb-1">Equity Gaps</div>
                      <p className="text-white">{analysisResult.equityGaps}</p>
                    </div>
                  )}
                  {analysisResult.recommendations && (
                    <div className="bg-slate-900 rounded-lg p-4 md:col-span-2">
                      <div className="text-xs text-white/50 mb-1">Recommendations</div>
                      <ul className="space-y-1">
                        {analysisResult.recommendations.map((r: string, i: number) => (
                          <li key={i} className="text-white text-sm flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-400" /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
