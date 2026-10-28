import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useTaskStore } from '../hooks/useTaskStore'
import type { AppView, Task } from '../types'
import { compareDateKeys, isValidDateKey, todayDateKey } from '../utils/date'
import { AppStateContext, type AppStateValue } from './appStateContext'

type AppStateProviderProps = {
  children: ReactNode
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const { tasks } = useTaskStore()
  const today = todayDateKey()
  const [activeView, setActiveView] = useState<AppView>('today')
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [draftTask, setDraftTask] = useState<Task | null>(null)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isTaskEditorDirty, setTaskEditorDirty] = useState(false)

  const confirmDiscardChanges = useCallback(() => {
    if (!isTaskEditorDirty || draftTask) return true
    return window.confirm('Discard unsaved task changes?')
  }, [draftTask, isTaskEditorDirty])

  const selectedTask = useMemo(() => {
    const task = draftTask ?? tasks.find((candidate) => candidate.id === selectedTaskId)
    if (!task) return null

    if (draftTask) return draftTask

    if (activeView === 'today' && task.date !== today) return null
    if ((activeView === 'calendar' || activeView === 'day') && task.date !== selectedDate) return null
    if (activeView === 'upcoming' && compareDateKeys(task.date, today) <= 0) return null

    return task
  }, [activeView, draftTask, selectedDate, selectedTaskId, tasks, today])

  const navigateTo = useCallback(
    (view: AppView) => {
      if (!confirmDiscardChanges()) return
      setActiveView(view)
      setSelectedTaskId(null)
      setDraftTask(null)
      setTaskEditorDirty(false)
      if (view === 'today') setSelectedDate(today)
    },
    [confirmDiscardChanges, today],
  )

  const selectDate = useCallback((date: string) => {
    if (!isValidDateKey(date)) return
    if (!confirmDiscardChanges()) return
    setSelectedDate(date)
    setSelectedTaskId(null)
    setDraftTask(null)
    setTaskEditorDirty(false)
  }, [confirmDiscardChanges])

  const openCalendarOn = useCallback((date: string) => {
    if (!isValidDateKey(date)) return
    if (!confirmDiscardChanges()) return
    setSelectedDate(date)
    setSelectedTaskId(null)
    setDraftTask(null)
    setTaskEditorDirty(false)
    setActiveView('calendar')
  }, [confirmDiscardChanges])

  const openDayOn = useCallback((date: string) => {
    if (!isValidDateKey(date)) return
    if (!confirmDiscardChanges()) return
    setSelectedDate(date)
    setSelectedTaskId(null)
    setDraftTask(null)
    setTaskEditorDirty(false)
    setActiveView('day')
  }, [confirmDiscardChanges])

  const selectTask = useCallback(
    (taskId: string, taskOverride?: Task) => {
      const task = taskOverride ?? tasks.find((candidate) => candidate.id === taskId)
      if (!task) return
      if (taskId !== selectedTaskId && !confirmDiscardChanges()) return

      setDraftTask(null)
      setSelectedTaskId(taskId)
      setSelectedDate(task.date)
      setTaskEditorDirty(false)
    },
    [confirmDiscardChanges, selectedTaskId, tasks],
  )

  const beginTaskDraft = useCallback((title: string, date: string) => {
    if (!isValidDateKey(date)) return
    setDraftTask({
      id: `draft-${Date.now()}`,
      title: title.trim(),
      description: '',
      date,
      time: '',
      listId: null,
      completed: false,
      createdAt: new Date().toISOString(),
    })
    setSelectedTaskId(null)
    setSelectedDate(date)
    setTaskEditorDirty(false)
  }, [])

  const clearSelectedTask = useCallback(() => {
    if (!confirmDiscardChanges()) return
    setSelectedTaskId(null)
    setDraftTask(null)
    setTaskEditorDirty(false)
  }, [confirmDiscardChanges])

  const selectList = useCallback((listId: string | null) => {
    if (!confirmDiscardChanges()) return
    setSelectedListId(listId)
    setSelectedTaskId(null)
    setDraftTask(null)
    setTaskEditorDirty(false)
  }, [confirmDiscardChanges])

  const updateSearchQuery = useCallback((query: string) => {
    if (!confirmDiscardChanges()) return
    setSearchQuery(query)
    setSelectedTaskId(null)
    setDraftTask(null)
    setTaskEditorDirty(false)
  }, [confirmDiscardChanges])

  const clearSearch = useCallback(() => updateSearchQuery(''), [updateSearchQuery])

  const value = useMemo<AppStateValue>(
    () => ({
      activeView,
      selectedDate,
      selectedTask,
      selectedListId,
      searchQuery,
      navigateTo,
      openCalendarOn,
      openDayOn,
      selectDate,
      selectTask,
      beginTaskDraft,
      clearSelectedTask,
      selectList,
      setSearchQuery: updateSearchQuery,
      clearSearch,
      setTaskEditorDirty,
    }),
    [
      activeView,
      clearSelectedTask,
      navigateTo,
      openCalendarOn,
      openDayOn,
      selectDate,
      selectTask,
      beginTaskDraft,
      selectedDate,
      selectedListId,
      selectedTask,
      selectList,
      searchQuery,
      clearSearch,
      updateSearchQuery,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
