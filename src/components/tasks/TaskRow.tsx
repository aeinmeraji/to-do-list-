import { useAppState } from '../../hooks/useAppState'
import { useTaskStore } from '../../hooks/useTaskStore'
import type { Task } from '../../types'
import { Checkbox } from '../ui'

type TaskRowProps = {
  task: Task
}

export function TaskRow({ task }: TaskRowProps) {
  const { lists, toggleTaskCompletion } = useTaskStore()
  const { selectedTask, selectTask } = useAppState()
  const list = lists.find((candidate) => candidate.id === task.listId)
  const isSelected = selectedTask?.id === task.id

  return (
    <li
      className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
        isSelected
          ? 'border-indigo-200 bg-indigo-50/60'
          : 'border-line bg-white hover:border-zinc-300 hover:shadow-sm'
      }`}
    >
      <Checkbox
        label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        hideLabel
        checked={task.completed}
        onChange={() => toggleTaskCompletion(task.id)}
        className="shrink-0"
      />
      <button
        type="button"
        onClick={() => selectTask(task.id)}
        className="focus-ring flex min-w-0 flex-1 items-center justify-between gap-3 rounded-lg text-left"
        aria-label={`Open details for ${task.title}`}
      >
        <span className="min-w-0">
          <span
            className={`block truncate text-sm font-semibold transition ${
              task.completed ? 'text-zinc-400 line-through' : 'text-ink'
            }`}
          >
            {task.title}
          </span>
          {task.time || list ? (
            <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
              {task.time ? <span>{task.time}</span> : null}
              {task.time && list ? <span aria-hidden="true">·</span> : null}
              {list ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ backgroundColor: list.color }} aria-hidden="true" />
                  {list.name}
                </span>
              ) : null}
            </span>
          ) : null}
        </span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-ink" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m7.5 4.5 5 5.5-5 5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </li>
  )
}
