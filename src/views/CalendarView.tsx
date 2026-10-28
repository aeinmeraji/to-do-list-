import { useMemo, useState } from 'react'
import { Button, IconButton } from '../components/ui'
import { useAppState } from '../hooks/useAppState'
import { useTaskStore } from '../hooks/useTaskStore'
import {
  formatDate,
  getCalendarMonthDays,
  isDateInSameMonth,
  parseDateKey,
  shiftDateByMonth,
  toDateKey,
  todayDateKey,
} from '../utils/date'
import { filterTasksByList, filterTasksBySearch } from '../utils/taskFilters'

const WEEKDAYS = [
  { short: 'Sun', full: 'Sunday' },
  { short: 'Mon', full: 'Monday' },
  { short: 'Tue', full: 'Tuesday' },
  { short: 'Wed', full: 'Wednesday' },
  { short: 'Thu', full: 'Thursday' },
  { short: 'Fri', full: 'Friday' },
  { short: 'Sat', full: 'Saturday' },
]

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d={direction === 'left' ? 'm12.5 4.5-5 5.5 5 5.5' : 'm7.5 4.5 5 5.5-5 5.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3.5" y="4.5" width="13" height="12" rx="2" /><path d="M6.5 3.5v3M13.5 3.5v3M3.5 8h13" strokeLinecap="round" /></svg>
}

function TodayIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10" cy="10" r="6.5" /><circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none" /><path d="M10 3.5v2M10 14.5v2M3.5 10h2M14.5 10h2" strokeLinecap="round" /></svg>
}

const MONTHS = Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2020, month, 1)))

export function CalendarView() {
  const { lists, tasks } = useTaskStore()
  const { searchQuery, selectedDate, selectedListId, openDayOn, selectDate } = useAppState()
  const today = todayDateKey()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerStep, setPickerStep] = useState<'years' | 'months'>('years')
  const [pickerYear, setPickerYear] = useState(Number(selectedDate.slice(0, 4)))
  const [yearInput, setYearInput] = useState('')
  const visibleTasks = filterTasksBySearch(filterTasksByList(tasks, selectedListId), searchQuery)
  const calendarDays = useMemo(() => getCalendarMonthDays(selectedDate), [selectedDate])
  const tasksByDate = useMemo(() => {
    const grouped = new Map<string, typeof visibleTasks>()
    visibleTasks.forEach((task) => {
      const dateTasks = grouped.get(task.date) ?? []
      dateTasks.push(task)
      grouped.set(task.date, dateTasks)
    })
    return grouped
  }, [visibleTasks])

  const changeMonth = (offset: number) => {
    selectDate(shiftDateByMonth(selectedDate, offset))
  }

  const openPicker = () => {
    setPickerYear(Number(selectedDate.slice(0, 4)))
    setYearInput('')
    setPickerStep('years')
    setPickerOpen(true)
  }

  const chooseYear = (year: number) => {
    setPickerYear(year)
    setPickerStep('months')
  }

  const chooseMonth = (month: number) => {
    const selected = parseDateKey(selectedDate)
    if (!selected) return
    const lastDay = new Date(pickerYear, month + 1, 0).getDate()
    const day = Math.min(selected.getDate(), lastDay)
    selectDate(toDateKey(new Date(pickerYear, month, day)))
    setPickerOpen(false)
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">Choose a date</p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-ink sm:text-4xl">Calendar</h1>
        </div>
        <p className="text-sm font-semibold text-muted">{formatDate(selectedDate)}</p>
      </header>

      <section aria-label="Monthly calendar" className="mt-7 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight text-ink">
            {formatDate(selectedDate, { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-1">
            <IconButton label="Go to today" onClick={() => { selectDate(today); setPickerOpen(false) }}>
              <TodayIcon />
            </IconButton>
            <IconButton label="Choose year and month" onClick={openPicker}>
              <CalendarIcon />
            </IconButton>
            <IconButton label="Previous month" onClick={() => changeMonth(-1)}>
              <ChevronIcon direction="left" />
            </IconButton>
            <IconButton label="Next month" onClick={() => changeMonth(1)}>
              <ChevronIcon direction="right" />
            </IconButton>
          </div>
        </div>

        {pickerOpen ? (
          <div className="mt-5 min-h-[280px] animate-in opacity-100 transition-opacity duration-200" aria-label={pickerStep === 'years' ? 'Choose a year' : 'Choose a month'}>
            {pickerStep === 'years' ? (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">Choose a year</p>
                  <form
                    className="flex items-center gap-2"
                    onSubmit={(event) => {
                      event.preventDefault()
                      const year = Number(yearInput)
                      if (Number.isInteger(year) && year >= 1 && year <= 9999) chooseYear(year)
                    }}
                  >
                    <input
                      aria-label="Type a year"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={yearInput}
                      onChange={(event) => setYearInput(event.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                      placeholder="Type year"
                      className="focus-ring h-9 w-24 rounded-lg border border-zinc-200 bg-white px-2 text-xs text-ink placeholder:text-zinc-400"
                    />
                    <Button type="submit" variant="secondary" className="min-h-9 px-3 text-xs">Go</Button>
                  </form>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 9 }, (_, index) => pickerYear + index).map((year) => (
                    <button key={year} type="button" onClick={() => chooseYear(year)} className="focus-ring rounded-xl border border-zinc-200 px-3 py-4 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 hover:text-ink">
                      {year}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <button type="button" onClick={() => setPickerStep('years')} className="focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-muted hover:bg-zinc-100 hover:text-ink">â† Years</button>
                  <p className="text-sm font-semibold text-ink">{pickerYear}</p>
                  <span className="w-12" aria-hidden="true" />
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {MONTHS.map((month, index) => (
                    <button key={month} type="button" onClick={() => chooseMonth(index)} className="focus-ring rounded-xl border border-zinc-200 px-3 py-5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 hover:text-ink">
                      {month}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null}

        {!pickerOpen ? <div className="mt-5 grid grid-cols-7 gap-1" role="row" aria-label="Weekdays">
          {WEEKDAYS.map((weekday) => (
            <abbr
              key={weekday.full}
              title={weekday.full}
              className="py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 no-underline sm:text-[11px]"
            >
              {weekday.short}
            </abbr>
          ))}
        </div> : null}

        {!pickerOpen ? <div className="grid grid-cols-7 overflow-hidden rounded-xl border-l border-t border-zinc-200" role="grid" aria-label={formatDate(selectedDate, { month: 'long', year: 'numeric' })}>
          {calendarDays.map((dateKey) => {
            const isSelected = dateKey === selectedDate
            const isToday = dateKey === today
            const isInMonth = isDateInSameMonth(dateKey, selectedDate)
            const dateTasks = tasksByDate.get(dateKey) ?? []
            const taskCount = dateTasks.length
            const dayNumber = Number(dateKey.slice(-2))
            const taskLabel = taskCount === 1 ? '1 task' : `${taskCount} tasks`
            const accessibilityLabel = [
              formatDate(dateKey, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
              taskCount > 0 ? taskLabel : 'no tasks',
              isToday ? 'today' : '',
              isSelected ? 'selected' : '',
            ].filter(Boolean).join(', ')

            return (
              <button
                key={dateKey}
                type="button"
                role="gridcell"
                aria-label={accessibilityLabel}
                aria-pressed={isSelected}
                aria-current={isToday ? 'date' : undefined}
                onClick={() => openDayOn(dateKey)}
                className={`group focus-ring relative flex aspect-[2/1] min-w-0 flex-col items-start justify-start gap-1 overflow-hidden border-r border-b border-zinc-200 px-2.5 py-2.5 text-left text-sm transition sm:px-3.5 sm:py-3 ${
                  isSelected
                    ? 'bg-zinc-50 text-ink'
                    : isInMonth
                      ? 'text-ink hover:bg-zinc-50/70'
                      : 'bg-zinc-50/30 text-zinc-400 hover:bg-zinc-50/60'
                } ${isToday ? 'ring-2 ring-inset ring-zinc-400' : ''}`}
              >
                <span className={`font-semibold leading-none ${isToday ? 'text-ink' : 'text-zinc-500/60'}`}>{dayNumber}</span>
                <span className="min-h-0 max-h-10 min-w-0 w-full space-y-1 overflow-hidden overscroll-contain group-hover:overflow-y-auto">
                  {dateTasks.map((task) => {
                    const list = lists.find((candidate) => candidate.id === task.listId)
                    return (
                      <span key={task.id} className="flex min-w-0 items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-100/80 px-1.5 py-0.5 text-[9px] font-medium leading-4 text-zinc-600 sm:text-[11px]">
                        <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: list?.color ?? '#a1a1aa' }} aria-hidden="true" />
                        <span className="truncate">{task.title}</span>
                      </span>
                    )
                  })}
                </span>
              </button>
            )
          })}
        </div> : null}
      </section>

    </div>
  )
}

