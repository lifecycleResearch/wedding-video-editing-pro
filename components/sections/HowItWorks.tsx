import { Search, Settings, Zap } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import type { ProductData } from '../../lib/types'

interface HowItWorksProps {
  product: ProductData
}

const defaultSteps = [
  {
    step: 1,
    title: 'Connect Your Sources',
    description: 'Link your data sources in minutes. We support hundreds of federal, state, and private databases out of the box.',
    icon: 'Search',
  },
  {
    step: 2,
    title: 'Set Your Criteria',
    description: 'Define what matters to you. Custom keywords, filters, and alert rules tailored to your specific needs.',
    icon: 'Settings',
  },
  {
    step: 3,
    title: 'Get Real-time Alerts',
    description: 'Receive instant notifications when relevant changes happen. Stop searching — start acting.',
    icon: 'Zap',
  },
]

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-6 h-6" />,
  Settings: <Settings className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
}

export function HowItWorks({ product }: HowItWorksProps) {
  const steps = product.howItWorks || defaultSteps

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="How It Works"
          description="Get started in minutes. No complex setup, no training required."
        />
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <div className="text-primary">{iconMap[step.icon] || <Zap className="w-6 h-6" />}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">{step.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
