import Head from 'next/head'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { HeroHormozi } from '../components/sections/HeroHormozi'
import { ProblemAgitate } from '../components/sections/ProblemAgitate'
import { SocialProof } from '../components/sections/SocialProof'
import { HowItWorks } from '../components/sections/HowItWorks'
import { Features } from '../components/sections/Features'
import { Pricing } from '../components/sections/Pricing'
import { Comparison } from '../components/sections/Comparison'
import { ROI } from '../components/sections/ROI'
import { Bundle } from '../components/sections/Bundle'
import { RiskReversal } from '../components/sections/RiskReversal'
import { ObjectionHandlers } from '../components/sections/ObjectionHandlers'
import { CTAHormozi } from '../components/sections/CTAHormozi'
import { useProduct } from '../lib/product-context'
import { generateMetaTags } from '../lib/seo'

export default function Home() {
  const product = useProduct()
  const meta = generateMetaTags({
    title: product.name,
    description: product.description,
    slug: product.slug,
    productName: product.name,
    category: product.category,
    type: 'website',
  })

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={`${product.category}, ${product.name}, data intelligence, monitoring, alerts`} />
        <meta property="og:title" content={meta.openGraph.title} />
        <meta property="og:description" content={meta.openGraph.description} />
        <meta property="og:type" content={meta.openGraph.type} />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:image" content={meta.openGraph.image} />
        <meta name="twitter:card" content={meta.twitter.card} />
        <meta name="twitter:title" content={meta.twitter.title} />
        <meta name="twitter:description" content={meta.twitter.description} />
        <meta name="twitter:image" content={meta.twitter.image} />
        <link rel="canonical" href={meta.canonical} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(meta.schema) }}
        />
      </Head>
      <Header productName={product.name} slug={product.slug} />
      <main>
        <HeroHormozi product={product} />
        <SocialProof product={product} />
        <ProblemAgitate product={product} />
        <HowItWorks product={product} />
        <Features product={product} />
        <Comparison product={product} />
        <Pricing product={product} />
        <ROI product={product} />
        <Bundle product={product} />
        <RiskReversal product={product} />
        <ObjectionHandlers product={product} />
        <CTAHormozi product={product} />
      </main>
      <Footer product={product} />
    </>
  )
}
