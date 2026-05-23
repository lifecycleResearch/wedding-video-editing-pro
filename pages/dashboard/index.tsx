import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Activity, Bell, BarChart3, TrendingUp, Clock, Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { cn } from '../../lib/utils'
import { useProduct } from '../../lib/product-context'
import type { User } from '@supabase/supabase-js'

export default function Dashboard() {
  const product = useProduct()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.replace('/auth')
        return
      }
      setUser(data.user)
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const stats = [
    { label: 'Queries Used', value: '847 / 1,000', icon: Activity, trend: '+12%', positive: true },
    { label: 'Alerts Triggered', value: '23', icon: Bell, trend: '+5%', positive: true },
    { label: 'Avg Response Time', value: '2.4 min', icon: Clock, trend: '-18%', positive: true },
    { label: 'Opportunities Found', value: '156', icon: Zap, trend: '+34%', positive: true },
  ]

  return (
    <>
      <Head>
        <title>Dashboard — {product.name}</title>
      </Head>
      <Header productName={product.name} slug={product.slug} />
      <main className="pt-24 pb-16 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text">Dashboard</h1>
              <p className="text-text-muted">Welcome back, {user?.email?.split('@')[0]}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">Free Plan</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="bg-white rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className={cn('text-xs font-medium', stat.positive ? 'text-green-600' : 'text-red-500')}>
                      {stat.trend}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-text mb-1">{stat.value}</div>
                  <div className="text-xs text-text-muted">{stat.label}</div>
                </div>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold text-text mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm text-text">New {product.category} opportunity detected</p>
                      <p className="text-xs text-text-muted">{i} hour{i > 1 ? 's' : ''} ago</p>
                    </div>
                    <span className="text-xs text-primary font-medium">View</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold text-text mb-4">Usage Overview</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-muted">Monthly Queries</span>
                    <span className="text-text font-medium">847 / 1,000</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: '84.7%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-muted">Alert Quota</span>
                    <span className="text-text font-medium">156 / 500</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface overflow-hidden">
                    <div className="h-full rounded-full bg-secondary" style={{ width: '31.2%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer product={product} />
    </>
  )
}
