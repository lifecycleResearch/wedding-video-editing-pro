import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { SectionHeader } from '../ui/SectionHeader'
import { cn } from '../../lib/utils'
import type { ProductData } from '../../lib/types'

const tierLabels = {
  starter: { label: 'Starter', desc: 'For individuals and small teams' },
  pro: { label: 'Professional', desc: 'For growing businesses' },
  enterprise: { label: 'Enterprise', desc: 'For large organizations' },
} as const

export function Pricing({ product }: { product: ProductData }) {
  const { pricing } = product
  const tiers = ['starter', 'pro', 'enterprise'] as const
  const [loadingTier, setLoadingTier] = useState<string | null>(null)

  async function handleCheckout(tier: string) {
    setLoadingTier(tier)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: tier }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.id) {
        const pk = process.env.NEXT_PUBLIC_STRIPE_KEY
        if (!pk) throw new Error('NEXT_PUBLIC_STRIPE_KEY not set')
        const stripe = await import('@stripe/stripe-js').then(m => m.loadStripe(pk))
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.id })
        }
      }
    } catch (err) {
      console.error('Checkout error:', err)
      window.location.href = `/pricing?checkout_error=true`
    } finally {
      setLoadingTier(null)
    }
  }

  return (
    <section id="pricing" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Simple, Transparent Pricing"
          description="Choose the plan that fits your needs. Upgrade or downgrade anytime."
        />
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const plan = pricing[tier]
            const isPopular = tier === 'pro'
            const isLoading = loadingTier === tier

            return (
              <div
                key={tier}
                className={cn(
                  'rounded-2xl p-8 flex flex-col',
                  isPopular
                    ? 'bg-primary text-white shadow-xl ring-2 ring-primary scale-105 relative'
                    : 'bg-white border border-border shadow-sm'
                )}
              >
                {isPopular && (
                  <Badge variant="warning" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    MOST POPULAR
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className={cn('text-xl font-bold mb-1', isPopular ? 'text-white' : 'text-text')}>
                    {tierLabels[tier].label}
                  </h3>
                  <p className={cn('text-sm', isPopular ? 'text-white/70' : 'text-text-muted')}>
                    {tierLabels[tier].desc}
                  </p>
                </div>
                <div className="mb-8">
                  <span className={cn('text-4xl font-bold', isPopular ? 'text-white' : 'text-text')}>
                    ${plan.price.toLocaleString()}
                  </span>
                  <span className={cn('text-lg ml-1', isPopular ? 'text-white/70' : 'text-text-muted')}>/mo</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features?.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <Check className={cn('w-5 h-5 mt-0.5 flex-shrink-0', isPopular ? 'text-white' : 'text-primary')} />
                      <span className={cn('text-sm', isPopular ? 'text-white/90' : 'text-text')}>{feat}</span>
                    </li>
                  ))}
                </ul>
                {tier === 'enterprise' ? (
                  <Button
                    as="a"
                    href="/contact"
                    variant={isPopular ? 'secondary' : 'outline'}
                    className="w-full"
                  >
                    Contact Sales
                  </Button>
                ) : (
                  <Button
                    variant={isPopular ? 'secondary' : 'outline'}
                    className="w-full"
                    onClick={() => handleCheckout(tier)}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isLoading ? 'Processing...' : 'Get Started'}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
        <p className="text-center text-sm text-text-muted mt-8">
          {product.guaranteeDays}-day money-back guarantee. No credit card required for trial.
        </p>
      </div>
    </section>
  )
}
