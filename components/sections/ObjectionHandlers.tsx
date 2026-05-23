import { FAQ } from '../ui/FAQ'
import type { ProductData } from '../../lib/types'

interface ObjectionHandlersProps {
  product: ProductData
}

const defaultFAQ = [
  {
    question: 'How long does it take to set up?',
    answer: 'Most users are up and running in under 30 minutes. Our white-glove onboarding team can have everything configured for you in less than 24 hours.',
  },
  {
    question: 'Do I need technical skills to use it?',
    answer: 'Not at all. We designed it for non-technical users. If you can use email, you can use our platform. Our support team handles all the technical heavy lifting.',
  },
  {
    question: 'What if I need to cancel?',
    answer: 'Cancel anytime with one click. No contracts, no penalties, no awkward phone calls. Your data is yours forever — we make it easy to export.',
  },
  {
    question: 'How is this different from doing it manually?',
    answer: `Manual monitoring takes 15+ hours per week and still misses critical updates. ${'{product.name}'} monitors 24/7 across thousands of sources and alerts you in real-time. It's like having a team of analysts working around the clock.`,
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use SOC 2 compliant infrastructure with end-to-end encryption, role-based access control, and regular security audits. Your data never leaves our secure environment.',
  },
  {
    question: 'Can I try before I buy?',
    answer: 'Yes! Start with a free trial — no credit card required. See the value for yourself before committing.',
  },
]

export function ObjectionHandlers({ product }: ObjectionHandlersProps) {
  return (
    <FAQ
      items={product.faq?.length ? product.faq : defaultFAQ}
      title="Still have questions?"
      description="We've got answers. Here's what most people ask before getting started."
    />
  )
}
