import { cn } from '../../lib/utils'

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'accent' | 'warning'
  children: React.ReactNode
  className?: string
}

const variants = {
  default: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/10 text-accent',
  warning: 'bg-yellow-400 text-yellow-900',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  )
}
