import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import allProducts from '../../lib/enriched-data.json'
import type { ProductData } from '../../lib/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
})

interface CheckoutBody {
  plan?: string
}

function getProductSlug(req: NextApiRequest): string {
  const host = req.headers.host || ''
  const parts = host.split('.')
  if (parts.length >= 2 && !['www', 'localhost', 'vercel'].includes(parts[0])) {
    return parts[0]
  }
  return 'fdarecallalert'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' })
  }

  try {
    const { plan } = req.body as CheckoutBody
    const slug = getProductSlug(req)
    const product = (allProducts as unknown as ProductData[]).find((p) => p.slug === slug)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const priceKey = plan as keyof typeof product.pricing
    if (!plan || !product.pricing[priceKey]) {
      return res.status(400).json({ error: 'Invalid plan selected' })
    }

    const price = product.pricing[priceKey].price
    const origin = req.headers.origin || `https://${slug}.grea.site`
    const planName = plan.charAt(0).toUpperCase() + plan.slice(1)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${product.name} ${planName}`,
              description: product.description,
            },
            unit_amount: price * 100,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        product_slug: slug,
        plan: plan,
      },
    })

    return res.status(200).json({ id: session.id, url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return res.status(500).json({ error: 'Failed to create checkout session' })
  }
}