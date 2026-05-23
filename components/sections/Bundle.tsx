import { Package, ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import type { ProductData } from '../../lib/types'

export function Bundle({ product }: { product: ProductData }) {
  if (!product.bundle) return null

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
            <Package className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-4">Best Value</h2>
          <p className="text-text-muted mb-8">The complete intelligence suite at a fraction of the cost</p>
          <div className="bg-white rounded-2xl p-8 sm:p-12 border-2 border-accent/30 shadow-lg">
            <p className="text-accent font-semibold text-lg mb-2">{product.bundle.name}</p>
            <p className="text-4xl sm:text-5xl font-bold text-text mb-2">
              ${product.bundle.price.toLocaleString()}
              <span className="text-lg text-text-muted font-normal">/mo</span>
            </p>
            <p className="text-text-muted text-sm mb-8">
              Save ${(product.pricing.starter.price + product.pricing.pro.price - product.bundle.price).toLocaleString()}/mo
            </p>
            <Button as="a" href={`/api/auth/signup?plan=bundle&ref=${product.slug}`} variant="primary" size="lg">
              Get the Bundle
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
