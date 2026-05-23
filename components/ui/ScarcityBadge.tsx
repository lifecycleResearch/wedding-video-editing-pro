import { Timer } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ScarcityBadgeProps {
  text: string
  expiryMinutes?: number
}

export function ScarcityBadge({ text, expiryMinutes }: ScarcityBadgeProps) {
  const [timeLeft, setTimeLeft] = useState(expiryMinutes ? expiryMinutes * 60 : 0)

  useEffect(() => {
    if (!expiryMinutes) return
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [expiryMinutes])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
      <Timer className="w-4 h-4" />
      <span>{text}</span>
      {expiryMinutes && timeLeft > 0 && (
        <span className="font-mono tabular-nums">{formatTime(timeLeft)}</span>
      )}
    </div>
  )
}
