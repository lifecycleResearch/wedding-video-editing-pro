import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' })
  }

  try {
    const { customerId } = req.body

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID required' })
    }

    const host = req.headers.host || ''
    const slug = host.split('.')[0]
    const origin = req.headers.origin || `https://${slug}.grea.site`

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe portal error:', err)
    return res.status(500).json({ error: 'Failed to create billing portal session' })
  }
}