import type { Task } from '../../types'
import { Button, EmptyState } from '../ui'
import { TaskRow } from './TaskRow'

type TaskListProps = {
  tasks: Task[]
  emptyTitle?: string
  emptyDescription?: string
  onClearSearch?: () => void
}

export function TaskList({
  tasks,
  emptyTitle = 'A clear day',
  emptyDescription = 'Your tasks for this date will appear here. Add one above when you are ready.',
  onClearSearch,
}: TaskListProps) {
  const orderedTasks = [...tasks].sort((left, right) => {
    if (left.completed !== right.completed) return left.completed ? 1 : -1
    return left.createdAt.localeCompare(right.createdAt)
  })

  if (orderedTasks.length === 0) {
    return (
      <div>
        <EmptyState
          icon={<span className="grid size-12 place-items-center rounded-2xl border border-line bg-white text-xl">✓</span>}
          title={emptyTitle}
          description={emptyDescription}
        />
        {onClearSearch ? (
          <div className="mt-3 text-center">
            <Button variant="secondary" onClick={onClearSearch}>Clear search</Button>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <ul className="space-y-2" aria-label="Tasks">
      {orderedTasks.map((task) => <TaskRow key={task.id} task={task} />)}
    </ul>
  )
}
