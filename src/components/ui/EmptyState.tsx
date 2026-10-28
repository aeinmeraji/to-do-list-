import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-zinc-50/60 px-6 text-center">
      {icon ? <div className="mb-4 text-zinc-400">{icon}</div> : null}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-6 text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
