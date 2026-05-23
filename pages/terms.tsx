import Head from 'next/head'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { useProduct } from '../lib/product-context'

export default function TermsPage() {
  const product = useProduct()
  return (
    <>
      <Head>
        <title>Terms of Service — {product.name}</title>
        <meta name="description" content={`${product.name} Terms of Service. Read our terms and conditions.`} />
      </Head>
      <Header productName={product.name} slug={product.slug} />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Terms of Service' }]} />
          <h1 className="text-3xl font-bold text-text mb-4">Terms of Service</h1>
          <p className="text-text-muted mb-8">Last updated: January 1, 2026</p>

          <div className="prose prose-gray max-w-none space-y-6 text-text-muted">
            <section>
              <h2 className="text-xl font-semibold text-text">1. Acceptance of Terms</h2>
              <p>By accessing or using {product.name}, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text">2. Description of Service</h2>
              <p>{product.name} provides a {product.category.toLowerCase()} intelligence and monitoring platform that aggregates data from various sources and delivers real-time insights and alerts to users.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text">3. User Obligations</h2>
              <p>You agree to provide accurate information when creating your account and to keep your login credentials confidential. You are responsible for all activity under your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text">4. Pricing and Payments</h2>
              <p>We offer both free and paid subscription plans. Paid plans are billed monthly in advance. You may cancel at any time, and access will continue until the end of the billing period.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text">5. Limitation of Liability</h2>
              <p>{product.name} shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text">6. Termination</h2>
              <p>We reserve the right to terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer product={product} />
    </>
  )
}
