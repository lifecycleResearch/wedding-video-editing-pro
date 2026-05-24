import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase env vars')
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const AGENT_TYPES = [
  { type: 'monitor', name: 'Monitor Agent', desc: 'Continuously monitors data sources and triggers alerts on changes', schedule: 'every 15min' },
  { type: 'analyzer', name: 'Analyzer Agent', desc: 'Analyzes patterns in incidents and generates predictive insights', schedule: 'hourly' },
  { type: 'responder', name: 'Responder Agent', desc: 'Auto-responds to incidents with predefined actions', schedule: 'real-time' },
  { type: 'reporter', name: 'Reporter Agent', desc: 'Generates daily/weekly reports and sends to stakeholders', schedule: 'daily' },
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '') || ''
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  // Check plan - agents are Enterprise only
  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  if (profile?.plan !== 'enterprise') {
    return res.status(403).json({
      error: 'Agents require Enterprise plan',
      upgrade_required: true,
      current_plan: profile?.plan || 'starter',
      agents: AGENT_TYPES,
    })
  }

  if (req.method === 'GET') {
    const { data: agents } = await supabase.from('agent_configs')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false })

    return res.status(200).json({ agents: agents || [], available: AGENT_TYPES })
  }

  if (req.method === 'POST') {
    const { agent_type, name, config = {}, schedule = 'hourly' } = req.body
    if (!agent_type || !name) return res.status(400).json({ error: 'agent_type and name required' })

    const { data, error } = await supabase.from('agent_configs').insert({
      profile_id: user.id,
      agent_type,
      name,
      config,
      schedule,
    }).select().single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ agent: data })
  }

  if (req.method === 'PATCH') {
    const { agent_id, active, config } = req.body
    if (!agent_id) return res.status(400).json({ error: 'agent_id required' })

    const updates: Record<string, unknown> = {}
    if (active !== undefined) updates.active = active
    if (config) updates.config = config

    const { data, error } = await supabase.from('agent_configs')
      .update(updates)
      .eq('id', agent_id)
      .eq('profile_id', user.id)
      .select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ agent: data })
  }

  if (req.method === 'DELETE') {
    const { agent_id } = req.body
    if (!agent_id) return res.status(400).json({ error: 'agent_id required' })

    const { error } = await supabase.from('agent_configs')
      .delete()
      .eq('id', agent_id)
      .eq('profile_id', user.id)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ deleted: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
