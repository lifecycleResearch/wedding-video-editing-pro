import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Github, Mail, ArrowRight, ShieldCheck, Apple } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { GuaranteeBadge } from '../../components/ui/GuaranteeBadge'
import { useProduct } from '../../lib/product-context'
import type { User } from '@supabase/supabase-js'

type AuthMode = 'signin' | 'signup'

export default function AuthPage() {
  const product = useProduct()
  const router = useRouter()
  const { mode: urlMode, ref } = router.query
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (urlMode === 'signup') setMode('signup')
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user)
        router.replace('/dashboard')
      }
    })
  }, [urlMode, router])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const redirectTo = `${window.location.origin}/api/auth/callback`

    const { error } = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } })

    if (error) {
      setMessage(error.message)
    } else if (mode === 'signup') {
      setMessage('Check your email for the confirmation link!')
    } else {
      window.location.href = '/dashboard'
    }

    setLoading(false)
  }

  const handleOAuth = async (provider: 'github' | 'google' | 'apple' | 'microsoft' | 'discord' | 'twitter') => {
    setLoading(true)
    const redirectTo = `${window.location.origin}/api/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    })
    if (error) setMessage(error.message)
    setLoading(false)
  }

  if (user) return null

  return (
    <>
      <Head>
        <title>{mode === 'signin' ? 'Sign In' : 'Sign Up'} — {product.name}</title>
      </Head>
      <div className="min-h-screen bg-surface flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <a href="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{product.name[0]}</span>
                </div>
                <span className="font-bold text-xl text-text">{product.name}</span>
              </a>
              <h1 className="text-3xl font-bold text-text">
                {mode === 'signin' ? 'Welcome back' : 'Start your free trial'}
              </h1>
              <p className="text-text-muted mt-2">
                {mode === 'signin' ? 'Sign in to your account' : 'No credit card required. Cancel anytime.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleOAuth('github')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface disabled:opacity-50 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  Continue with GitHub
                </button>
                <button
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface disabled:opacity-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
                <button
                  onClick={() => handleOAuth('apple')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface disabled:opacity-50 transition-colors"
                >
                  <Apple className="w-5 h-5" />
                  Continue with Apple
                </button>
                <button
                  onClick={() => handleOAuth('microsoft')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface disabled:opacity-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 23 23">
                    <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                    <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
                    <rect x="1" y="12" width="10" height="10" fill="#00A4EF"/>
                    <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
                  </svg>
                  Continue with Microsoft
                </button>
                <button
                  onClick={() => handleOAuth('discord')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface disabled:opacity-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0741.0741 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                  </svg>
                  Continue with Discord
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-4 text-text-muted">or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                  />
                </div>

                {message && (
                  <p className={`text-sm ${message.toLowerCase().includes('error') || message.toLowerCase().includes('invalid') ? 'text-red-500' : 'text-green-600'} bg-${message.includes('error') ? 'red' : 'green'}-50 p-3 rounded-lg`}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white rounded-lg py-2.5 font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <p className="text-center text-sm text-text-muted mt-6">
                {mode === 'signin' ? (
                  <>Don&apos;t have an account?{' '}
                    <button type="button" onClick={() => { setMode('signup'); setMessage('') }} className="text-primary hover:underline font-medium">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>Already have an account?{' '}
                    <button type="button" onClick={() => { setMode('signin'); setMessage('') }} className="text-primary hover:underline font-medium">
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>

            <div className="flex justify-center gap-6 mt-6 text-xs text-text-muted">
              <a href="/privacy" className="hover:text-text">Privacy Policy</a>
              <a href="/terms" className="hover:text-text">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
