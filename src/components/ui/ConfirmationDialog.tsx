import { useEffect, useRef } from 'react'
import { Button } from './Button'

type ConfirmationDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-description"
      onCancel={onClose}
      onClose={onClose}
      className="w-[min(28rem,calc(100%-2rem))] rounded-2xl bg-white p-0 shadow-panel backdrop:bg-zinc-950/30"
    >
      <div className="p-6">
        <h2 id="confirmation-title" className="text-lg font-semibold text-ink">
          {title}
        </h2>
        <p id="confirmation-description" className="mt-2 text-sm leading-6 text-muted">
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </dialog>
  )
}
