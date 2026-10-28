import { createContext } from 'react'
import type { CreateListInput, CreateTaskInput, Task, TaskList, UpdateTaskInput } from '../types'

export type TaskStoreValue = {
  tasks: Task[]
  lists: TaskList[]
  createTask: (input: CreateTaskInput) => Task
  updateTask: (taskId: string, updates: UpdateTaskInput) => void
  toggleTaskCompletion: (taskId: string) => void
  deleteTask: (taskId: string) => void
  createList: (input: CreateListInput) => TaskList
}

export const TaskStoreContext = createContext<TaskStoreValue | null>(null)
