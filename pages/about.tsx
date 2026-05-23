import Head from 'next/head'
import { Target, Eye, Heart, Users } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { useProduct } from '../lib/product-context'

const values = [
  { icon: Target, title: 'Mission-Driven', description: 'We exist to make critical intelligence accessible to every organization, not just those with massive budgets.' },
  { icon: Eye, title: 'Radical Transparency', description: 'We believe in being open about our process, pricing, and performance. No hidden fees, no fine print.' },
  { icon: Heart, title: 'Customer Obsession', description: 'Every feature we build, every decision we make starts with one question: does this help our customers win?' },
  { icon: Users, title: 'Team First', description: 'Our people are our greatest asset. We invest in their growth, wellbeing, and success.' },
]

export default function AboutPage() {
  const product = useProduct()
  const milestones = [
    { year: '2023', event: `${product.name} was founded with a vision to transform ${product.category.toLowerCase()} intelligence.` },
    { year: '2024', event: 'Launched our AI-powered monitoring platform and onboarded first 1,000 customers.' },
    { year: '2025', event: 'Reached 10,000 active users and expanded to cover 500+ data sources.' },
    { year: '2026', event: 'Processing 500M+ data points monthly with 99.9% uptime guarantee.' },
  ]

  return (
    <>
      <Head>
        <title>About — {product.name}</title>
        <meta name="description" content={`Learn about ${product.name} — our mission, values, and the team behind the platform.`} />
      </Head>
      <Header productName={product.name} slug={product.slug} />
      <main>
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: 'About' }]} />
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">About {product.name}</h1>
            <p className="text-lg text-text-muted mb-8">
              We&apos;re on a mission to make {product.category.toLowerCase()} intelligence accessible, actionable, and affordable for every organization.
            </p>

            <div className="bg-surface rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-text mb-4">Our Story</h2>
              <p className="text-text-muted leading-relaxed mb-4">
                {product.name} was born from a simple observation: organizations were spending thousands of hours and dollars manually monitoring {product.category.toLowerCase()} data, yet still missing critical opportunities. The tools available were either too expensive for most businesses or too complex to use effectively.
              </p>
              <p className="text-text-muted leading-relaxed">
                We built {product.name} to change that. Our platform combines AI-powered monitoring with an intuitive interface that anyone can use. Today, thousands of organizations trust us to keep them informed, competitive, and ahead of the curve.
              </p>
            </div>

            <SectionHeader title="Our Values" description="The principles that guide everything we do." />

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {values.map((v) => {
                const Icon = v.icon
                return (
                  <div key={v.title} className="p-6 rounded-2xl border border-border bg-white">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-text mb-1">{v.title}</h3>
                    <p className="text-sm text-text-muted">{v.description}</p>
                  </div>
                )
              })}
            </div>

            <SectionHeader title="Our Journey" description="Key milestones in our growth." />

            <div className="space-y-6">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                      {m.year}
                    </div>
                    <div className="w-px flex-1 bg-border mt-2" />
                  </div>
                  <div className="pb-6">
                    <p className="text-text">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="py-24 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Workflow?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">Join thousands of organizations already using {product.name} to stay ahead.</p>
            <a
              href={`/auth?mode=signup`}
              className="inline-flex items-center justify-center rounded-lg bg-white text-primary px-8 py-3 text-lg font-medium hover:bg-white/90 transition-colors shadow-xl"
            >
              Start Free Trial
            </a>
          </div>
        </section>
      </main>
      <Footer product={product} />
    </>
  )
}
