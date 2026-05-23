import { Activity, Bell, Shield, BarChart3, Workflow, Globe } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import { cn } from '../../lib/utils'
import type { ProductData } from '../../lib/types'

interface FeaturesProps {
  product: ProductData
}

const defaultFeatures = [
  {
    title: 'Real-time Monitoring',
    description: 'Continuous 24/7 monitoring of data sources with instant alerts when relevant changes are detected.',
    icon: Activity,
  },
  {
    title: 'Smart Alerts',
    description: 'Customizable alert rules with multi-channel delivery via email, Slack, webhook, or SMS.',
    icon: Bell,
  },
  {
    title: 'Enterprise Security',
    description: 'SOC 2 compliant infrastructure with end-to-end encryption and role-based access control.',
    icon: Shield,
  },
  {
    title: 'Advanced Analytics',
    description: 'Powerful dashboards and reports with drill-down capabilities and export options.',
    icon: BarChart3,
  },
  {
    title: 'API Integration',
    description: 'RESTful API with comprehensive documentation for seamless integration into your workflow.',
    icon: Workflow,
  },
  {
    title: 'Multi-source Coverage',
    description: 'Aggregate data from hundreds of federal, state, and private sources in one platform.',
    icon: Globe,
  },
]

export function Features({ product }: FeaturesProps) {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Everything you need to stay ahead"
          description={`${product.name} combines comprehensive data coverage with powerful tools to keep you informed.`}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {defaultFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="group p-6 rounded-2xl border border-border hover:border-primary/20 hover:shadow-sm transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-text mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
