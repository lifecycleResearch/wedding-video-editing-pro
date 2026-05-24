import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { getIncidentsForProduct } from '../../../lib/incidents'
import allProducts from '../../../lib/enriched-data.json'
import type { ProductData } from '../../../lib/types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase env vars')
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

interface PlanLimits {
  queries_limit: number
  alerts_limit: number
  can_access_db: boolean
  can_api: boolean
  can_agent: boolean
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  starter: { queries_limit: 1000, alerts_limit: 50, can_access_db: false, can_api: false, can_agent: false },
  pro: { queries_limit: 10000, alerts_limit: 500, can_access_db: true, can_api: true, can_agent: false },
  enterprise: { queries_limit: 999999, alerts_limit: 999999, can_access_db: true, can_api: true, can_agent: true },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { product: queryProduct, page = '1', limit = '20', severity, category } = req.query
  const pageNum = parseInt(page as string, 10)
  const limitNum = parseInt(limit as string, 10)

  // Determine product slug
  let slug = queryProduct as string
  if (!slug) {
    const host = req.headers.host || ''
    const parts = host.split('.')
    slug = (parts.length >= 2 && !['www', 'localhost', 'vercel'].includes(parts[0])) ? parts[0] : 'fdarecallalert'
  }

  const product = (allProducts as unknown as ProductData[]).find(p => p.slug === slug)
  if (!product) return res.status(404).json({ error: 'Product not found' })

  // Get user session
  const { data: { user } } = await supabase.auth.getUser(req.headers.authorization?.replace('Bearer ', '') || '')
  const plan = user ? 'starter' : 'free' // Will be updated after Stripe webhook
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.starter

  // Track usage
  if (user) {
    await supabase.from('usage_logs').insert({
      profile_id: user.id,
      action: 'incidents.list',
      metadata: { product: slug, page: pageNum, limit: limitNum },
    })
  }

  // Try to get real incidents from Supabase first
  let incidents: any[] = []
  let total = 0

  if (limits.can_access_db) {
    // Pro/Enterprise: access full incident database
    let query = supabase.from('incidents').select('*', { count: 'exact' }).eq('product_slug', slug).order('occurred_at', { ascending: false })
    if (severity) query = query.eq('severity', severity)
    if (category) query = query.eq('category', category)
    query = query.range((pageNum - 1) * limitNum, pageNum * limitNum - 1)

    const { data, count, error } = await query
    if (!error && data) {
      incidents = data
      total = count || 0
    }
  }

  // If no real incidents yet, use seed data
  if (incidents.length === 0) {
    const seedIncidents = getIncidentsForProduct(product)
    let filtered = seedIncidents
    if (severity) filtered = filtered.filter(i => i.severity === severity)
    if (category) filtered = filtered.filter(i => i.category === category)
    total = filtered.length
    incidents = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum)
  }

  // Starter tier: only show last 7 days, no historical access
  if (!limits.can_access_db) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()
    incidents = incidents.filter(i => new Date(i.occurred_at) >= new Date(sevenDaysAgo))
  }

  return res.status(200).json({
    incidents,
    total,
    page: pageNum,
    limit: limitNum,
    plan,
    limits: { queries_limit: limits.queries_limit, alerts_limit: limits.alerts_limit, can_access_db: limits.can_access_db, can_api: limits.can_api, can_agent: limits.can_agent },
  })
}
