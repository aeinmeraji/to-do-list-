import { useAppState } from '../../hooks/useAppState'
import { CalendarView } from '../../views/CalendarView'
import { DayView } from '../../views/DayView'
import { TodayView } from '../../views/TodayView'
import { UpcomingView } from '../../views/UpcomingView'

export function MainWorkspace() {
  const { activeView } = useAppState()

  return (
    <main className="min-w-0 bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-14">
      {activeView === 'today' ? <TodayView /> : null}
      {activeView === 'upcoming' ? <UpcomingView /> : null}
      {activeView === 'calendar' ? <CalendarView /> : null}
      {activeView === 'day' ? <DayView /> : null}
    </main>
  )
}
