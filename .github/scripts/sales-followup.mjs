import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'RESEND_API_KEY', 'PRODUCT_SLUG']
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) throw new Error(`Missing env var: ${key}`)
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)
const slug = process.env.PRODUCT_SLUG

const TRIAL_SEQUENCE = [
  { day: 0, subject: `${process.env.PRODUCT_NAME || slug} is ready — do this one thing first`, content: '' },
  { day: 1, subject: 'the fastest way to see results', content: '' },
  { day: 3, subject: `freelancers on your platform use ${slug} for this`, content: '' },
  { day: 7, subject: `how a ${slug} user saved 10hrs/week`, content: '' },
  { day: 10, subject: 'one more thing that makes this 10x more useful', content: '' },
  { day: 12, subject: 'your trial ends in 2 days', content: '' },
  { day: 13, subject: `don't lose your work — 30% off your first month`, content: '' },
]

const ABANDONED_SEQUENCE = [
  { hour: 1, subject: `your signup is incomplete`, discount: false },
  { hour: 24, subject: `still thinking about ${slug}?`, discount: false },
  { hour: 72, subject: `${slug} + a little something for you`, discount: '15% off' },
]

async function sendEmail({ to, subject, html, from }) {
  try {
    await resend.emails.send({
      from: from || `${slug} Team <team@${slug}.grea.site>`,
      to,
      subject,
      html,
    })
    console.log(`  ✓ Email sent to ${to}: "${subject}"`)
  } catch (err) {
    console.error(`  ✗ Email failed to ${to}: ${err.message}`)
  }
}

async function run() {
  console.log(`[${slug}] Running sales follow-up pipeline...`)

  // Find users nearing trial expiration
  const { data: expiring } = await supabase
    .from('profiles')
    .select('id, email, name, trial_ends_at, created_at')
    .eq('product_slug', slug)
    .gte('trial_ends_at', new Date().toISOString())
    .lte('trial_ends_at', new Date(Date.now() + 3 * 86400000).toISOString())

  if (expiring?.length) {
    console.log(`  Found ${expiring.length} users nearing trial expiration`)
    for (const user of expiring) {
      const daysLeft = Math.ceil((new Date(user.trial_ends_at) - new Date()) / 86400000)
      const daysSinceSignup = Math.ceil((new Date() - new Date(user.created_at)) / 86400000)
      const template = TRIAL_SEQUENCE.find(t => t.day === daysSinceSignup) || TRIAL_SEQUENCE[TRIAL_SEQUENCE.length - 1]
      await sendEmail({
        to: user.email,
        subject: template.subject,
        html: `<h2>Hey ${user.name || 'there'}</h2><p>Your trial ends in ${daysLeft} days.</p><p>${template.content}</p><a href="https://${slug}.grea.site/pricing" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px">Upgrade Now →</a>`,
      })
      // Update usage log
      await supabase.from('usage_logs').insert({
        profile_id: user.id,
        action: 'sales.trial_reminder',
        metadata: { product_slug: slug, days_left: daysLeft, email_template: daysSinceSignup },
      })
    }
  }

  // Find abandoned signups
  const { data: abandoned } = await supabase
    .from('profiles')
    .select('id, email, name, created_at')
    .eq('product_slug', slug)
    .is('stripe_customer_id', null)
    .lt('created_at', new Date(Date.now() - 3600000).toISOString())

  if (abandoned?.length) {
    console.log(`  Found ${abandoned.length} abandoned signups`)
    for (const user of abandoned) {
      const hoursAgo = Math.floor((new Date() - new Date(user.created_at)) / 3600000)
      const template = ABANDONED_SEQUENCE.find(t => hoursAgo >= t.hour && hoursAgo < t.hour * 2) || ABANDONED_SEQUENCE[0]
      const discountText = template.discount ? `<p style="font-size:18px;font-weight:bold">Use code ABANDONED${Math.floor(hoursAgo/24)} for ${template.discount}</p>` : ''
      await sendEmail({
        to: user.email,
        subject: template.subject,
        html: `<h2>Hey ${user.name || 'there'}</h2><p>You started signing up for ${slug} but didn't complete it.</p>${discountText}<a href="https://${slug}.grea.site/auth?mode=signin" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px">Complete Signup →</a>`,
      })
    }
  }

  // Enrich leads via Cerebras/Groq for personalized outreach
  console.log(`[${slug}] Running AI lead enrichment...`)
  const { data: leads } = await supabase
    .from('profiles')
    .select('id, email, name')
    .eq('product_slug', slug)
    .eq('subscription_status', 'inactive')
    .lt('created_at', new Date(Date.now() - 7 * 86400000).toISOString())

  if (leads?.length) {
    console.log(`  Found ${leads.length} cold leads for enrichment`)
    // Batch enrich using available AI provider
    const AI_API = process.env.CEREBRAS_API_KEY
      ? { url: 'https://api.cerebras.ai/v1/chat/completions', key: process.env.CEREBRAS_API_KEY }
      : process.env.GROQ_API_KEY
      ? { url: 'https://api.groq.com/openai/v1/chat/completions', key: process.env.GROQ_API_KEY }
      : null

    if (AI_API) {
      for (const lead of leads) {
        try {
          const resp = await fetch(AI_API.url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${AI_API.key}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: process.env.AI_MODEL || 'llama-3.1-8b-instant',
              messages: [
                { role: 'system', content: `You are a sales personalization AI for ${slug}. Generate a 1-sentence personalized outreach hook based on the user profile.` },
                { role: 'user', content: `Lead name: ${lead.name || lead.email}, Product: ${slug}, Industry: ${process.env.PRODUCT_CATEGORY || 'freelance tools'}. Generate a personalized hook.` },
              ],
              max_tokens: 100,
            }),
          })
          const data = await resp.json()
          const hook = data.choices?.[0]?.message?.content || ''
          await supabase.from('usage_logs').insert({
            profile_id: lead.id,
            action: 'sales.personalized_hook_generated',
            metadata: { product_slug: slug, hook },
          })
        } catch (err) {
          console.error(`  ✗ Enrichment failed for ${lead.email}: ${err.message}`)
        }
      }
    }
  }

  console.log(`[${slug}] Sales follow-up pipeline complete`)
}

run().catch(err => {
  console.error(`[${slug}] Fatal error:`, err.message)
  process.exit(1)
})
