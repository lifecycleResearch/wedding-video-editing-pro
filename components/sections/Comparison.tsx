import { Check, X } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import { cn } from '../../lib/utils'
import type { ProductData } from '../../lib/types'

export function Comparison({ product }: { product: ProductData }) {
  const competitorName = product.competitor?.name || 'Manual Methods'

  const comparisons = [
    { us: 'Real-time monitoring 24/7', them: 'Manual checks during business hours' },
    { us: `${product.roi}x average ROI`, them: 'Reactive, not proactive' },
    { us: 'Automated alerts via email, Slack, SMS', them: 'Missed opportunities and delays' },
    { us: 'Hundreds of integrated data sources', them: 'Limited to what you can find' },
    { us: 'AI-powered insights and predictions', them: 'Manual analysis and guesswork' },
    { us: 'White-glove onboarding & support', them: 'No dedicated support' },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={`${product.name} vs. ${competitorName}`}
          description="See how we stack up against the alternatives."
        />
        <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left px-6 py-4 text-text font-semibold">Feature</th>
                <th className="text-center px-6 py-4">
                  <span className="inline-flex items-center gap-2 text-primary font-bold">
                    <Check className="w-4 h-4" /> {product.name}
                  </span>
                </th>
                <th className="text-center px-6 py-4">
                  <span className="inline-flex items-center gap-2 text-text-muted font-medium">
                    <X className="w-4 h-4" /> {competitorName}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr key={i} className={cn('border-b border-border last:border-0', i % 2 === 0 && 'bg-white')}>
                  <td className="px-6 py-4 text-text">{row.us.split(' ')[0] === product.roi.toString() || row.us.startsWith('Real-time') ? row.us : row.us}</td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X className="w-5 h-5 text-red-400 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {product.competitor && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-6 py-3">
              <span className="text-text-muted text-sm">{competitorName} costs</span>
              <span className="text-2xl font-bold text-red-500">${product.competitor.price.toLocaleString()}/mo</span>
              <span className="text-text-muted text-sm">vs</span>
              <span className="text-2xl font-bold text-primary">${product.pricing.starter.price}/mo</span>
              <span className="text-text-muted text-sm">for {product.name}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
