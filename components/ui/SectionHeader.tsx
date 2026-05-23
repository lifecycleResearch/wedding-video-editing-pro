import { cn } from '../../lib/utils'

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeader({ title, description, className, align = 'center' }: SectionHeaderProps) {
  return (
    <div className={cn('max-w-3xl mb-12', align === 'center' && 'mx-auto text-center', className)}>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">{title}</h2>
      {description && (
        <p className="mt-4 text-lg text-text-muted leading-relaxed">{description}</p>
      )}
    </div>
  )
}
