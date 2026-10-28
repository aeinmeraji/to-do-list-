export type AppView = 'today' | 'upcoming' | 'calendar' | 'day'

export type NavigationItem = {
  id: AppView
  label: string
  count?: number
}

export type {
  CreateListInput,
  CreateTaskInput,
  Task,
  TaskList,
  UpdateTaskInput,
} from './task'
