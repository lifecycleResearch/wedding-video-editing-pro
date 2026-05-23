import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import type { ProductData } from '../../lib/types'

export function CTA({ product }: { product: ProductData }) {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-white/80 mb-10">
            Join thousands of professionals who trust {product.name} for their intelligence needs.
            Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as="a"
              href={`/api/auth/signup?ref=${product.slug}`}
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              as="a"
              href="/pricing"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              View Pricing
            </Button>
          </div>
          <p className="mt-4 text-sm text-white/60">No credit card required &middot; Cancel anytime</p>
        </div>
      </div>
    </section>
  )
}
