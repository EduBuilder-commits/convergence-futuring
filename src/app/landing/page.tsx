'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, ChevronRight, Play, BarChart3, Users, Target, Layers, TrendingUp, Zap, Shield, Globe, BookOpen, ArrowRight, CheckCircle, Star, Brain, Scale, FileText, AlertTriangle, Clock, DollarSign, GraduationCap, Building2, Users2, X, Menu
} from 'lucide-react'

const features = [
  { icon: Brain, title: 'FBDM Framework', desc: 'Guided 4-phase futuring process' },
  { icon: Layers, title: 'Scenario Matrices', desc: '5 scenario types with risk scoring' },
  { icon: BarChart3, title: 'Monte Carlo', desc: '10K+ iterations with AI analysis' },
  { icon: TrendingUp, title: 'Trend Analysis', desc: 'Historical data & equity focus' },
  { icon: Users, title: 'Stakeholder Mapping', desc: 'Power/Interest grids' },
  { icon: Scale, title: 'Equity Projections', desc: 'Gap analysis by subgroup' }
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
  { title: 'IEDMA Analysis', subtitle: 'Strategic Robustness Score', desc: 'Measures the structural integrity of your decision against chaos.' },
  { title: 'Futures Wheel', subtitle: 'Consequence Mapping', desc: 'Maps the invisible ripple effects of your decision across three orders of impact.' },
  { title: 'Cross-Impact Matrix', subtitle: 'Systems Interconnectivity', desc: 'Reveals how different system variables fight or fuel each other.' }
]

const process = [
  { phase: '01', title: 'Context Injection', desc: 'Input your challenge or upload district data to initialize the world model', example: 'Budget shortfall due to 5% enrollment decline' },
  { phase: '02', title: 'Simulation Stress-Test', desc: 'AI generates multiple future scenarios to test strategy resilience', example: 'Union strike threat + new state mandate' },
  { phase: '03', title: 'Strategic Pivot', desc: 'Refine plan based on feedback to maximize robustness (IEDMA)', example: 'Shift from cuts to revenue-generating programs' }
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3 z-50">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Convergence
              </span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-white/70 hover:text-white text-sm font-medium transition-colors">How It Works</a>
              <a href="#ecosystem" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Ecosystem</a>
              <a href="/faq" className="text-white/70 hover:text-white text-sm font-medium transition-colors">FAQ</a>
              <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
              <Link href="/signup" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-purple-500/25">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden z-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#features" className="block text-white/70 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="block text-white/70 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                <a href="#ecosystem" className="block text-white/70 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Ecosystem</a>
                <Link href="/faq" className="block text-white/70 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
                <Link href="/signup" className="block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-3 rounded-lg font-semibold text-center" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm mb-8"
            >
              <Star className="h-4 w-4 text-purple-400" />
              <span>AI-Powered Strategic Futuring</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Predict the Future.{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Secure the District.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Convergence isn't just a simulator—it's an operational radar system. 
              Help educational leaders stress-test high-stakes decisions against chaos before it happens.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all hover:scale-105"
              >
                Begin Simulation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/demo" 
                className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5" /> View Demo
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
            >
              {[
                { value: '10K+', label: 'Simulations' },
                { value: '5', label: 'Scenario Types' },
                { value: '8', label: 'Templates' },
                { value: 'AI', label: 'Powered' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-white/40 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white/5 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-white/50">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Protocol</h2>
            <p className="text-white/50">How It Works</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {process.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full">
                  <div className="text-5xl font-bold text-purple-500/30 mb-4">{step.phase}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/50 mb-4">{step.desc}</p>
                  <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                    <div className="text-xs text-purple-400 font-medium">Example:</div>
                    <div className="text-sm text-purple-300">{step.example}</div>
                  </div>
                </div>
                {i < 2 && (
                  <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-purple-500/30 h-8 w-8 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section id="ecosystem" className="py-24 bg-white/5 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Ecosystem</h2>
            <p className="text-white/50">Who Uses Convergence?</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ecosystem.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.items.map((item2, j) => (
                    <span key={j} className="px-2 py-1 bg-white/5 rounded text-xs text-white/50">{item2}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Science Behind the Simulation</h2>
            <p className="text-white/50">Methodology</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {methodology.map((method, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/20"
              >
                <Brain className="h-10 w-10 text-purple-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">{method.title}</h3>
                <p className="text-purple-400 text-sm font-medium mb-3">{method.subtitle}</p>
                <p className="text-white/50 text-sm">{method.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white/5 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-white/50">Powerful tools for data-driven decisions</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 z-10 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Secure Your District's Future?</h2>
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
      <footer className="bg-black py-12 border-t border-white/10 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Convergence</span>
            </div>
            <div className="flex space-x-8 text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
          <div className="mt-8 text-center text-white/20 text-sm">
            © 2026 Convergence Strategic Futuring. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
