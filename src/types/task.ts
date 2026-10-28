export type Task = {
  id: string
  title: string
  description: string
  date: string
  time: string
  listId: string | null
  completed: boolean
  createdAt: string
}

export type TaskList = {
  id: string
  name: string
  color: string
  createdAt: string
}

export type CreateTaskInput = Pick<Task, 'title' | 'date'> &
  Partial<Pick<Task, 'description' | 'time' | 'listId' | 'completed'>>

export type UpdateTaskInput = Partial<
  Pick<Task, 'title' | 'description' | 'date' | 'time' | 'listId' | 'completed'>
>

export type CreateListInput = Pick<TaskList, 'name'> & Partial<Pick<TaskList, 'color'>>
