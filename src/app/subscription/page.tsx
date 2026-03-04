'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Crown, Zap, Building2 } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: Zap,
    limits: ['3 Scenarios', 'Basic Monte Carlo', '1 User', '1,000 iterations'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    icon: Crown,
    popular: true,
    limits: ['Unlimited Scenarios', 'Advanced Monte Carlo', '10 Users', '100,000 iterations', 'Data Upload', 'PDF Export'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    icon: Building2,
    limits: ['Everything in Pro', 'API Access', 'Unlimited Users', '1M+ iterations', 'Custom Integration', 'Priority Support'],
  },
]

export default function SubscriptionPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profile)
      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return
    
    setUpgrading(planId)
    
    // For demo, just update the profile
    // In production, this would redirect to Stripe checkout
    await supabase
      .from('profiles')
      .update({ subscription_tier: planId })
      .eq('id', user.id)

    setUpgrading(null)
    alert(`Upgraded to ${planId}! (Demo mode)`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <a href="/dashboard" className="text-white font-bold">← Back to Dashboard</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
          <p className="text-white/60">Unlock advanced futuring capabilities</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrent = profile?.subscription_tier === plan.id

            return (
              <div
                key={plan.id}
                className={`relative bg-slate-800 rounded-2xl p-6 border-2 ${
                  plan.popular ? 'border-purple-500' : 'border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${plan.popular ? 'bg-purple-500/20' : 'bg-slate-700'}`}>
                    <Icon className={`h-6 w-6 ${plan.popular ? 'text-purple-400' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-3xl font-bold">
                      ${plan.price}
                      <span className="text-sm font-normal text-white/40">/mo</span>
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.limits.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/70">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || upgrading === plan.id}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    isCurrent
                      ? 'bg-slate-700 text-slate-500 cursor-default'
                      : plan.popular
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {upgrading === plan.id ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
