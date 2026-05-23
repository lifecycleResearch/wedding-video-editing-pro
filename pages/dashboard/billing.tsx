import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { CreditCard, Download, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { Button } from '../../components/ui/Button'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { useProduct } from '../../lib/product-context'
import type { User } from '@supabase/supabase-js'

export default function BillingPage() {
  const product = useProduct()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { router.replace('/auth'); return }
      setUser(data.user)
      setLoading(false)
    })
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>

  const invoices = [
    { date: 'May 1, 2026', amount: '$0.00', plan: 'Free', status: 'current' },
    { date: 'Apr 1, 2026', amount: '$0.00', plan: 'Free', status: 'paid' },
    { date: 'Mar 1, 2026', amount: '$0.00', plan: 'Free', status: 'paid' },
  ]

  return (
    <>
      <Head><title>Billing — {product.name}</title></Head>
      <Header productName={product.name} slug={product.slug} />
      <main className="pt-24 pb-16 bg-surface min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Billing' }]} />
          <h1 className="text-2xl font-bold text-text mb-8">Billing & Subscription</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold text-text mb-4">Current Plan</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-text">Free Plan</p>
                  <p className="text-sm text-text-muted">$0/month — 1,000 queries</p>
                </div>
              </div>
              <Button as="a" href="/pricing" className="w-full">Upgrade Plan</Button>
            </div>
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold text-text mb-4">Payment Method</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-text-muted" />
                </div>
                <div>
                  <p className="text-sm text-text">No payment method on file</p>
                  <p className="text-xs text-text-muted">Free plan doesn't require a card</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">Add Payment Method</Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text mb-4">Invoice History</h2>
            <div className="space-y-3">
              {invoices.map((inv, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    {inv.status === 'current' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-text-muted" />
                    )}
                    <div>
                      <p className="text-sm text-text font-medium">{inv.plan} Plan — {inv.date}</p>
                      <p className="text-xs text-text-muted">{inv.amount}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                    <Download className="w-4 h-4" /> PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer product={product} />
    </>
  )
}
