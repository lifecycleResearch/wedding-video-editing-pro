import { TestimonialCard } from '../ui/TestimonialCard'
import { SectionHeader } from '../ui/SectionHeader'
import type { ProductData } from '../../lib/types'

interface SocialProofProps {
  product: ProductData
}

const defaultTestimonials = [
  {
    quote: `We cut our response time by 80% and haven't missed a single opportunity since implementing ${'{product.name}'}. It's become our secret weapon.`,
    author: 'Sarah Chen',
    role: 'VP of Operations',
    company: 'TechCorp Industries',
  },
  {
    quote: `The ROI was immediate. In our first month, we identified three opportunities that more than paid for the entire year.`,
    author: 'Marcus Rodriguez',
    role: 'Director of Strategy',
    company: 'Innovation Labs',
  },
  {
    quote: `What used to take our team of five a full day now happens in minutes. ${'{product.name}'} didn't just save us time — it transformed how we work.`,
    author: 'Emily Park',
    role: 'Head of Compliance',
    company: 'Global Finance Group',
  },
]

export function SocialProof({ product }: SocialProofProps) {
  const testimonials = product.testimonials?.length
    ? product.testimonials
    : defaultTestimonials

  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Data Points Tracked', value: '500M+' },
    { label: 'Avg. Time Saved', value: '15hrs/wk' },
    { label: 'Customer ROI', value: `${product.roi}x` },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Trusted by industry leaders"
          description={`Join thousands of professionals who rely on ${product.name} daily.`}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
