import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-text-muted">
        <li>
          <a href="/" className="hover:text-primary transition-colors" aria-label="Home">
            <Home className="w-4 h-4" />
          </a>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            {item.href ? (
              <a href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="text-text font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
