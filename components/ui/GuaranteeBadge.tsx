import { ShieldCheck } from 'lucide-react'

interface GuaranteeBadgeProps {
  days?: number
  text?: string
}

export function GuaranteeBadge({ days = 30, text }: GuaranteeBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
      <ShieldCheck className="w-4 h-4" />
      <span className="font-medium">{text || `${days}-Day Money-Back Guarantee`}</span>
    </div>
  )
}
