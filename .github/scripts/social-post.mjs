import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseKey) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
const supabase = createClient(supabaseUrl, supabaseKey)

const CEREBRAS_KEY = process.env.CEREBRAS_API_KEY || ''
const GROQ_KEY = process.env.GROQ_API_KEY || ''
const slug = process.env.PRODUCT_SLUG || 'unknown'

async function generatePost() {
  const aiKey = CEREBRAS_KEY || GROQ_KEY
  if (!aiKey) {
    console.log(`[${slug}] Social post: no AI key, using template`)
    return `New from ${slug}! Check out our latest features and updates. https://${slug}.grea.site`
  }
  const aiUrl = CEREBRAS_KEY ? 'https://api.cerebras.ai/v1/chat/completions' : 'https://api.groq.com/openai/v1/chat/completions'

  const { count: users } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('product_slug', slug)

  try {
    const resp = await fetch(aiUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${aiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a social media marketing assistant. Write a short social media post (under 280 chars) to promote a SaaS product. Include a relevant emoji and a call to action. Do not use hashtags.' },
          { role: 'user', content: `Product: ${slug}, Active users: ${users || 0}. Write a promotional social post.` },
        ],
        max_tokens: 150,
      }),
    })
    const data = await resp.json()
    return data.choices?.[0]?.message?.content || `Check out ${slug}! https://${slug}.grea.site`
  } catch (err) {
    console.error(`[${slug}] AI post generation failed: ${err.message}`)
    return `New updates on ${slug}! https://${slug}.grea.site`
  }
}

async function postToSocial(content) {
  // Buffer API posting
  const bufferToken = process.env.BUFFER_ACCESS_TOKEN
  const bufferProfileId = process.env.BUFFER_PROFILE_ID

  if (bufferToken && bufferProfileId) {
    try {
      const resp = await fetch(`https://api.bufferapp.com/1/updates/create.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: bufferToken,
          profile_ids: [bufferProfileId],
          text: content,
          media: { link: `https://${slug}.grea.site` },
        }),
      })
      if (resp.ok) console.log(`[${slug}] Posted to Buffer: "${content.slice(0, 50)}..."`)
      else console.error(`[${slug}] Buffer error: ${await resp.text()}`)
    } catch (err) {
      console.error(`[${slug}] Buffer API error: ${err.message}`)
    }
    return
  }

  // LinkedIn API posting
  const linkedinToken = process.env.LINKEDIN_ACCESS_TOKEN
  const linkedinPersonId = process.env.LINKEDIN_PERSON_ID
  if (linkedinToken && linkedinPersonId) {
    try {
      const resp = await fetch(`https://api.linkedin.com/v2/ugcPosts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${linkedinToken}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
        body: JSON.stringify({
          author: `urn:li:person:${linkedinPersonId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': { shareCommentary: { text: content }, shareMediaCategory: 'NONE' },
          },
          visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
        }),
      })
      if (resp.ok) console.log(`[${slug}] Posted to LinkedIn: "${content.slice(0, 50)}..."`)
      else console.error(`[${slug}] LinkedIn error: ${await resp.text()}`)
    } catch (err) {
      console.error(`[${slug}] LinkedIn API error: ${err.message}`)
    }
    return
  }

  console.log(`[${slug}] Social post (no Buffer/LinkedIn configured): "${content}"`)
}

async function run() {
  const content = await generatePost()
  await postToSocial(content)

  await supabase.from('usage_logs').insert({
    action: 'marketing.social_post',
    metadata: { product_slug: slug, content, timestamp: new Date().toISOString() },
  })
}

run().catch(err => { console.error(`[${slug}] Social post error:`, err.message); process.exit(1) })
