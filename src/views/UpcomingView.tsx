import { TaskList } from '../components/tasks'
import { EmptyState } from '../components/ui'
import { useAppState } from '../hooks/useAppState'
import { useTaskStore } from '../hooks/useTaskStore'
import { formatDate, todayDateKey } from '../utils/date'
import { filterTasksByList, filterTasksBySearch, getUpcomingTasks, groupTasksByDate } from '../utils/taskFilters'

export function UpcomingView() {
  const { tasks } = useTaskStore()
  const { clearSearch, searchQuery, selectedListId } = useAppState()
  const futureTasks = getUpcomingTasks(
    filterTasksBySearch(filterTasksByList(tasks, selectedListId), searchQuery),
    todayDateKey(),
  )
  const groupedTasks = groupTasksByDate(futureTasks)

  return (
    <div>
      <header className="border-b border-line pb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">Plan ahead</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-ink sm:text-4xl">Upcoming</h1>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-muted">
            {futureTasks.length} {futureTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </header>

      {groupedTasks.length === 0 ? (
        <div className="mt-7">
          <EmptyState
            title={searchQuery ? 'No matching tasks' : 'No upcoming tasks'}
            description={searchQuery ? 'Try another search or clear it to see upcoming tasks.' : 'Tasks scheduled after today will appear here.'}
          />
          {searchQuery ? <div className="mt-3 text-center"><button type="button" onClick={clearSearch} className="focus-ring rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-zinc-50">Clear search</button></div> : null}
        </div>
      ) : (
        <div className="mt-7 space-y-8">
          {groupedTasks.map(([date, dateTasks]) => (
            <section key={date} aria-labelledby={`upcoming-${date}`}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 id={`upcoming-${date}`} className="text-sm font-bold text-ink">
                  {formatDate(date, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h2>
                <span className="text-xs font-medium text-muted">
                  {dateTasks.length} {dateTasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
              <TaskList tasks={dateTasks} />
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
