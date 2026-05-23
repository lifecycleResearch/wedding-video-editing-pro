import { ArrowRight, Check, Star } from 'lucide-react'
import { Button } from '../ui/Button'
import { GuaranteeBadge } from '../ui/GuaranteeBadge'
import { ImageWithAlt } from '../ui/ImageWithAlt'
import { getImageUrl } from '../../lib/images'
import { cn } from '../../lib/utils'
import type { ProductData } from '../../lib/types'

interface HeroHormoziProps {
  product: ProductData
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

export function HeroHormozi({ product }: HeroHormoziProps) {
  const gradient = categoryGradients[product.category] || 'from-gray-50 to-white'

  return (
    <section className={cn('relative pt-28 pb-20 sm:pb-32 overflow-hidden', `bg-gradient-to-b ${gradient}`)}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm mb-6">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm text-text-muted">
                <span className="font-semibold text-text">4.9/5</span> from 2,000+ reviews
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text mb-4 leading-tight">
              {product.hook || `Never Miss Another ${product.category} Opportunity`}
            </h1>

            <p className="text-lg sm:text-xl text-text-muted mb-6 leading-relaxed">
              {product.tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button as="a" href={`/api/auth/signup?ref=${product.slug}`} size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button as="a" href="/pricing" variant="outline" size="lg">
                See Plans & Pricing
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <GuaranteeBadge days={product.guaranteeDays || 30} />
              <div className="flex items-center gap-2 text-text-muted">
                <Check className="w-4 h-4 text-green-500" />
                No credit card
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://images.unsplash.com/photo-${['1507003211169-0a1dd7228f2d', '1438761681033-6461ffad8d80', '1472099645785-5658abf4ff4e', '1500648767791-00dcc994a43e'][i-1]}?w=40&q=80`}
                    alt={`Happy ${product.name} customer`}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
              <p className="text-sm text-text-muted">
                <span className="font-semibold text-text">10,000+</span> professionals trust us
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <ImageWithAlt
              src={getImageUrl(product.category, 'hero')}
              alt={`${product.name} dashboard showing real-time ${product.category.toLowerCase()} intelligence data and analytics`}
              className="shadow-2xl rounded-2xl border border-border"
              width={600}
              height={450}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
