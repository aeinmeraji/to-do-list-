import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, label, ...props }, ref) => {
    const textareaId = id ?? `textarea-${label.toLowerCase().replaceAll(' ', '-')}`

    return (
      <label className="block" htmlFor={textareaId}>
        <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'focus-ring min-h-28 w-full resize-y rounded-xl border border-line bg-white px-3.5 py-3 text-sm text-ink placeholder:text-zinc-400',
            className,
          )}
          {...props}
        />
      </label>
    )
  },
)

Textarea.displayName = 'Textarea'
