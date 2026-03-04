'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Brain, Loader2, FileText, TrendingUp, Users, Building2, GraduationCap, Activity, DollarSign, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

interface Template {
  id: string
  name: string
  category: 'enrollment' | 'financial' | 'staffing' | 'achievement' | 'facility'
  description: string
  question: string
  baseValue: number
  defaultVariables: { name: string; lowEstimate: number; highEstimate: number; distribution: string }[]
  icon: any
}

const templates: Template[] = [
  {
    id: 'enrollment-forecast',
    name: 'Enrollment Forecast',
    category: 'enrollment',
    description: 'Predict future student enrollment based on demographic trends',
    question: 'What will district enrollment be in 5 years?',
    baseValue: 32000,
    defaultVariables: [
      { name: 'Birth Rate Trend', lowEstimate: -8, highEstimate: 2, distribution: 'triangular' },
      { name: 'Housing Development', lowEstimate: -5, highEstimate: 15, distribution: 'triangular' },
      { name: 'Charter Competition', lowEstimate: -10, highEstimate: 5, distribution: 'triangular' },
      { name: 'Economic Factors', lowEstimate: -12, highEstimate: 8, distribution: 'normal' }
    ],
    icon: Users
  },
  {
    id: 'revenue-projection',
    name: 'Revenue Projection',
    category: 'financial',
    description: 'Forecast LCFF and grant revenue based on ADA and economic indicators',
    question: 'What will total revenue be in 3 years?',
    baseValue: 540000000,
    defaultVariables: [
      { name: 'ADA Change', lowEstimate: -5, highEstimate: 3, distribution: 'triangular' },
      { name: 'LCFF COLA', lowEstimate: 1, highEstimate: 5, distribution: 'normal' },
      { name: 'Grant Renewal Rate', lowEstimate: 60, highEstimate: 95, distribution: 'triangular' },
      { name: 'Local Revenue', lowEstimate: -10, highEstimate: 12, distribution: 'normal' }
    ],
    icon: DollarSign
  },
  {
    id: 'staffing-forecast',
    name: 'Staffing Needs',
    category: 'staffing',
    description: 'Project teacher and staff needs based on enrollment and program changes',
    question: 'How many teachers will we need in 4 years?',
    baseValue: 1500,
    defaultVariables: [
      { name: 'Enrollment Ratio Change', lowEstimate: -8, highEstimate: 5, distribution: 'triangular' },
      { name: 'Class Size Initiative', lowEstimate: -15, highEstimate: 0, distribution: 'triangular' },
      { name: 'Program Expansion', lowEstimate: 0, highEstimate: 10, distribution: 'triangular' },
      { name: 'Retirement Rate', lowEstimate: 3, highEstimate: 8, distribution: 'normal' }
    ],
    icon: GraduationCap
  },
  {
    id: 'achievement-projection',
    name: 'Achievement Goals',
    category: 'achievement',
    description: 'Project proficiency rates based on intervention effectiveness',
    question: 'What will ELA proficiency be in 3 years?',
    baseValue: 52,
    defaultVariables: [
      { name: 'Intervention Effect', lowEstimate: 2, highEstimate: 8, distribution: 'triangular' },
      { name: 'Teacher Quality', lowEstimate: -3, highEstimate: 5, distribution: 'normal' },
      { name: 'Attendance Impact', lowEstimate: 1, highEstimate: 4, distribution: 'triangular' },
      { name: 'Resource Availability', lowEstimate: -5, highEstimate: 10, distribution: 'triangular' }
    ],
    icon: TrendingUp
  },
  {
    id: 'facility-needs',
    name: 'Facility Capacity',
    category: 'facility',
    description: 'Forecast classroom and facility needs based on enrollment',
    question: 'How many additional classrooms needed in 5 years?',
    baseValue: 0,
    defaultVariables: [
      { name: 'Enrollment Growth', lowEstimate: -5, highEstimate: 20, distribution: 'triangular' },
      { name: 'Class Size Target', lowEstimate: -10, highEstimate: 0, distribution: 'triangular' },
      { name: 'Utilization Rate', lowEstimate: -5, highEstimate: 10, distribution: 'triangular' },
      { name: 'Modernization', lowEstimate: -8, highEstimate: 5, distribution: 'triangular' }
    ],
    icon: Building2
  },
  {
    id: 'chronic-absenteeism',
    name: 'Chronic Absenteeism',
    category: 'achievement',
    description: 'Project chronic absenteeism rates based on interventions',
    question: 'What will chronic absenteeism rate be in 2 years?',
    baseValue: 15.5,
    defaultVariables: [
      { name: 'Intervention Effect', lowEstimate: -8, highEstimate: -2, distribution: 'triangular' },
      { name: 'Family Engagement', lowEstimate: -5, highEstimate: 2, distribution: 'normal' },
      { name: 'Transportation', lowEstimate: -3, highEstimate: 1, distribution: 'triangular' },
      { name: 'Socioeconomic', lowEstimate: -4, highEstimate: 4, distribution: 'normal' }
    ],
    icon: Activity
  },
  {
    id: 'budget-scenario',
    name: 'Budget Scenario',
    category: 'financial',
    description: 'Model different budget scenarios based on funding changes',
    question: 'What will the general fund balance be?',
    baseValue: 25000000,
    defaultVariables: [
      { name: 'Revenue Change', lowEstimate: -15, highEstimate: 8, distribution: 'triangular' },
      { name: 'Cost Increases', lowEstimate: 2, highEstimate: 8, distribution: 'normal' },
      { name: 'One-time Funds', lowEstimate: -50, highEstimate: 20, distribution: 'triangular' },
      { name: 'Reserve Policy', lowEstimate: 5, highEstimate: 15, distribution: 'triangular' }
    ],
    icon: DollarSign
  },
  {
    id: 'teacher-retention',
    name: 'Teacher Retention',
    category: 'staffing',
    description: 'Predict teacher retention rates based on compensation and conditions',
    question: 'What will our retention rate be next year?',
    baseValue: 85,
    defaultVariables: [
      { name: 'Compensation', lowEstimate: -5, highEstimate: 8, distribution: 'triangular' },
      { name: 'Workload', lowEstimate: -8, highEstimate: 3, distribution: 'normal' },
      { name: 'Support Systems', lowEstimate: -3, highEstimate: 6, distribution: 'triangular' },
      { name: 'Market Conditions', lowEstimate: -10, highEstimate: 5, distribution: 'normal' }
    ],
    icon: Users
  }
]

const categoryInfo = {
  enrollment: { name: 'Enrollment', color: 'bg-blue-500' },
  financial: { name: 'Financial', color: 'bg-green-500' },
  staffing: { name: 'Staffing', color: 'bg-purple-500' },
  achievement: { name: 'Achievement', color: 'bg-orange-500' },
  facility: { name: 'Facility', color: 'bg-red-500' }
}

export default function TemplatesPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/login'
      } else {
        setUser(user)
      }
    })
  }, [])

  const filteredTemplates = selectedCategory 
    ? templates.filter(t => t.category === selectedCategory)
    : templates

  const loadTemplate = (template: Template) => {
    setLoading(true)
    // Store template in localStorage for simulation page to pick up
    localStorage.setItem('simulationTemplate', JSON.stringify({
      question: template.question,
      baseValue: template.baseValue,
      variables: template.defaultVariables.map(v => ({
        name: v.name,
        lowEstimate: v.lowEstimate,
        highEstimate: v.highEstimate,
        distribution: v.distribution
      }))
    }))
    window.location.href = '/simulation'
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <a href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Convergence</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="h-8 w-8 text-purple-400" />
            Forecasting Templates
          </h1>
          <p className="text-white/60">Pre-built models for common education forecasting scenarios</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !selectedCategory 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-800 text-white/70 hover:bg-slate-700'
            }`}
          >
            All Templates
          </button>
          {Object.entries(categoryInfo).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === key 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-slate-800 text-white/70 hover:bg-slate-700'
              }`}
            >
              {info.name}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const Icon = template.icon
            const catInfo = categoryInfo[template.category]
            
            return (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${catInfo.color}/20`}>
                    <Icon className={`h-5 w-5 ${catInfo.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${catInfo.color} text-white`}>
                    {catInfo.name}
                  </span>
                </div>
                
                <h3 className="font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {template.name}
                </h3>
                <p className="text-white/60 text-sm mb-3">{template.description}</p>
                
                <div className="text-xs text-white/40">
                  {template.defaultVariables.length} variables configured
                </div>
              </div>
            )
          })}
        </div>

        {/* Template Detail Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${categoryInfo[selectedTemplate.category].color}/20`}>
                    <selectedTemplate.icon className={`h-6 w-6 ${categoryInfo[selectedTemplate.category].color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedTemplate.name}</h2>
                    <p className="text-white/60 text-sm">{categoryInfo[selectedTemplate.category].name} Template</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-white/70 mb-4">{selectedTemplate.description}</p>

              <div className="bg-slate-900 rounded-lg p-4 mb-4">
                <div className="text-xs text-white/50 mb-1">Research Question</div>
                <div className="text-white">{selectedTemplate.question}</div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-white/50 mb-2">Configured Variables</div>
                <div className="space-y-2">
                  {selectedTemplate.defaultVariables.map((v, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/70">{v.name}</span>
                      <span className="text-white/50">{v.lowEstimate}% to {v.highEstimate}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => loadTemplate(selectedTemplate)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  Run Simulation <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-3 rounded-lg font-medium text-white/70 hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
