import { QuickAddTask, TaskList } from '../components/tasks'
import { useAppState } from '../hooks/useAppState'
import { useTaskStore } from '../hooks/useTaskStore'
import { formatDate } from '../utils/date'
import { filterTasksByList, filterTasksBySearch } from '../utils/taskFilters'

export function DayView() {
  const { tasks } = useTaskStore()
  const { clearSearch, openCalendarOn, searchQuery, selectedDate, selectedListId } = useAppState()
  const dayTasks = filterTasksBySearch(filterTasksByList(
    tasks.filter((task) => task.date === selectedDate),
    selectedListId,
  ), searchQuery)

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-6">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">Selected day</p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-ink sm:text-4xl">{formatDate(selectedDate)}</h1>
        </div>
        <button
          type="button"
          onClick={() => openCalendarOn(selectedDate)}
          className="focus-ring rounded-lg px-2 py-1 text-sm font-medium text-muted hover:bg-zinc-50 hover:text-ink"
          aria-label={`Back to calendar on ${formatDate(selectedDate)}`}
        >
          Calendar
        </button>
      </header>

      <QuickAddTask date={selectedDate} />

      <section aria-label={`Tasks for ${formatDate(selectedDate)}`} className="mt-7">
        <TaskList
          tasks={dayTasks}
          emptyTitle={searchQuery ? 'No matching tasks' : 'You have no tasks for today'}
          emptyDescription={searchQuery ? "Try another search or clear it to see this day's tasks." : 'Add a new task above when you are ready.'}
          onClearSearch={searchQuery ? clearSearch : undefined}
        />
      </section>
    </div>
  )
}