import Head from 'next/head'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { useProduct } from '../../lib/product-context'
import { generateMetaTags } from '../../lib/seo'

export default function BlogPage() {
  const product = useProduct()
  const meta = generateMetaTags({
    title: 'Blog',
    description: `Latest insights, tips, and updates from the ${product.name} team. Learn about ${product.category} intelligence and monitoring best practices.`,
    slug: product.slug,
    productName: product.name,
  })

  const posts = [
    {
      title: `How AI is Transforming ${product.category} Intelligence`,
      excerpt: `Discover how artificial intelligence is revolutionizing the way organizations monitor and act on ${product.category.toLowerCase()} data.`,
      date: 'May 15, 2026',
      readTime: '5 min read',
      slug: 'ai-transforming-industry',
      category: product.category,
    },
    {
      title: `10x Your Team's Productivity with Automated Monitoring`,
      excerpt: `Stop wasting hours on manual checks. Learn how automated ${product.category.toLowerCase()} monitoring can free up your team's time.`,
      date: 'May 8, 2026',
      readTime: '4 min read',
      slug: 'automated-monitoring-productivity',
      category: 'Productivity',
    },
    {
      title: `${product.category} Intelligence: A Complete Guide for 2026`,
      excerpt: `Everything you need to know about ${product.category.toLowerCase()} intelligence in 2026. From basics to advanced strategies.`,
      date: 'May 1, 2026',
      readTime: '8 min read',
      slug: 'complete-guide-2026',
      category: 'Guide',
    },
    {
      title: `Customer Success: How Company X Saved $500K Using ${product.name}`,
      excerpt: `Real results from a real customer. See how one organization transformed their ${product.category.toLowerCase()} workflow.`,
      date: 'Apr 22, 2026',
      readTime: '6 min read',
      slug: 'customer-success-500k-savings',
      category: 'Case Study',
    },
    {
      title: `Top 5 ${product.category} Trends to Watch in 2026`,
      excerpt: `Stay ahead of the curve with our analysis of the biggest trends shaping the ${product.category.toLowerCase()} landscape.`,
      date: 'Apr 15, 2026',
      readTime: '5 min read',
      slug: 'top-trends-2026',
      category: 'Trends',
    },
    {
      title: `Integrating ${product.name} with Your Existing Workflow`,
      excerpt: `A step-by-step guide to seamlessly integrate ${product.name} into your team's existing tools and processes.`,
      date: 'Apr 8, 2026',
      readTime: '7 min read',
      slug: 'integrating-with-workflow',
      category: 'Tutorial',
    },
  ]

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
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Blog' }]} />
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Blog</h1>
            <p className="text-text-muted text-lg">Insights, guides, and updates from the {product.name} team.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post, i) => (
              <article key={i} className="group rounded-2xl border border-border bg-white overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                    <span className="px-2 py-1 rounded-full bg-primary/5 text-primary font-medium">{post.category}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-text-muted mb-4 leading-relaxed">{post.excerpt}</p>
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer product={product} />
    </>
  )
}
