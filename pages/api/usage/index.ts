import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase env vars')
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const PLAN_LIMITS: Record<string, { queries: number; alerts: number; label: string }> = {
  starter: { queries: 1000, alerts: 50, label: 'Starter' },
  pro: { queries: 10000, alerts: 500, label: 'Professional' },
  enterprise: { queries: 999999, alerts: 999999, label: 'Enterprise' },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '') || ''
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    // Get profile with plan info
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const plan = profile?.plan || 'starter'
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.starter

    // Get usage stats
    const { data: queryCount } = await supabase.from('usage_logs')
      .select('id', { count: 'exact' })
      .eq('profile_id', user.id)
      .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())

    const { data: alertCount } = await supabase.from('alerts')
      .select('id', { count: 'exact' })
      .eq('profile_id', user.id)
      .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())

    // Get recent activity
    const { data: recent } = await supabase.from('usage_logs')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    return res.status(200).json({
      plan: { name: plan, label: limits.label },
      usage: {
        queries: { used: queryCount?.length || 0, limit: limits.queries, pct: Math.round(((queryCount?.length || 0) / limits.queries) * 100) },
        alerts: { used: alertCount?.length || 0, limit: limits.alerts, pct: Math.round(((alertCount?.length || 0) / limits.alerts) * 100) },
      },
      recent_activity: recent || [],
      can_upgrade: plan !== 'enterprise',
      can_access_db: plan !== 'starter',
      can_api: plan === 'enterprise',
      can_agent: plan === 'enterprise',
    })
  }

  if (req.method === 'POST') {
    const { action, metadata = {} } = req.body
    if (!action) return res.status(400).json({ error: 'action required' })

    await supabase.from('usage_logs').insert({ profile_id: user.id, action, metadata })

    return res.status(201).json({ logged: true, action })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
