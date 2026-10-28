import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  children: ReactNode
}

export function IconButton({ label, children, className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'focus-ring inline-flex size-10 items-center justify-center rounded-xl text-muted transition hover:bg-zinc-100 hover:text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
