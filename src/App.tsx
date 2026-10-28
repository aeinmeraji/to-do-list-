import { AppShell, DetailsPanel, LeftSidebar, MainWorkspace } from './components/layout'
import { AppStateProvider } from './store/AppStateProvider'
import { TaskStoreProvider } from './store/TaskStoreProvider'

export default function App() {
  return (
    <TaskStoreProvider>
      <AppStateProvider>
        <AppShell
          navigation={<LeftSidebar />}
          workspace={<MainWorkspace />}
          details={<DetailsPanel />}
        />
      </AppStateProvider>
    </TaskStoreProvider>
  )
}
