import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
}

export function Select({ className, id, label, children, ...props }: SelectProps) {
  const selectId = id ?? `select-${label.toLowerCase().replaceAll(' ', '-')}`

  return (
    <label className="block" htmlFor={selectId}>
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <select
        id={selectId}
        className={cn(
          'focus-ring min-h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
