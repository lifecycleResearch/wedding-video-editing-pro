// Automated sales follow-up: checks for abandoned carts, trial expirations, warm leads
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://qncqiuqjmovdgmsuwopb.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_jxa9wtpIq8g-fhdUUcfGFw_1Ccm4tWy'
const supabase = createClient(supabaseUrl, supabaseKey)

const slug = process.env.PRODUCT_SLUG || 'unknown'

async function run() {
  console.log(`[${slug}] Running sales follow-up...`)

  // 1. Find users nearing trial expiration
  const { data: expiring } = await supabase
    .from('profiles')
    .select('id, email, name, trial_ends_at')
    .eq('product_slug', slug)
    .gte('trial_ends_at', new Date().toISOString())
    .lte('trial_ends_at', new Date(Date.now() + 3 * 86400000).toISOString())

  if (expiring?.length) {
    console.log(`  Found ${expiring.length} users nearing trial expiration`)
    for (const user of expiring) {
      console.log(`  → Send expiration warning to ${user.email}`)
      // TODO: Integrate with Resend/SendGrid for email delivery
    }
  }

  // 2. Find abandoned checkouts (users who created accounts but no subscription)
  const { data: abandoned } = await supabase
    .from('profiles')
    .select('id, email, name')
    .eq('product_slug', slug)
    .is('stripe_customer_id', null)
    .lt('created_at', new Date(Date.now() - 86400000).toISOString())

  if (abandoned?.length) {
    console.log(`  Found ${abandoned.length} abandoned signups`)
    for (const user of abandoned) {
      console.log(`  → Send re-engagement email to ${user.email}`)
    }
  }

  console.log(`[${slug}] Sales follow-up complete`)
}

run().catch(err => {
  console.error(`[${slug}] Error:`, err.message)
  process.exit(1)
})
