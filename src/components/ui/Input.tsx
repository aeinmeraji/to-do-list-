import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hideLabel?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, id, label, hideLabel = false, ...props }, ref) => {
    const inputId = id ?? `input-${label.toLowerCase().replaceAll(' ', '-')}`

    return (
      <label className="block" htmlFor={inputId}>
        <span className={hideLabel ? 'sr-only' : 'mb-2 block text-sm font-semibold text-ink'}>
          {label}
        </span>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'focus-ring min-h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink placeholder:text-zinc-400',
            className,
          )}
          {...props}
        />
      </label>
    )
  },
)

Input.displayName = 'Input'
