import { useState } from 'react'
import Head from 'next/head'
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/ui/Button'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { useProduct } from '../lib/product-context'

const contactMethods = [
  { icon: Mail, label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' },
  { icon: MessageSquare, label: 'Live Chat', value: 'Available 24/7', href: '#' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
]

export default function ContactPage() {
  const product = useProduct()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <Head>
        <title>Contact — {product.name}</title>
        <meta name="description" content={`Get in touch with the ${product.name} team. We're here to help.`} />
      </Head>
      <Header productName={product.name} slug={product.slug} />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Contact' }]} />
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-text mb-4">Get in Touch</h1>
              <p className="text-text-muted mb-8">
                Have a question, feedback, or need help? We'd love to hear from you.
              </p>

              <div className="space-y-6">
                {contactMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <a
                      key={method.label}
                      href={method.href}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/20 hover:shadow-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">{method.label}</p>
                        <p className="text-text font-medium">{method.value}</p>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>

            <div className="lg:col-span-3">
              {sent ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-text mb-2">Message Sent!</h2>
                  <p className="text-text-muted mb-4">We'll get back to you within 24 hours.</p>
                  <Button onClick={() => setSent(false)} variant="outline">Send Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-8 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-lg border border-border px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-lg border border-border px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full rounded-lg border border-border px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-lg border border-border px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" /> Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer product={product} />
    </>
  )
}
