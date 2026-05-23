export interface PriceTier {
  price: number
  queries: string
  features: string[]
}

export interface PricingData {
  starter: PriceTier
  pro: PriceTier
  enterprise: PriceTier
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  image?: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface HowItWorksStep {
  step: number
  title: string
  description: string
  icon: string
}

export interface FeatureDetail {
  title: string
  description: string
  benefit: string
  image?: string
  icon: string
}

export interface ProductData {
  name: string
  slug: string
  tagline: string
  hook: string
  description: string
  category: string
  primaryColor: string
  pricing: PricingData
  competitor?: { name: string; price: number }
  roi: number
  roiLabel?: string
  bundle?: { name: string; price: number }
  features: FeatureDetail[]
  testimonials: Testimonial[]
  faq: FAQItem[]
  howItWorks: HowItWorksStep[]
  problemAgitate: { problem: string; agitate: string }
  dreamOutcome: string
  riskReversal: string
  guaranteeDays: number
  scarcity: string
  images: {
    hero: string
    dashboard: string
    features: string[]
    testimonials: string[]
  }
  altText: Record<string, string>
}
