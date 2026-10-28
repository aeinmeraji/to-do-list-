import { useEffect, useRef, useState } from 'react'
import { useAppState } from '../../hooks/useAppState'
import { Button, Input } from '../ui'

type QuickAddTaskProps = {
  date: string
}

export function QuickAddTask({ date }: QuickAddTaskProps) {
  const { beginTaskDraft } = useAppState()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const cancel = () => {
    setTitle('')
    setError('')
    setIsEditing(false)
  }

  const submit = () => {
    if (!title.trim()) {
      setError('Enter a task title.')
      return
    }

    beginTaskDraft(title, date)
    cancel()
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="focus-ring mt-7 flex min-h-14 w-full items-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/70 px-5 text-left text-sm font-medium text-zinc-400 transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-ink"
      >
        <span className="mr-3 text-xl font-light" aria-hidden="true">+</span>
        Add a new task
      </button>
    )
  }

  return (
    <form
      className="mt-7 rounded-2xl border border-line bg-zinc-50/70 p-3"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <Input
        ref={inputRef}
        label="New task title"
        hideLabel
        value={title}
        placeholder="What needs to be done?"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'quick-add-error' : undefined}
        onChange={(event) => {
          setTitle(event.target.value)
          if (error) setError('')
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') cancel()
        }}
      />
      <div className="mt-3 flex min-h-8 items-center justify-between gap-3">
        <p id="quick-add-error" role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" className="min-h-9 px-3" onClick={cancel}>
            Cancel
          </Button>
          <Button type="submit" className="min-h-9 px-3">Add task</Button>
        </div>
      </div>
    </form>
  )
}
