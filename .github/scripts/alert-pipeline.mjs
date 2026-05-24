#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || ''
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || ''
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || ''
const CEREBRAS_KEY = process.env.CEREBRAS_API_KEY || ''
const GROQ_KEY = process.env.GROQ_API_KEY || ''
const slug = process.env.PRODUCT_SLUG || 'unknown'

const TIER_CONFIG = {
  starter: {
    severities: ['urgent', 'critical'],
    channels: ['email'],
    lookback_hours: 168, // 7 days
  },
  pro: {
    severities: ['urgent', 'critical', 'warning', 'info'],
    channels: ['email', 'sms', 'webhook'],
    lookback_hours: 720, // 30 days
  },
  enterprise: {
    severities: ['urgent', 'critical', 'warning', 'info'],
    channels: ['email', 'sms', 'webhook', 'agent'],
    lookback_hours: 999999, // unlimited
  },
}

async function main() {
  console.log(`[Alert Pipeline] Starting at ${new Date().toISOString()}`)

  // Get all active profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('subscription_status', 'active')

  if (error || !profiles) {
    console.error(`Error fetching profiles: ${error?.message}`)
    process.exit(1)
  }

  console.log(`[Alert Pipeline] Found ${profiles.length} active subscribers`)

  let totalAlerts = 0
  let totalDeliveries = 0

  for (const profile of profiles) {
    const tier = profile.plan || 'starter'
    const config = TIER_CONFIG[tier] || TIER_CONFIG.starter

    // Get recent incidents for this product
    const since = new Date(Date.now() - config.lookback_hours * 3600000).toISOString()
    const { data: incidents } = await supabase
      .from('incidents')
      .select('*')
      .eq('product_slug', profile.product_slug || profile.slug)
      .in('severity', config.severities)
      .gte('occurred_at', since)
      .order('occurred_at', { ascending: false })
      .limit(50)

    if (!incidents || incidents.length === 0) continue

    for (const incident of incidents) {
      // Check if alert already exists
      const { data: existing } = await supabase
        .from('alerts')
        .select('id')
        .eq('profile_id', profile.id)
        .eq('incident_id', incident.id)
        .limit(1)

      if (existing && existing.length > 0) continue

      // Create alert
      const { data: alert, error: alertError } = await supabase
        .from('alerts')
        .insert({
          profile_id: profile.id,
          incident_id: incident.id,
          title: incident.title,
          description: incident.description,
          category: incident.category,
          severity: incident.severity,
          delivered_via: [],
        })
        .select()
        .single()

      if (alertError || !alert) {
        console.error(`  Error creating alert: ${alertError?.message}`)
        continue
      }

      totalAlerts++

      // Deliver via configured channels
      for (const channel of config.channels) {
        await deliverAlert(alert, profile, channel)
        totalDeliveries++
      }
    }
  }

  console.log(`[Alert Pipeline] Complete: ${totalAlerts} alerts, ${totalDeliveries} deliveries`)
}

async function deliverAlert(alert, profile, channel) {
  console.log(`  Delivering alert "${alert.title.slice(0, 50)}..." via ${channel} to ${profile.email}`)

  switch (channel) {
    case 'email':
      await sendEmail(alert, profile)
      break
    case 'sms':
      await sendSMS(alert, profile)
      break
    case 'webhook':
      await sendWebhook(alert, profile)
      break
    case 'agent':
      await triggerAgent(alert, profile)
      break
  }

  // Update delivered_via
  await supabase.from('alerts')
    .update({ delivered_via: [...(alert.delivered_via || []), channel] })
    .eq('id', alert.id)
}

async function sendEmail(alert, profile) {
  if (!resend) {
    console.log(`    [Email] Skipped (no RESEND_API_KEY) to ${profile.email}`)
    return
  }
  try {
    const severityColor = alert.severity === 'critical' ? '#dc2626' : alert.severity === 'urgent' ? '#ea580c' : '#2563eb'
    await resend.emails.send({
      from: `alerts@${slug}.grea.site`,
      to: profile.email,
      subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:${severityColor};color:#fff;padding:20px 24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:20px">${alert.severity.toUpperCase()} Alert</h1>
        </div>
        <div style="padding:24px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px">
          <h2 style="margin:0 0 12px;color:#111827">${alert.title}</h2>
          <p style="color:#374151;line-height:1.6">${alert.description}</p>
          <p style="color:#6b7280;font-size:14px">Category: ${alert.category || 'General'}</p>
          <a href="https://${slug}.grea.site/dashboard/alerts/${alert.id}" style="display:inline-block;padding:10px 20px;background:${severityColor};color:#fff;text-decoration:none;border-radius:6px;margin-top:12px">View Alert →</a>
        </div>
      </div>`,
    })
    console.log(`    [Email] Sent to ${profile.email}: "${alert.title.slice(0, 50)}..."`)
  } catch (err) {
    console.error(`    [Email] Failed to ${profile.email}: ${err.message}`)
  }
}

async function sendSMS(alert, profile) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.log(`    [SMS] Skipped (no Twilio config) to ${profile.phone || 'N/A'}`)
    return
  }
  if (!profile.phone) {
    console.log(`    [SMS] Skipped (no phone on file)`)
    return
  }
  try {
    const twilioAuth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
    const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${twilioAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: profile.phone, From: TWILIO_PHONE_NUMBER, Body: `[${alert.severity.toUpperCase()}] ${alert.title} - ${alert.description.slice(0, 120)}` }),
    })
    if (resp.ok) {
      console.log(`    [SMS] Sent to ${profile.phone}`)
    } else {
      const errBody = await resp.text()
      console.error(`    [SMS] Twilio error: ${errBody}`)
    }
  } catch (err) {
    console.error(`    [SMS] Failed: ${err.message}`)
  }
}

async function sendWebhook(alert, profile) {
  const { data: webhooks } = await supabase
    .from('webhook_configs')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('active', true)

  for (const wh of webhooks || []) {
    try {
      const payload = JSON.stringify({
        event: 'alert.created',
        alert: { id: alert.id, title: alert.title, description: alert.description, severity: alert.severity, category: alert.category, occurred_at: alert.occurred_at },
        timestamp: new Date().toISOString(),
      })
      const resp = await fetch(wh.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': wh.secret || '' },
        body: payload,
      })
      if (resp.ok) {
        console.log(`    [Webhook] Posted to ${wh.url} (${resp.status})`)
      } else {
        console.error(`    [Webhook] ${wh.url} returned ${resp.status}`)
      }
    } catch (e) {
      console.error(`    [Webhook] Error POSTing to ${wh.url}: ${e.message}`)
    }
  }
}

async function triggerAgent(alert, profile) {
  const aiKey = CEREBRAS_KEY || GROQ_KEY
  if (!aiKey) {
    console.log(`    [Agent] Skipped (no AI API key)`)
    return
  }
  const aiUrl = CEREBRAS_KEY ? 'https://api.cerebras.ai/v1/chat/completions' : 'https://api.groq.com/openai/v1/chat/completions'

  const { data: agents } = await supabase
    .from('agent_configs')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('active', true)

  for (const agent of agents || []) {
    try {
      const resp = await fetch(aiUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${aiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: `You are ${agent.agent_type || 'an autonomous agent'} for ${slug}. Analyze this alert and determine the appropriate response action.` },
            { role: 'user', content: `Alert: ${alert.title}\nDescription: ${alert.description}\nSeverity: ${alert.severity}\nCategory: ${alert.category}\n\nWhat action should be taken?` },
          ],
          max_tokens: 200,
        }),
      })
      const data = await resp.json()
      const action = data.choices?.[0]?.message?.content || 'No action determined'
      await supabase.from('agent_logs').insert({
        alert_id: alert.id,
        agent_type: agent.agent_type,
        action_taken: action,
        status: 'dispatched',
      })
      console.log(`    [Agent ${agent.agent_type}] Dispatched action for "${alert.title.slice(0, 50)}..."`)
    } catch (err) {
      console.error(`    [Agent ${agent.agent_type}] Error: ${err.message}`)
    }
  }
}

main().catch(e => { console.error(e); process.exit(1) })
