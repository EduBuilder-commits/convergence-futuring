'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  Sparkles, ChevronRight, Play, BarChart3, Users, Target, Layers, TrendingUp, Zap, Shield, Globe, BookOpen, ArrowRight, CheckCircle, Star, Brain, Scale, FileText, AlertTriangle, Clock, DollarSign, GraduationCap, Building2, Users2
} from 'lucide-react'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    { icon: Brain, title: 'FBDM Framework', desc: 'Guided 4-phase futuring process' },
    { icon: Layers, title: 'Scenario Matrices', desc: '5 scenario types with risk scoring' },
    { icon: BarChart3, title: 'Monte Carlo', desc: '10K+ iterations with AI analysis' },
    { icon: TrendingUp, title: 'Trend Analysis', desc: 'Historical data & equity focus' },
    { icon: Users, title: 'Stakeholder Mapping', desc: 'Power/Interest grids' },
    { icon: Scale, title: 'Equity Projections', desc: 'Gap analysis by subgroup' }
  ]

  const stats = [
    { value: '10K+', label: 'Simulations' },
    { value: '5', label: 'Scenario Types' },
    { value: '8', label: 'Templates' },
    { value: 'AI', label: 'Powered' }
  ]

  const benefits = [
    { icon: AlertTriangle, title: 'Detect hidden risks', desc: 'Identify operational risks before they reach the Board agenda' },
    { icon: Clock, title: 'Accelerate consensus', desc: 'Move from 9 months to 90 minutes with data-backed modeling' },
    { icon: DollarSign, title: 'Validate budget decisions', desc: 'Stress-test financial choices with probability forecasts' },
    { icon: Scale, title: 'Audit equity impacts', desc: 'Instant analysis of SPED, ELL, and subgroup impacts' },
    { icon: Layers, title: 'Test scenarios', desc: 'Validate strategy against 15+ plausible future scenarios' }
  ]

  const ecosystem = [
    { icon: Building2, title: 'Superintendents & Cabinet', items: ['Strategic Planning', 'Succession', 'Consolidation'] },
    { icon: Users2, title: 'Board Trustees', items: ['Policy Adoption', 'Budget Approval', 'Governance'] },
    { icon: GraduationCap, title: 'University Faculty', items: ['EdD Courses', 'Case Studies', 'Dissertation Data'] },
    { icon: FileText, title: 'Department Chairs', items: ['Resource Allocation', 'Vertical Alignment', 'Staffing'] },
    { icon: Zap, title: 'EdTech Leaders', items: ['AI Policy', 'Infrastructure', 'Data Privacy'] },
    { icon: Users, title: 'Principals & Site Leaders', items: ['Master Scheduling', 'Culture Building', 'Crisis Response'] }
  ]

  const methodology = [
    {
      title: 'IEDMA Analysis',
      subtitle: 'Strategic Robustness Score',
      desc: 'Measures the structural integrity of your decision against chaos. Synthesizes Futuring Rigor, Simulation Robustness, and Organizational Capacity. Calculates a "break point" for your strategy.',
      icon: Brain
    },
    {
      title: 'Futures Wheel',
      subtitle: 'Consequence Mapping',
      desc: 'Maps the invisible ripple effects of your decision across three orders of impact.',
      icon: Zap
    },
    {
      title: 'Cross-Impact Matrix',
      subtitle: 'Systems Interconnectivity',
      desc: 'Reveals how different system variables fight or fuel each other.',
      icon: Layers
    }
  ]

  const process = [
    { phase: '01', title: 'Context Injection', desc: 'Input your challenge or upload district data to initialize the world model', example: 'Budget shortfall due to 5% enrollment decline' },
    { phase: '02', title: 'Simulation Stress-Test', desc: 'AI generates multiple future scenarios to test strategy resilience', example: 'Union strike threat + new state mandate' },
    { phase: '03', title: 'Strategic Pivot', desc: 'Refine plan based on feedback to maximize robustness (IEDMA)', example: 'Shift from cuts to revenue-generating programs' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Convergence
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">How It Works</a>
              <a href="#ecosystem" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Ecosystem</a>
              <a href="/faq" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">FAQ</a>
              <Link href="/login" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Sign In</Link>
              <Link href="/signup" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-200/30 to-blue-200/30 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              AI-Powered Strategic Futuring
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Predict the Future.{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Secure the District.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Convergence isn't just a simulator—it's an operational radar system. 
              Help educational leaders stress-test high-stakes decisions against chaos before it happens.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                Begin Simulation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/demo" 
                className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5" /> View Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Protocol</h2>
            <p className="text-gray-600">How It Works</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {process.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-purple-200 transition-colors h-full">
                  <div className="text-4xl font-bold text-purple-600 mb-4">{step.phase}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.desc}</p>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xs text-purple-600 font-medium">Example:</div>
                    <div className="text-sm text-purple-700">{step.example}</div>
                  </div>
                </div>
                {i < 2 && (
                  <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-purple-300 h-6 w-6 z-10 bg-white" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section id="ecosystem" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Ecosystem</h2>
            <p className="text-gray-600">Who Uses Convergence?</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ecosystem.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.items.map((item2, j) => (
                    <span key={j} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{item2}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Science Behind the Simulation</h2>
            <p className="text-gray-600">Methodology</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {methodology.map((method, i) => (
              <div key={i} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                <method.icon className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">{method.title}</h3>
                <p className="text-purple-600 text-sm font-medium mb-3">{method.subtitle}</p>
                <p className="text-gray-600 text-sm">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need for Strategic Futuring</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Powerful tools backed by AI to help education leaders make data-driven decisions</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Secure Your District's Future?</h2>
          <p className="text-purple-100 mb-8 text-lg">Join education leaders using Convergence to make smarter, data-driven decisions.</p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Start Free Trial <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Convergence</span>
            </div>
            <div className="flex space-x-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © 2026 Convergence Strategic Futuring. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
