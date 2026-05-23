import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { Testimonial } from '../../lib/types'

interface TestimonialCardProps {
  testimonial: Testimonial
  variant?: 'default' | 'compact'
  className?: string
}

export function TestimonialCard({ testimonial, variant = 'default', className }: TestimonialCardProps) {
  return (
    <div className={cn(
      'rounded-2xl border border-border bg-white p-6 shadow-sm',
      variant === 'default' && 'p-8',
      className
    )}>
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <blockquote className={cn(
        'text-text-muted italic mb-4',
        variant === 'default' ? 'text-base' : 'text-sm'
      )}>
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3">
        {testimonial.image && (
          <img
            src={testimonial.image}
            alt={`${testimonial.author} - ${testimonial.role} at ${testimonial.company}`}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
        )}
        <div>
          <p className="font-semibold text-text text-sm">{testimonial.author}</p>
          <p className="text-xs text-text-muted">{testimonial.role}, {testimonial.company}</p>
        </div>
      </div>
    </div>
  )
}
