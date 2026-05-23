import Head from 'next/head'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Pricing } from '../components/sections/Pricing'
import { Comparison } from '../components/sections/Comparison'
import { RiskReversal } from '../components/sections/RiskReversal'
import { FAQ } from '../components/ui/FAQ'
import { CTAHormozi } from '../components/sections/CTAHormozi'
import { useProduct } from '../lib/product-context'
import { generateMetaTags } from '../lib/seo'

export default function PricingPage() {
  const product = useProduct()
  const meta = generateMetaTags({
    title: 'Pricing',
    description: `View ${product.name} pricing plans. Start with a free trial, no credit card required.`,
    slug: product.slug,
    productName: product.name,
    breadcrumbs: [{ label: 'Pricing', href: '/pricing' }],
  })

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.openGraph.title} />
        <meta property="og:description" content={meta.openGraph.description} />
        <link rel="canonical" href={meta.canonical} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(meta.schema) }} />
      </Head>
      <Header productName={product.name} slug={product.slug} />
      <main className="pt-24">
        <Pricing product={product} />
        <Comparison product={product} />
        <RiskReversal product={product} />
        <FAQ
          items={product.faq?.length ? product.faq.slice(0, 4) : []}
          title="Pricing FAQ"
          description="Common questions about our plans and billing."
        />
        <CTAHormozi product={product} />
      </main>
      <Footer product={product} />
    </>
  )
}
