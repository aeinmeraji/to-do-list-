import { createContext } from 'react'
import type { AppView, Task } from '../types'

export type AppStateValue = {
  activeView: AppView
  selectedDate: string
  selectedTask: Task | null
  selectedListId: string | null
  searchQuery: string
  navigateTo: (view: AppView) => void
  openCalendarOn: (date: string) => void
  openDayOn: (date: string) => void
  selectDate: (date: string) => void
  selectTask: (taskId: string, taskOverride?: Task) => void
  beginTaskDraft: (title: string, date: string) => void
  clearSelectedTask: () => void
  selectList: (listId: string | null) => void
  setSearchQuery: (query: string) => void
  clearSearch: () => void
  setTaskEditorDirty: (isDirty: boolean) => void
}

export const AppStateContext = createContext<AppStateValue | null>(null)
