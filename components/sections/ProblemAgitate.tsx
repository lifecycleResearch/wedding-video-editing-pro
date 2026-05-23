import { AlertTriangle, ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import type { ProductData } from '../../lib/types'

interface ProblemAgitateProps {
  product: ProductData
}

export function ProblemAgitate({ product }: ProblemAgitateProps) {
  const { problemAgitate, dreamOutcome } = product

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-border p-8 sm:p-12 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm font-semibold text-red-500 uppercase tracking-wider">The Problem</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-6 leading-tight">
            {problemAgitate?.problem || `Manual ${product.category.toLowerCase()} monitoring is costing you time, money, and opportunities`}
          </h2>

          <p className="text-lg text-text-muted leading-relaxed mb-6">
            {problemAgitate?.agitate || `Every day you spend hours manually checking sources, spreadsheets, and inboxes for ${product.category.toLowerCase()} updates. By the time you find out, your competitors have already moved. You're losing deals, missing deadlines, and playing catch-up while your team is buried in busywork.`}
          </p>

          <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
            <p className="text-red-700 font-medium">
              The cost of inaction: Late responses, missed opportunities, compliance risks, and thousands in lost revenue every month.
            </p>
          </div>

          {dreamOutcome && (
            <>
              <div className="border-t border-border my-8" />
              <div className="text-center">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Imagine Instead</p>
                <p className="text-xl text-text font-semibold">{dreamOutcome}</p>
              </div>
            </>
          )}

          <div className="mt-8 text-center">
            <Button as="a" href={`/api/auth/signup?ref=${product.slug}`} size="lg">
              Fix This Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
