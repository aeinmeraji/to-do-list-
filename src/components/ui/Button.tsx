import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-black disabled:bg-zinc-300',
  secondary: 'border border-line bg-white text-ink hover:bg-zinc-50',
  danger: 'bg-red-50 text-red-700 hover:bg-red-100',
  ghost: 'text-muted hover:bg-zinc-100 hover:text-ink',
}

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'focus-ring inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
