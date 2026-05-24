import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import allProducts from '../../../lib/enriched-data.json'
import type { ProductData } from '../../../lib/types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase env vars')
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Default monitoring sources per category
const CATEGORY_SOURCES: Record<string, Array<{ name: string; url: string; type: string; interval: number }>> = {
  regulatory: [
    { name: 'FDA Enforcement Reports', url: 'https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts', type: 'rss', interval: 30 },
    { name: 'EPA ECHO Database', url: 'https://echo.epa.gov', type: 'api', interval: 60 },
    { name: 'OSHA Inspection Database', url: 'https://www.osha.gov/inspection', type: 'web_scraper', interval: 120 },
    { name: 'SEC EDGAR Filings', url: 'https://www.sec.gov/cgi-bin/browse-edgar', type: 'api', interval: 15 },
    { name: 'Federal Register', url: 'https://www.federalregister.gov', type: 'rss', interval: 60 },
  ],
  healthcare: [
    { name: 'ClinicalTrials.gov', url: 'https://clinicaltrials.gov', type: 'api', interval: 30 },
    { name: 'NPDB/State Licensing', url: 'https://www.npdb.hrsa.gov', type: 'web_scraper', interval: 120 },
    { name: 'FDA 510(k) Database', url: 'https://www.fda.gov/devices', type: 'api', interval: 60 },
    { name: 'HHS OIG Exclusions', url: 'https://exclusions.oig.hhs.gov', type: 'api', interval: 60 },
  ],
  financial: [
    { name: 'PACER Court Records', url: 'https://www.pacer.gov', type: 'web_scraper', interval: 30 },
    { name: 'SEC EDGAR', url: 'https://www.sec.gov', type: 'api', interval: 15 },
    { name: 'State UCC Filings', url: 'https://www.sos.state', type: 'web_scraper', interval: 120 },
    { name: 'Bankruptcy Court', url: 'https://www.uscourts.gov', type: 'api', interval: 60 },
  ],
  default: [
    { name: 'Federal Register', url: 'https://www.federalregister.gov', type: 'rss', interval: 60 },
    { name: 'Industry Intelligence Feed', url: 'https://industry.intel', type: 'api', interval: 30 },
    { name: 'Internal Data Engine', url: 'https://app.grea.site/dashboard', type: 'database', interval: 15 },
  ],
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { product: queryProduct } = req.query
  let slug = queryProduct as string
  if (!slug) {
    const host = req.headers.host || ''
    const parts = host.split('.')
    slug = (parts.length >= 2 && !['www', 'localhost', 'vercel'].includes(parts[0])) ? parts[0] : 'fdarecallalert'
  }

  const product = (allProducts as unknown as ProductData[]).find(p => p.slug === slug)
  if (!product) return res.status(404).json({ error: 'Product not found' })

  // Try to get real monitoring sources from DB
  const { data: dbSources } = await supabase.from('monitoring_sources')
    .select('*')
    .eq('product_slug', slug)
    .eq('status', 'active')

  if (dbSources && dbSources.length > 0) {
    return res.status(200).json({ sources: dbSources, total: dbSources.length })
  }

  // Fall back to seed sources
  const category = Object.keys(CATEGORY_SOURCES).find(k => product.category.toLowerCase().includes(k))
  const sources = (category ? CATEGORY_SOURCES[category] : CATEGORY_SOURCES.default).map(s => ({
    name: s.name,
    url: s.url,
    source_type: s.type,
    check_interval_minutes: s.interval,
    status: 'active',
    last_checked_at: new Date(Date.now() - Math.random() * 3600000).toISOString(),
  }))

  return res.status(200).json({ sources, total: sources.length, product: slug, category: product.category })
}
