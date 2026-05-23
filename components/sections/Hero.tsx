import { ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'
import type { ProductData } from '../../lib/types'

interface HeroProps {
  product: ProductData
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Regulatory': <Shield className="w-5 h-5" />,
  'Lead Gen': <Zap className="w-5 h-5" />,
  'Financial': <TrendingUp className="w-5 h-5" />,
}

const categoryGradients: Record<string, string> = {
  'Regulatory': 'from-emerald-50 to-teal-50',
  'Lead Gen': 'from-blue-50 to-indigo-50',
  'Legal/Finance': 'from-violet-50 to-purple-50',
  'Healthcare': 'from-red-50 to-rose-50',
  'Financial': 'from-cyan-50 to-blue-50',
  'HR/Workforce': 'from-amber-50 to-orange-50',
  'Real Estate': 'from-teal-50 to-emerald-50',
  'Digital': 'from-indigo-50 to-blue-50',
}

export function Hero({ product }: HeroProps) {
  const gradient = categoryGradients[product.category] || 'from-gray-50 to-white'

  return (
    <section className={cn('relative pt-32 pb-20 sm:pb-28 overflow-hidden', `bg-gradient-to-b ${gradient}`)}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            {categoryIcons[product.category] || <Zap className="w-4 h-4" />}
            {product.category} Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text mb-6">
            {product.name}
            <span className="block mt-2 text-primary">{product.tagline}</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            {product.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button as="a" href={`/api/auth/signup?ref=${product.slug}`} size="lg">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button as="a" href="/pricing" variant="outline" size="lg">
              View Pricing
            </Button>
          </div>
          <p className="mt-4 text-sm text-text-muted">No credit card required &middot; Cancel anytime</p>
        </div>
      </div>
    </section>
  )
}
