import { cn } from '../../lib/utils'

interface ImageWithAltProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  wrapperClassName?: string
}

export function ImageWithAlt({ src, alt, className, width = 800, height = 600, priority, wrapperClassName }: ImageWithAltProps) {
  return (
    <div className={cn('overflow-hidden rounded-xl', wrapperClassName)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn('w-full h-auto object-cover', className)}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
      />
    </div>
  )
}
