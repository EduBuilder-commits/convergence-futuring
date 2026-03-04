'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { 
  Sparkles, Users, TrendingUp, Shield, ChevronRight,
  Brain, Target, Globe, BarChart3, Layers, Zap,
  ArrowRight, CheckCircle, Star
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

export default function LandingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
      }
    })
  }, [])

  const features = [
    {
      icon: Brain,
      title: 'FBDM Framework',
      description: 'Guided 4-phase futuring: Identify, Analyze, Predict, Act'
    },
    {
      icon: Layers,
      title: 'Scenario Matrices',
      description: 'Baseline, Transformation, Collapse, Constraint, Wildcard scenarios'
    },
    {
      icon: Target,
      title: 'Monte Carlo Simulations',
      description: 'Run 10,000+ iterations for accurate probability forecasts'
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Historical data visualization with equity-focused projections'
    },
    {
      icon: Users,
      title: 'Stakeholder Analysis',
      description: 'Power/Interest grids and impact assessments'
    },
    {
      icon: Zap,
      title: 'Cross-Impact Matrices',
      description: 'Map forces and analyze mutual dependencies'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Convergence</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link href="/dashboard" className="text-white/80 hover:text-white">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-white/80 hover:text-white">
                    Sign In
                  </Link>
                  <Link 
                    href="/signup" 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm mb-6">
                <Star className="h-4 w-4" />
                Strategic Futuring for Education Leaders
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                See the Future.{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Shape It.
                </span>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
                AI-powered strategic futuring platform with Monte Carlo simulations. 
                Make data-driven decisions for your district with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
                >
                  Start Free Trial <ArrowRight className="h-5 w-5" />
                </Link>
                <Link 
                  href="/demo" 
                  className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10"
                >
                  Watch Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Everything You Need for Strategic Futuring
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-colors">
                  <feature.icon className="h-10 w-10 text-purple-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              The FBDM Process
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { phase: 'Phase 1', title: 'Identify', desc: 'Scan environment, identify trends, gather data' },
                { phase: 'Phase 2', title: 'Analyze', desc: 'Cross-impact analysis, stakeholder mapping' },
                { phase: 'Phase 3', title: 'Predict', desc: 'Monte Carlo simulations, scenario development' },
                { phase: 'Phase 4', title: 'Act', desc: 'Strategy selection, action planning, monitoring' }
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="bg-slate-800 rounded-xl p-6 border border-white/10 h-full">
                    <div className="text-purple-400 text-sm font-medium mb-2">{step.phase}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-white/60 text-sm">{step.desc}</p>
                  </div>
                  {i < 3 && (
                    <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-purple-400 h-6 w-6" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-20 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Simple Pricing
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white">Free</h3>
                <p className="text-3xl font-bold text-white mt-2">$0</p>
                <ul className="mt-4 space-y-2 text-white/60">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> 3 Scenarios</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Basic Monte Carlo</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> 1 User</li>
                </ul>
              </div>
              <div className="bg-gradient-to-b from-purple-500/20 to-slate-800 rounded-xl p-6 border-2 border-purple-500">
                <h3 className="text-xl font-bold text-white">Pro</h3>
                <p className="text-3xl font-bold text-white mt-2">$49<span className="text-lg font-normal">/mo</span></p>
                <ul className="mt-4 space-y-2 text-white/60">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Unlimited Scenarios</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Advanced Monte Carlo</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Data Upload</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> 10 Team Members</li>
                </ul>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
                <p className="text-3xl font-bold text-white mt-2">$199<span className="text-lg font-normal">/mo</span></p>
                <ul className="mt-4 space-y-2 text-white/60">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> API Access</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Custom Integration</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Unlimited Team</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white/40">
          <p>&copy; 2026 Convergence Strategic Futuring. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
