import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[120px] w-full rounded-sm border border-white/10 bg-[#1a2235] px-3 py-2 text-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#4f9cf9] focus:ring-1 focus:ring-[#4f9cf9] disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
