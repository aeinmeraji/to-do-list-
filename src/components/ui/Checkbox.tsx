import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  hideLabel?: boolean
}

export function Checkbox({ className, hideLabel = false, id, label, ...props }: CheckboxProps) {
  const checkboxId = id ?? `checkbox-${label.toLowerCase().replaceAll(' ', '-')}`

  return (
    <label className="inline-flex cursor-pointer items-center gap-3" htmlFor={checkboxId}>
      <input
        id={checkboxId}
        type="checkbox"
        className={cn(
          'focus-ring size-5 rounded-md border-line text-accent accent-accent',
          className,
        )}
        {...props}
      />
      <span className={hideLabel ? 'sr-only' : 'text-sm text-ink'}>{label}</span>
    </label>
  )
}
