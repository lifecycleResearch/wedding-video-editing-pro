export interface SEOProps {
  title: string
  description: string
  slug: string
  productName: string
  category?: string
  image?: string
  type?: 'website' | 'article'
  publishedAt?: string
  breadcrumbs?: { label: string; href: string }[]
}

export function generateMetaTags({
  title,
  description,
  slug,
  productName,
  category,
  image,
  type = 'website',
  publishedAt,
  breadcrumbs,
}: SEOProps) {
  const url = process.env.NEXT_PUBLIC_SITE_URL || `https://${slug}.grea.site`
  const fullUrl = breadcrumbs
    ? `${url}${breadcrumbs.map(b => b.href).join('')}`
    : url
  const imgUrl = image || `${url}/og-image.png`

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'SoftwareApplication',
    name: productName,
    description,
    url: fullUrl,
    image: imgUrl,
  }

  if (breadcrumbs) {
    schema.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.label,
        item: `${url}${b.href}`,
      })),
    }
  }

  if (publishedAt) {
    schema.datePublished = publishedAt
  }

  return {
    title: `${title} — ${productName}`,
    description,
    canonical: fullUrl,
    openGraph: {
      title: `${title} — ${productName}`,
      description,
      url: fullUrl,
      type,
      image: imgUrl,
      site_name: productName,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${productName}`,
      description,
      image: imgUrl,
    },
    schema,
  }
}

export function generateBreadcrumbJsonLD(breadcrumbs: { label: string; href: string }[], slug: string): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || `https://${slug}.grea.site`
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.label,
      item: `${url}${b.href}`,
    })),
  })
}
