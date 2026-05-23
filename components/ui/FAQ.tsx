import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { FAQItem } from '../../lib/types'

interface FAQProps {
  items: FAQItem[]
  title?: string
  description?: string
}

export function FAQ({ items, title = 'Frequently Asked Questions', description }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text mb-4">{title}</h2>
          {description && <p className="text-text-muted">{description}</p>}
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-surface/50 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span className="font-medium text-text pr-4">{item.question}</span>
                <ChevronDown className={cn(
                  'w-5 h-5 text-text-muted transition-transform flex-shrink-0',
                  openIndex === i && 'rotate-180'
                )} />
              </button>
              <div className={cn(
                'overflow-hidden transition-all duration-300',
                openIndex === i ? 'max-h-96' : 'max-h-0'
              )}>
                <div className="px-5 pb-5 text-text-muted leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
