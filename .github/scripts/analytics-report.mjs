import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseKey) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
const supabase = createClient(supabaseUrl, supabaseKey)

const slug = process.env.PRODUCT_SLUG || 'unknown'

async function run() {
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // New signups yesterday
  const { count: signups } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('product_slug', slug)
    .gte('created_at', yesterday)

  // Active subscriptions
  const { count: active } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('product_slug', slug)
    .not('stripe_customer_id', 'is', null)

  console.log(`[${slug}] Daily Report (${yesterday})`)
  console.log(`  New signups:     ${signups ?? 0}`)
  console.log(`  Active subs:     ${active ?? 0}`)
  console.log(`  Conversion:      ${signups > 0 ? ((active ?? 0) / signups * 100).toFixed(1) : 0}%`)
}

run().catch(err => {
  console.error(`[${slug}] Error:`, err.message)
  process.exit(1)
})
