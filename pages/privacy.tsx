import Head from 'next/head'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { useProduct } from '../lib/product-context'

export default function PrivacyPage() {
  const product = useProduct()
  return (
    <>
      <Head>
        <title>Privacy Policy — {product.name}</title>
        <meta name="description" content={`${product.name} Privacy Policy. Learn how we collect, use, and protect your data.`} />
      </Head>
      <Header productName={product.name} slug={product.slug} />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
          <h1 className="text-3xl font-bold text-text mb-4">Privacy Policy</h1>
          <p className="text-text-muted mb-8">Last updated: January 1, 2026</p>

          <div className="prose prose-gray max-w-none space-y-6 text-text-muted">
            <section>
              <h2 className="text-xl font-semibold text-text">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, including your name, email address, and billing information when you create an account or use our services.</p>
              <p>We also automatically collect certain information when you use our platform, including your IP address, browser type, operating system, and usage patterns.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text">3. Data Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share your information with third-party service providers who perform services on our behalf, such as payment processing and data analytics.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text">4. Data Security</h2>
              <p>We implement appropriate technical and organizational security measures to protect your personal information. All data is encrypted in transit and at rest using industry-standard protocols.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text">5. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information at any time. Contact us at privacy@{product.slug}.com to exercise these rights.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text">6. Contact</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@{product.slug}.com.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer product={product} />
    </>
  )
}
