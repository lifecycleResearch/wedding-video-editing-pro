import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'
import type { ProductData } from '../../lib/types'

interface FooterProps {
  product: ProductData
}

export function Footer({ product }: FooterProps) {
  const footerLinks = {
    Product: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Docs', href: '/docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Changelog', href: '/changelog' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
    Resources: [
      { label: 'API Reference', href: '/docs/api' },
      { label: 'Integrations', href: '/docs/integrations' },
      { label: 'Status', href: '/status' },
      { label: 'Community', href: '/community' },
      { label: 'Support', href: '/contact' },
    ],
  }

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">{product.name[0]}</span>
              </div>
              <span className="font-bold text-lg text-text">{product.name}</span>
            </div>
            <p className="text-sm text-text-muted mb-4 leading-relaxed">
              {product.name} provides real-time {product.category.toLowerCase()} intelligence and monitoring to help organizations stay ahead.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center text-text-muted hover:text-text hover:border-primary/30 transition-all" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center text-text-muted hover:text-text hover:border-primary/30 transition-all" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center text-text-muted hover:text-text hover:border-primary/30 transition-all" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-text mb-3 text-sm uppercase tracking-wider">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-text-muted hover:text-text transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} {product.name}. All rights reserved.
          </p>
          <p className="text-xs text-text-muted flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400" /> by the {product.name} team
          </p>
        </div>
      </div>
    </footer>
  )
}
