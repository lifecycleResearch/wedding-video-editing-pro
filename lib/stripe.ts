import { loadStripe } from '@stripe/stripe-js'

export const getStripe = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_KEY
  if (!key) throw new Error('NEXT_PUBLIC_STRIPE_KEY is not set')
  return loadStripe(key)
}
