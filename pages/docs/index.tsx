import Head from 'next/head'
import { BookOpen, Search, Terminal, Settings, Users, Shield, Zap, HelpCircle } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { useProduct } from '../../lib/product-context'

const docSections = [
  {
    title: 'Getting Started',
    description: 'Learn the basics and get up and running in minutes.',
    icon: BookOpen,
    href: '/docs/getting-started',
    articles: ['Quick start guide', 'Creating your account', 'Dashboard overview', 'Your first alert'],
  },
  {
    title: 'Core Features',
    description: 'Deep dive into everything the platform can do.',
    icon: Zap,
    href: '/docs/features',
    articles: ['Real-time monitoring', 'Smart alerts', 'Data sources', 'Analytics & reports'],
  },
  {
    title: 'Integrations',
    description: 'Connect with the tools you already use.',
    icon: Terminal,
    href: '/docs/integrations',
    articles: ['Slack integration', 'Email setup', 'Webhook configuration', 'API reference'],
  },
  {
    title: 'Configuration',
    description: 'Customize the platform for your needs.',
    icon: Settings,
    href: '/docs/configuration',
    articles: ['Alert rules', 'Filters & keywords', 'User permissions', 'Notification preferences'],
  },
  {
    title: 'Team Management',
    description: 'Collaborate with your team effectively.',
    icon: Users,
    href: '/docs/team',
    articles: ['Adding team members', 'Roles & permissions', 'Shared workspaces', 'Activity logs'],
  },
  {
    title: 'Security & Compliance',
    description: 'Enterprise-grade security for your data.',
    icon: Shield,
    href: '/docs/security',
    articles: ['Data encryption', 'SOC 2 compliance', 'Access control', 'Audit trails'],
  },
  {
    title: 'Troubleshooting',
    description: 'Solutions to common issues and questions.',
    icon: HelpCircle,
    href: '/docs/troubleshooting',
    articles: ['Common issues', 'FAQ', 'Support options', 'Status page'],
  },
  {
    title: 'API Reference',
    description: 'Build custom integrations with our REST API.',
    icon: Search,
    href: '/docs/api',
    articles: ['Authentication', 'Endpoints', 'Rate limits', 'SDK & libraries'],
  },
]

export default function DocsPage() {
  const product = useProduct()
  return (
    <>
      <Head>
        <title>Documentation — {product.name}</title>
        <meta name="description" content={`Learn how to use ${product.name} with our comprehensive documentation. Guides, tutorials, API references, and more.`} />
      </Head>
      <Header productName={product.name} slug={product.slug} />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Documentation' }]} />
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Documentation</h1>
            <p className="text-text-muted text-lg">Everything you need to know about {product.name}.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {docSections.map((section) => {
              const Icon = section.icon
              return (
                <a
                  key={section.title}
                  href={section.href}
                  className="group p-6 rounded-2xl border border-border bg-white hover:shadow-md hover:border-primary/20 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text mb-1 group-hover:text-primary transition-colors">{section.title}</h3>
                  <p className="text-sm text-text-muted mb-3">{section.description}</p>
                  <ul className="space-y-1">
                    {section.articles.map((article) => (
                      <li key={article} className="text-xs text-primary hover:underline">{article}</li>
                    ))}
                  </ul>
                </a>
              )
            })}
          </div>
        </div>
      </main>
      <Footer product={product} />
    </>
  )
}
