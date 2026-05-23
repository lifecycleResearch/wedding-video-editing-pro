import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, User, LayoutDashboard, FileText, BookOpen } from 'lucide-react'
import { Button } from '../ui/Button'
import { supabase } from '../../lib/supabase'
import { cn } from '../../lib/utils'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface HeaderProps {
  productName: string
  slug: string
}

export function Header({ productName, slug }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      listener?.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setShowDropdown(false)
  }

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: '/docs' },
    { label: 'Blog', href: '/blog' },
  ]

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-border shadow-sm'
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">{productName[0]}</span>
            </div>
            <span className="font-bold text-lg text-text">{productName}</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-muted hover:text-text transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-text">{user.email?.split('@')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-border shadow-lg py-2">
                    <a href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-surface" onClick={() => setShowDropdown(false)}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </a>
                    <a href="/dashboard/billing" className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-surface" onClick={() => setShowDropdown(false)}>
                      <FileText className="w-4 h-4" /> Billing
                    </a>
                    <a href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-surface" onClick={() => setShowDropdown(false)}>
                      <BookOpen className="w-4 h-4" /> Settings
                    </a>
                    <hr className="my-1 border-border" />
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-surface">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/auth" className="text-sm text-text-muted hover:text-text transition-colors">Sign In</a>
                <Button as="a" href={`/auth?mode=signup&ref=${slug}`} size="sm">
                  Start Free Trial
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-text-muted hover:text-text"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className={cn('md:hidden border-t border-border bg-white', isOpen ? 'block' : 'hidden')}>
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="block py-2 text-text-muted hover:text-text" onClick={() => setIsOpen(false)}>
              {link.label}
            </a>
          ))}
          {user ? (
            <>
              <a href="/dashboard" className="block py-2 text-text" onClick={() => setIsOpen(false)}>Dashboard</a>
              <button onClick={() => { handleSignOut(); setIsOpen(false); }} className="block py-2 text-red-500">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <a href="/auth" className="block py-2 text-text-muted hover:text-text" onClick={() => setIsOpen(false)}>Sign In</a>
              <Button as="a" href="/auth?mode=signup" className="w-full" onClick={() => setIsOpen(false)}>
                Start Free Trial
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
