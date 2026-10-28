import type { AppData } from '../storage'
import type { Task, TaskList, UpdateTaskInput } from '../types'

export type TaskStoreAction =
  | { type: 'task/created'; task: Task }
  | { type: 'task/updated'; taskId: string; updates: UpdateTaskInput }
  | { type: 'task/completion-toggled'; taskId: string }
  | { type: 'task/deleted'; taskId: string }
  | { type: 'list/created'; list: TaskList }

export function taskStoreReducer(state: AppData, action: TaskStoreAction): AppData {
  switch (action.type) {
    case 'task/created':
      return { ...state, tasks: [...state.tasks, action.task] }

    case 'task/updated':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId ? { ...task, ...action.updates } : task,
        ),
      }

    case 'task/completion-toggled':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId ? { ...task, completed: !task.completed } : task,
        ),
      }

    case 'task/deleted':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.taskId),
      }

    case 'list/created':
      return { ...state, lists: [...state.lists, action.list] }

    default:
      return state
  }
}
