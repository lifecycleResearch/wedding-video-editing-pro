import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { useProduct } from '../lib/product-context'

export default function SuccessPage() {
  const product = useProduct()
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string>('')

  useEffect(() => {
    if (router.query.session_id) {
      setSessionId(router.query.session_id as string)
    }
  }, [router.query.session_id])

  return (
    <>
      <Header productName={product.name} slug={product.slug} />
      <main className="min-h-screen flex items-center justify-center bg-surface pt-24">
        <div className="max-w-lg mx-auto text-center px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-text mb-4">You're In!</h1>
          <p className="text-lg text-text-muted mb-2">
            Welcome to {product.name}. Your subscription is now active.
          </p>
          <p className="text-sm text-text-muted mb-8">
            Check your email for your login details and onboarding instructions.
          </p>
          {sessionId && (
            <p className="text-xs text-text-muted mb-6 opacity-60">
              Session: {sessionId.slice(0, 20)}...
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center justify-center rounded-lg border-2 border-border text-text px-6 py-3 font-medium hover:bg-surface transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
      <Footer product={product} />
    </>
  )
}