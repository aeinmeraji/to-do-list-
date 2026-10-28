import { QuickAddTask, TaskList } from '../components/tasks'
import { useAppState } from '../hooks/useAppState'
import { useTaskStore } from '../hooks/useTaskStore'
import { formatDate, todayDateKey } from '../utils/date'
import { filterTasksByList, filterTasksBySearch } from '../utils/taskFilters'

export function TodayView() {
  const { tasks } = useTaskStore()
  const { clearSearch, openCalendarOn, searchQuery, selectedListId } = useAppState()
  const today = todayDateKey()
  const todayTasks = filterTasksBySearch(filterTasksByList(
    tasks.filter((task) => task.date === today),
    selectedListId,
  ), searchQuery)

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-6">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">Daily focus</p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-ink sm:text-4xl">Today</h1>
        </div>
        <button
          type="button"
          onClick={() => openCalendarOn(today)}
          className="focus-ring rounded-lg px-2 py-1 text-sm font-medium text-muted hover:bg-zinc-50 hover:text-ink"
          aria-label={`Open calendar on ${formatDate(today)}`}
        >
          {formatDate(today)}
        </button>
      </header>

      <QuickAddTask date={today} />

      <section aria-label="Today's tasks" className="mt-7">
        <TaskList
          tasks={todayTasks}
          emptyTitle={searchQuery ? 'No matching tasks' : undefined}
          emptyDescription={searchQuery ? "Try another search or clear it to see today's tasks." : undefined}
          onClearSearch={searchQuery ? clearSearch : undefined}
        />
      </section>
    </div>
  )
}
