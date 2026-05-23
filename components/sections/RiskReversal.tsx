import { ShieldCheck, HeadphonesIcon, RefreshCw } from 'lucide-react'
import { GuaranteeBadge } from '../ui/GuaranteeBadge'
import type { ProductData } from '../../lib/types'

interface RiskReversalProps {
  product: ProductData
}

export function RiskReversal({ product }: RiskReversalProps) {
  const guarantees = [
    {
      icon: ShieldCheck,
      title: `${product.guaranteeDays || 30}-Day Money-Back Guarantee`,
      description: product.riskReversal || `Try ${product.name} risk-free for ${product.guaranteeDays || 30} days. If you're not getting results, get a full refund. No questions asked.`,
    },
    {
      icon: HeadphonesIcon,
      title: 'White-Glove Onboarding',
      description: 'Get a dedicated setup specialist who configures everything for your specific needs. Most users are up and running in under 24 hours.',
    },
    {
      icon: RefreshCw,
      title: 'Cancel Anytime',
      description: 'No contracts, no hidden fees, no cancellation penalties. Upgrade, downgrade, or cancel with a single click.',
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <GuaranteeBadge days={product.guaranteeDays || 30} />
          </div>
          <h2 className="text-3xl font-bold text-text mb-4">Zero Risk. All Reward.</h2>
          <p className="text-text-muted max-w-xl mx-auto">
            We're so confident you'll love {product.name} that we back it with an ironclad guarantee.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {guarantees.map((g, i) => {
            const Icon = g.icon
            return (
              <div key={i} className="text-center p-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-text mb-2">{g.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{g.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
