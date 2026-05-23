import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  as?: 'button' | 'a'
  href?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, as = 'button', href, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
      secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-sm',
      outline: 'border-2 border-border text-text hover:bg-surface',
    }
    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-13 px-8 text-lg',
    }

    if (as === 'a' && href) {
      return (
        <a href={href} className={cn(base, variants[variant], sizes[size], className)}>
          {children}
        </a>
      )
    }

    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
