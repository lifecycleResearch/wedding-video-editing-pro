import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Bell, Shield, Globe, Moon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { Button } from '../../components/ui/Button'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { useProduct } from '../../lib/product-context'
import type { User } from '@supabase/supabase-js'

export default function SettingsPage() {
  const product = useProduct()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { router.replace('/auth'); return }
      setUser(data.user)
      setEmail(data.user.email || '')
      setLoading(false)
    })
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>

  return (
    <>
      <Head><title>Settings — {product.name}</title></Head>
      <Header productName={product.name} slug={product.slug} />
      <main className="pt-24 pb-16 bg-surface min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]} />
          <h1 className="text-2xl font-bold text-text mb-8">Settings</h1>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold text-text mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-text-muted bg-surface"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button size="sm">Save Changes</Button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold text-text mb-4">Notifications</h2>
              <div className="space-y-4">
                {[
                  { label: 'Email Alerts', desc: 'Receive alert notifications via email', icon: Bell },
                  { label: 'Weekly Digest', desc: 'Weekly summary of all activity', icon: Globe },
                  { label: 'Product Updates', desc: 'New features and improvements', icon: Moon },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-text-muted" />
                        <div>
                          <p className="text-sm text-text">{item.label}</p>
                          <p className="text-xs text-text-muted">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold text-text mb-4">Security</h2>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-text-muted" />
                <div className="flex-1">
                  <p className="text-sm text-text">Password</p>
                  <p className="text-xs text-text-muted">Change your account password</p>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer product={product} />
    </>
  )
}
