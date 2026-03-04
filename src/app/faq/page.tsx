'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Mail, ArrowRight } from 'lucide-react'

const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How long does a typical simulation take to complete?',
        a: 'For an Individual Practitioner run, expect to spend 45-60 minutes to complete all three rounds with thoughtful inputs. For Team Pathways or Group modes involving discussion and consensus building, we recommend allocating 90-120 minutes.'
      },
      {
        q: 'Do I need to be an AI expert to use this tool?',
        a: 'Absolutely not. Convergence acts as a natural language partner; if you can type a description of a school budget or policy issue, the AI handles the complex modeling, IEDMA scoring, and scenario generation automatically.'
      },
      {
        q: 'What do I need to prepare before starting a session?',
        a: 'You simply need a browser and a strategic challenge in mind (e.g., "Declining enrollment" or "New Literacy Rollout"). While not required, having PDF data (budget reports, strategic plans) ready to upload in Round 1 can significantly increase simulation accuracy.'
      },
      {
        q: 'Can I save my progress and come back later?',
        a: 'Yes. Use the "Save" icon in the top header to store your current session to your browser\'s local storage. You can resume it anytime by clicking the "Folder/History" icon, provided you are on the same device.'
      }
    ]
  },
  {
    category: 'Data & Privacy',
    questions: [
      {
        q: 'Is our district\'s strategic data secure?',
        a: 'Yes. Convergence operates using a secure API connection where your data is processed for the simulation but not used to train the public AI models. We adhere to standard enterprise data privacy protocols.'
      },
      {
        q: 'Can other districts see my simulation results?',
        a: 'No. Your simulations are private to your specific session and device. Unless you explicitly use the "Email Report" or "Export Data" features to share them, they remain visible only to you.'
      },
      {
        q: 'Should I input student names or PII?',
        a: 'No. While the system is secure, the FBDM protocol is designed for systemic trends, not individual student management. Please anonymize any data (e.g., use "Student A" or aggregate percentages) before inputting.'
      }
    ]
  },
  {
    category: 'Features & Capabilities',
    questions: [
      {
        q: 'Can I build custom scenarios or am I locked into templates?',
        a: 'You have complete freedom. While we provide a placeholder scenario to get you started, the "Scenario Input" phase allows you to type or paste any unique challenge relevant to your specific context.'
      },
      {
        q: 'How does the equity audit work?',
        a: 'The AI uses the IEDMA framework to analyze your strategic pivot against four specific subgroups: ELL, SPED, Low-Income, and General Population. It identifies unintended consequences and rates the confidence level of those impacts.'
      },
      {
        q: 'Can I export the graphs and data tables?',
        a: 'Yes. You can use the "Email Report" feature to send a formatted text summary of all data tables. For visual graphs, we recommend using your browser\'s "Print to PDF" function on the "Team Comparison" or "Round View" screens.'
      },
      {
        q: 'How does the Team Pathway differ from Group mode?',
        a: 'Group mode allows a single team to play multiple roles on one screen. Team Pathway creates a split-lobby system where an "Internal Team" (Cabinet) and "Community Team" (Stakeholders) can play simultaneously on separate devices to reveal strategic divergence.'
      }
    ]
  },
  {
    category: 'Pricing & Plans',
    questions: [
      {
        q: 'What is the difference between Individual and District licenses?',
        a: 'Individual access is for personal professional development. District Enterprise licenses include the Team Pathway features, unlimited simulation runs, and optional custom onboarding for your entire leadership cabinet.'
      },
      {
        q: 'Do you offer a free trial or pilot program?',
        a: 'We offer limited pilots for school districts interested in adopting the FBDM protocol system-wide. Please contact our founders via the "Book Facilitator" button to schedule a demonstration.'
      }
    ]
  },
  {
    category: 'Support & Facilitation',
    questions: [
      {
        q: 'Do you provide training on the FBDM protocol?',
        a: 'Yes. While the app is intuitive, mastering the Future-Based Decision Making mindset is a skill. We offer virtual and on-site workshops to train your team on interpreting Futures Wheels and IEDMA scores.'
      },
      {
        q: 'Can you facilitate our annual cabinet retreat?',
        a: 'Yes. Our founders are available for on-site facilitation to guide your team through a high-stakes simulation using the platform. Use the "Book Facilitator" button to inquire.'
      }
    ]
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggle = (category: string, index: number) => {
    const key = `${category}-${index}`
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Convergence
              </span>
            </Link>
            <Link href="/signup" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">
            Everything you need to know about Convergence
          </p>
        </div>

        <div className="space-y-8">
          {faqData.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-xl font-semibold text-purple-600 mb-4">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((item, qIndex) => {
                  const isOpen = openItems[`${catIndex}-${qIndex}`]
                  return (
                    <div key={qIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggle(catIndex.toString(), qIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 pt-2 text-gray-600 bg-gray-50">
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Start Free Trial <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2026 Convergence Strategic Futuring. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
