import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ValueItem {
  label: string
  value: string
}

interface ValueStackProps {
  items: ValueItem[]
  totalLabel?: string
  totalValue?: string
  className?: string
}

export function ValueStack({ items, totalLabel, totalValue, className }: ValueStackProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-text-muted">{item.label}</span>
          </div>
          <span className="font-semibold text-text">{item.value}</span>
        </div>
      ))}
      {totalLabel && totalValue && (
        <div className="flex items-center justify-between pt-2 mt-2 border-t-2 border-primary">
          <span className="font-bold text-lg text-text">{totalLabel}</span>
          <span className="font-bold text-lg text-primary">{totalValue}</span>
        </div>
      )}
    </div>
  )
}
