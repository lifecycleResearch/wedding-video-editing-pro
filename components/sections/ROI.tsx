import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react'
import type { ProductData } from '../../lib/types'

export function ROI({ product }: { product: ProductData }) {
  if (!product.roi) return null

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-white to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-border shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2">Customer ROI</h2>
            <p className="text-text-muted mb-8">Average first-year return on investment</p>
            <p className="text-5xl sm:text-6xl font-bold text-primary mb-4">
              ${product.roi.toLocaleString()}
            </p>
            <p className="text-text-muted max-w-lg mx-auto">
              Our customers see an average of {product.roi > 1000000 ? '10x' : '5x'} return on their investment in the first year
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
