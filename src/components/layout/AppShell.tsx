import type { ReactNode } from 'react'
import { useAppState } from '../../hooks/useAppState'

type AppShellProps = {
  navigation: ReactNode
  workspace: ReactNode
  details: ReactNode
}

export function AppShell({ navigation, workspace, details }: AppShellProps) {
  const { activeView } = useAppState()
  const isCalendarView = activeView === 'calendar'

  return (
    <div className="min-h-screen bg-canvas p-0 sm:p-4 lg:grid lg:place-items-center lg:p-6">
      <div className={`grid min-h-screen w-full overflow-hidden bg-white shadow-panel sm:min-h-[calc(100vh-2rem)] sm:rounded-3xl lg:max-w-[1500px] ${isCalendarView ? 'lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)]' : 'lg:grid-cols-[250px_minmax(420px,1fr)_320px] xl:grid-cols-[270px_minmax(480px,1fr)_350px]'}`}>
        {navigation}
        {workspace}
        {isCalendarView ? null : details}
      </div>
    </div>
  )
}
