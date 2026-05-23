#!/usr/bin/env node
/**
 * Alert Pipeline: Generates alerts from incidents and delivers them to users
 * based on their subscription tier and configured channels.
 * 
 * Runs every 15 minutes via GitHub Actions cron.
 * 
 * Tier logic:
 * - Starter: Email alerts for urgent/critical incidents only (last 7 days)
 * - Pro: Email + SMS + Webhook for all severities, full incident history
 * - Enterprise: All channels + autonomous agent actions + API webhooks
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

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
  // Would integrate with Resend/SendGrid
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({ from: 'alerts@grea.site', to: profile.email, subject: alert.title, html: alert.description })
  console.log(`    [Email] Would send to ${profile.email}`)
}

async function sendSMS(alert, profile) {
  // Would integrate with Twilio
  // const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
  // await twilio.messages.create({ body: alert.title, from: process.env.TWILIO_PHONE, to: profile.phone })
  console.log(`    [SMS] Would send to ${profile.phone || 'N/A'}`)
}

async function sendWebhook(alert, profile) {
  // Get user's webhook configs
  const { data: webhooks } = await supabase
    .from('webhook_configs')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('active', true)

  for (const wh of webhooks || []) {
    try {
      // await fetch(wh.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alert, signature: signPayload(alert, wh.secret) }) })
      console.log(`    [Webhook] Would POST to ${wh.url}`)
    } catch (e) {
      console.error(`    [Webhook] Error: ${e.message}`)
    }
  }
}

async function triggerAgent(alert, profile) {
  // Get active agents for this profile
  const { data: agents } = await supabase
    .from('agent_configs')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('active', true)

  for (const agent of agents || []) {
    console.log(`    [Agent ${agent.agent_type}] Triggered for "${alert.title.slice(0, 50)}..."`)
    // Agent would process the alert based on its type and config
  }
}

main().catch(e => { console.error(e); process.exit(1) })
