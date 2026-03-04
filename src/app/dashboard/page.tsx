'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { 
  Sparkles, Plus, Settings, LogOut, FolderOpen,
  Brain, Target, Layers, TrendingUp, Users, Zap,
  ChevronRight, BarChart3, FileText, Upload, Loader2
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

interface Project {
  id: string
  name: string
  description: string
  phase: string
  updated_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(10)
      
      if (data) setProjects(data)
      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/landing')
  }

  const fbdmPhases = [
    { id: 'identify', name: 'Identify', icon: Brain, color: 'bg-blue-500' },
    { id: 'analyze', name: 'Analyze', icon: Layers, color: 'bg-purple-500' },
    { id: 'predict', name: 'Predict', icon: TrendingUp, color: 'bg-green-500' },
    { id: 'act', name: 'Act', icon: Target, color: 'bg-pink-500' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Convergence</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/subscription" className="text-white/70 hover:text-white">
              Pricing
            </Link>
            <button onClick={handleSignOut} className="text-white/70 hover:text-white">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-white/60">{user?.email}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link href="/projects/new" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-xl flex items-center space-x-3">
            <Plus className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">New Project</div>
              <div className="text-sm text-purple-100">Start futuring</div>
            </div>
          </Link>
          
          <Link href="/simulation" className="bg-slate-800 hover:bg-slate-700 text-white p-6 rounded-xl flex items-center space-x-3 border border-slate-700">
            <BarChart3 className="h-6 w-6 text-green-400" />
            <div className="text-left">
              <div className="font-semibold">Monte Carlo</div>
              <div className="text-sm text-slate-400">Run simulation</div>
            </div>
          </Link>
          
          <Link href="/data" className="bg-slate-800 hover:bg-slate-700 text-white p-6 rounded-xl flex items-center space-x-3 border border-slate-700">
            <Upload className="h-6 w-6 text-blue-400" />
            <div className="text-left">
              <div className="font-semibold">Upload Data</div>
              <div className="text-sm text-slate-400">District data</div>
            </div>
          </Link>
          
          <Link href="/subscription" className="bg-slate-800 hover:bg-slate-700 text-white p-6 rounded-xl flex items-center space-x-3 border border-slate-700">
            <FileText className="h-6 w-6 text-yellow-400" />
            <div className="text-left">
              <div className="font-semibold">Reports</div>
              <div className="text-sm text-slate-400">Export analysis</div>
            </div>
          </Link>
        </div>

        {/* FBDM Process */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">FBDM Framework</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {fbdmPhases.map((phase) => (
              <Link 
                key={phase.id} 
                href={`/projects?phase=${phase.id}`}
                className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 border border-slate-700 flex items-center space-x-3"
              >
                <div className={`${phase.color} p-2 rounded-lg`}>
                  <phase.icon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-white">{phase.name}</span>
                <ChevronRight className="h-4 w-4 text-slate-500 ml-auto" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
            <Link href="/projects" className="text-purple-400 hover:text-purple-300 text-sm">
              View all
            </Link>
          </div>
          
          {projects.length === 0 ? (
            <div className="p-12 text-center">
              <FolderOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
              <p className="text-slate-400 mb-4">Start your first strategic futuring project</p>
              <Link href="/projects/new" className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">
                <Plus className="h-4 w-4" /> Create Project
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {projects.map((project) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.id}`}
                  className="p-4 flex items-center justify-between hover:bg-slate-700/50"
                >
                  <div>
                    <h3 className="font-medium text-white">{project.name}</h3>
                    <p className="text-sm text-slate-400">{project.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 capitalize">
                      {project.phase}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
