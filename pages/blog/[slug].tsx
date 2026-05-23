import { useRouter } from 'next/router'
import Head from 'next/head'
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { CTAHormozi } from '../../components/sections/CTAHormozi'
import { useProduct } from '../../lib/product-context'
import { generateMetaTags } from '../../lib/seo'
import { getImageUrl, getAltText } from '../../lib/images'

function getBlogPosts(product: { name: string; category: string; roi: number }): Record<string, {
  title: string; excerpt: string; content: string; date: string; readTime: string; category: string; author: string
}> {
  return {
    'ai-transforming-industry': {
      title: `How AI is Transforming ${product.category} Intelligence`,
      excerpt: `Discover how artificial intelligence is revolutionizing ${product.category.toLowerCase()} monitoring.`,
      content: `
        <p>Artificial intelligence is fundamentally changing how organizations approach ${product.category.toLowerCase()} intelligence. Gone are the days of manual monitoring and reactive decision-making.</p>
        <h2>The Old Way vs. The AI Way</h2>
        <p>Traditional ${product.category.toLowerCase()} monitoring required teams to manually scan multiple sources, cross-reference data, and make decisions based on incomplete information. This approach is not only time-consuming but also prone to human error.</p>
        <p>With AI-powered monitoring, you get:</p>
        <ul>
          <li>Real-time analysis of thousands of data sources simultaneously</li>
          <li>Pattern recognition that identifies opportunities humans might miss</li>
          <li>Predictive insights that help you stay ahead of trends</li>
          <li>Automated alerts that deliver the right information at the right time</li>
        </ul>
        <h2>Real Results</h2>
        <p>Organizations using AI-powered ${product.category.toLowerCase()} intelligence report an average of ${product.roi}x ROI within the first quarter. They catch opportunities faster, respond more effectively, and make better strategic decisions.</p>
        <h2>Getting Started</h2>
        <p>Ready to transform your ${product.category.toLowerCase()} intelligence with AI? ${product.name} makes it easy to get started with our pre-built integrations and intelligent monitoring system.</p>
      `,
      date: 'May 15, 2026',
      readTime: '5 min read',
      category: product.category,
      author: 'Sarah Chen',
    },
    'automated-monitoring-productivity': {
      title: `10x Your Team's Productivity with Automated Monitoring`,
      excerpt: `Stop wasting hours on manual checks. Learn how automation transforms your workflow.`,
      content: `
        <p>Manual monitoring is one of the biggest productivity drains in modern organizations. Teams spend an average of 15 hours per week checking sources, compiling reports, and chasing updates.</p>
        <h2>The Cost of Manual Monitoring</h2>
        <p>When you calculate the cost of manual ${product.category.toLowerCase()} monitoring, the numbers are staggering. A team of 5 spending 15 hours each per week translates to 75 hours of lost productivity — every single week.</p>
        <h2>Enter Automation</h2>
        <p>${product.name} automates the entire monitoring process. Our platform continuously scans thousands of sources, filters out noise, and delivers only what matters to your inbox, Slack, or dashboard.</p>
        <h2>The Results</h2>
        <p>Teams that switch to automated monitoring typically see a 10x improvement in productivity. What used to take a full day now takes minutes.</p>
      `,
      date: 'May 8, 2026',
      readTime: '4 min read',
      category: 'Productivity',
      author: 'Marcus Rodriguez',
    },
  }
}

export default function BlogPostPage() {
  const product = useProduct()
  const router = useRouter()
  const { slug } = router.query
  const blogPosts = getBlogPosts(product)
  const post = typeof slug === 'string' ? blogPosts[slug] : null

  if (!post) {
    return (
      <>
        <Header productName={product.name} slug={product.slug} />
        <main className="pt-24 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text mb-2">Post Not Found</h1>
            <a href="/blog" className="text-primary hover:underline">Back to blog</a>
          </div>
        </main>
        <Footer product={product} />
      </>
    )
  }

  const meta = generateMetaTags({
    title: post.title,
    description: post.excerpt,
    slug: product.slug,
    productName: product.name,
    type: 'article',
    publishedAt: post.date,
    breadcrumbs: [{ label: 'Blog', href: '/blog' }, { label: post.title, href: `/blog/${slug}` }],
  })

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.openGraph.title} />
        <meta property="og:description" content={meta.openGraph.description} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <link rel="canonical" href={meta.canonical} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(meta.schema) }} />
      </Head>
      <Header productName={product.name} slug={product.slug} />
      <main className="pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />

          <a href="/blog" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </a>

          <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
            <span className="px-2 py-1 rounded-full bg-primary/5 text-primary font-medium">{post.category}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4 leading-tight">{post.title}</h1>
          <p className="text-lg text-text-muted mb-8">{post.excerpt}</p>

          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
            <img
              src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&q=80`}
              alt={`${post.author} - ${product.name} blog author`}
              className="w-10 h-10 rounded-full object-cover"
              loading="lazy"
            />
            <div>
              <p className="text-sm font-medium text-text">{post.author}</p>
              <p className="text-xs text-text-muted">Staff Writer</p>
            </div>
            <button className="ml-auto flex items-center gap-1 text-sm text-text-muted hover:text-text">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>

          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div className="mt-16">
          <CTAHormozi product={product} />
        </div>
      </main>
      <Footer product={product} />
    </>
  )
}
