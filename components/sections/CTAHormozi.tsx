import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '../ui/Button'
import { GuaranteeBadge } from '../ui/GuaranteeBadge'
import type { ProductData } from '../../lib/types'

interface CTAHormoziProps {
  product: ProductData
}

export function CTAHormozi({ product }: CTAHormoziProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="flex justify-center mb-6">
          <GuaranteeBadge days={product.guaranteeDays || 30} text={`${product.guaranteeDays || 30}-Day Risk-Free Trial`} />
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Stop Missing Opportunities.<br />
          <span className="text-white/90">Start {product.category} Intelligence Today.</span>
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
          Join 10,000+ professionals who transformed their workflow with {product.name}. 
          Start your free trial — no credit card. No risk. No commitment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            as="a"
            href={`/api/auth/signup?ref=${product.slug}`}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-xl"
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
            See Plans & Pricing
          </Button>
        </div>
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <ShieldCheck className="w-4 h-4" />
            No credit card required
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <ShieldCheck className="w-4 h-4" />
            Cancel anytime
          </div>
        </div>
      </div>
    </section>
  )
}
