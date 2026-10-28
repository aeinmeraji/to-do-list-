import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useAppState } from '../../hooks/useAppState'
import { useTaskStore } from '../../hooks/useTaskStore'
import type { Task } from '../../types'
import { isValidDateKey } from '../../utils/date'
import { isValidTime } from '../../utils/time'
import {
  Button,
  ConfirmationDialog,
  IconButton,
  Input,
  Select,
  Textarea,
} from '../ui'

type TaskDetailsFormProps = {
  task: Task
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
    </svg>
  )
}

function TaskDetailsForm({ task, isDraft = false }: TaskDetailsFormProps & { isDraft?: boolean }) {
  const { lists, createTask, updateTask, deleteTask } = useTaskStore()
  const { clearSelectedTask, selectTask, setTaskEditorDirty } = useAppState()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [date, setDate] = useState(task.date)
  const [time, setTime] = useState(task.time)
  const [listId, setListId] = useState(task.listId ?? '')
  const [titleError, setTitleError] = useState('')
  const [dateError, setDateError] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => () => setTaskEditorDirty(false), [setTaskEditorDirty])

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Node && !panelRef.current?.contains(target)) {
        clearSelectedTask()
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown)
  }, [clearSelectedTask])

  const markDirty = () => setTaskEditorDirty(true)

  const clearMessages = () => {
    if (formMessage) setFormMessage('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedTitle = title.trim()
    const nextTitleError = normalizedTitle ? '' : 'A task title is required.'
    const nextDateError = isValidDateKey(date) ? '' : 'Choose a valid date.'

    setTitleError(nextTitleError)
    setDateError(nextDateError)
    setFormMessage('')

    if (nextTitleError || nextDateError) return
    if (!isValidTime(time)) {
      setFormMessage('Choose a valid time.')
      return
    }

    try {
      if (isDraft) {
        const createdTask = createTask({ title: normalizedTitle, description, date, time, listId: listId || null })
        setTaskEditorDirty(false)
        selectTask(createdTask.id, createdTask)
        return
      }

      updateTask(task.id, { title: normalizedTitle, description, date, time, listId: listId || null })
      setTitle(normalizedTitle)
      setTaskEditorDirty(false)
      setFormMessage('Changes saved.')
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Unable to save changes.')
    }
  }

  const handleDelete = () => {
    setDeleteDialogOpen(false)
    deleteTask(task.id)
    clearSelectedTask()
  }

  return (
    <aside
      ref={panelRef}
      aria-label={`Details for ${task.title}`}
      className="fixed inset-y-0 right-0 z-30 w-full max-w-md overflow-y-auto bg-[#fbfbfc] p-5 shadow-xl sm:p-8 lg:static lg:z-auto lg:w-auto lg:max-w-none lg:border-l lg:border-line lg:p-6 lg:shadow-none xl:p-8"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Task details</p>
            <h2 className="mt-2 break-words text-xl font-bold tracking-tight text-ink">{task.title}</h2>
          </div>
          <IconButton label="Close task details" onClick={clearSelectedTask} className="shrink-0">
            <CloseIcon />
          </IconButton>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <Input
              label="Title"
              value={title}
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? 'task-title-error' : undefined}
              onChange={(event) => {
                setTitle(event.target.value)
                markDirty()
                if (titleError) setTitleError('')
                clearMessages()
              }}
            />
            {titleError ? <p id="task-title-error" role="alert" className="mt-2 text-xs font-medium text-red-600">{titleError}</p> : null}
          </div>

          <Textarea
            label="Description"
            value={description}
            placeholder="Add a few useful details…"
            onChange={(event) => {
              setDescription(event.target.value)
              markDirty()
              clearMessages()
            }}
          />

          <Select
            label="List"
            value={listId}
            onChange={(event) => {
              setListId(event.target.value)
              markDirty()
              clearMessages()
            }}
          >
            <option value="">No list</option>
            {lists.map((list) => <option key={list.id} value={list.id}>{list.name}</option>)}
          </Select>

          <div>
            <Input
              label="Date"
              type="date"
              value={date}
              aria-invalid={Boolean(dateError)}
              aria-describedby={dateError ? 'task-date-error' : undefined}
              onChange={(event) => {
              setDate(event.target.value)
              markDirty()
                if (dateError) setDateError('')
                clearMessages()
              }}
            />
            {dateError ? <p id="task-date-error" role="alert" className="mt-2 text-xs font-medium text-red-600">{dateError}</p> : null}
          </div>

          <Input
            label="Time"
            type="time"
            value={time}
            onChange={(event) => {
              setTime(event.target.value)
              markDirty()
              clearMessages()
            }}
          />
        </div>

        <p
          role="status"
          aria-live="polite"
          className={`mt-6 min-h-5 text-sm font-medium ${formMessage === 'Changes saved.' ? 'text-emerald-700' : 'text-red-600'}`}
        >
          {formMessage}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button type="button" variant="danger" onClick={() => setDeleteDialogOpen(true)}>
            {isDraft ? 'Delete Preview' : 'Delete task'}
          </Button>
          <Button type="submit">{isDraft ? 'Add Task' : 'Save changes'}</Button>
        </div>
      </form>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete this task?"
        description={`“${task.title}” will be permanently removed from your tasks.`}
        confirmLabel={isDraft ? 'Delete Preview' : 'Delete task'}
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </aside>
  )
}

export function DetailsPanel() {
  const { selectedTask } = useAppState()

  if (!selectedTask) {
    return (
      <aside className="hidden min-h-full border-l border-line bg-[#fbfbfc] p-6 lg:flex lg:items-center lg:justify-center xl:p-8">
        <p className="max-w-[190px] text-center text-sm font-medium leading-6 text-muted opacity-60">
          Choose a task to see the details
        </p>
      </aside>
    )
  }

  return <TaskDetailsForm key={selectedTask.id} task={selectedTask} isDraft={selectedTask.id.startsWith('draft-')} />
}
