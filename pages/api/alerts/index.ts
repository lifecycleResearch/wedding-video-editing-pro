import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qncqiuqjmovdgmsuwopb.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jxa9wtpIq8g-fhdUUcfGFw_1Ccm4tWy'
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '') || ''
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const { unread = 'false', page = '1', limit = '50' } = req.query
    const pageNum = parseInt(page as string, 10)
    const limitNum = parseInt(limit as string, 10)

    let query = supabase.from('alerts').select('*, incidents(title, source, severity)', { count: 'exact' })
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false })
      .range((pageNum - 1) * limitNum, pageNum * limitNum - 1)

    if (unread === 'true') query = query.eq('read', false)

    const { data, count, error } = await query
    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({ alerts: data, total: count || 0, page: pageNum })
  }

  if (req.method === 'POST') {
    const { title, description, incident_id, severity = 'info', channel = 'email' } = req.body
    if (!title) return res.status(400).json({ error: 'Title required' })

    const { data, error } = await supabase.from('alerts').insert({
      profile_id: user.id,
      title,
      description,
      incident_id,
      severity,
      delivered_via: [channel],
    }).select().single()

    if (error) return res.status(500).json({ error: error.message })

    // Deliver alert via configured channels
    const deliveryResult = await deliverAlert(data, channel)

    return res.status(201).json({ alert: data, delivery: deliveryResult })
  }

  if (req.method === 'PATCH') {
    const { alert_id, read } = req.body
    if (!alert_id) return res.status(400).json({ error: 'alert_id required' })

    const { data, error } = await supabase.from('alerts')
      .update({ read: read !== undefined ? read : true })
      .eq('id', alert_id)
      .eq('profile_id', user.id)
      .select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ alert: data })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

async function deliverAlert(alert: any, channel: string) {
  const results: Record<string, string> = {}

  if (channel === 'email') {
    results.email = 'queued' // Would integrate with Resend/SendGrid
  }
  if (channel === 'sms') {
    results.sms = 'queued' // Would integrate with Twilio
  }
  if (channel === 'webhook') {
    results.webhook = 'dispatched' // Would POST to user's webhook URL
  }

  return results
}
