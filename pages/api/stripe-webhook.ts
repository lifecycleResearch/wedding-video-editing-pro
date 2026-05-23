import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { supabaseAdmin } from '../../lib/supabase-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export const config = {
  api: { bodyParser: false },
}

async function buffer(readable: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

async function updateProfile(stripeCustomerId: string, data: Record<string, unknown>) {
  if (!supabaseAdmin) {
    console.warn('Supabase admin client not configured. Skipping profile update.')
    return
  }
  await supabaseAdmin
    .from('profiles')
    .update(data)
    .eq('stripe_customer_id', stripeCustomerId)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = await buffer(req)
    const sig = req.headers['stripe-signature'] as string

    let event: Stripe.Event
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } else {
      event = JSON.parse(body.toString('utf-8'))
    }

    const session = event.data.object as Stripe.Checkout.Session

    switch (event.type) {
      case 'checkout.session.completed': {
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string
        const email = session.customer_email || session.customer_details?.email

        if (email && supabaseAdmin) {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single()

          if (profile) {
            await supabaseAdmin
              .from('profiles')
              .update({
                stripe_customer_id: customerId,
                subscription_id: subscriptionId,
                subscription_status: 'active',
                plan: 'pro',
              })
              .eq('id', profile.id)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await updateProfile(subscription.customer as string, {
          subscription_status: subscription.status,
          subscription_id: subscription.id,
        })
        break
      }

      case 'customer.subscription.deleted': {
        const deletedSub = event.data.object as Stripe.Subscription
        await updateProfile(deletedSub.customer as string, {
          subscription_status: 'cancelled',
          plan: 'free',
          subscription_id: null,
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await updateProfile(invoice.customer as string, {
            subscription_status: 'active',
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object as Stripe.Invoice
        if (failedInvoice.subscription) {
          await updateProfile(failedInvoice.customer as string, {
            subscription_status: 'past_due',
          })
        }
        break
      }
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('Stripe webhook error:', err)
    return res.status(400).json({ error: 'Webhook handler failed' })
  }
}
