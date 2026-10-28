import type { Task } from '../types'
import { compareDateKeys } from './date'

export function filterTasksByList(tasks: Task[], listId: string | null): Task[] {
  if (!listId) return tasks
  return tasks.filter((task) => task.listId === listId)
}

export function filterTasksBySearch(tasks: Task[], query: string): Task[] {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (!normalizedQuery) return tasks

  return tasks.filter((task) =>
    [task.title, task.description].some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
  )
}

export function getUpcomingTasks(tasks: Task[], today: string): Task[] {
  return tasks
    .filter((task) => compareDateKeys(task.date, today) > 0)
    .sort((left, right) => {
      const dateComparison = compareDateKeys(left.date, right.date)
      if (dateComparison !== 0) return dateComparison
      if (left.completed !== right.completed) return left.completed ? 1 : -1
      return left.createdAt.localeCompare(right.createdAt)
    })
}

export function groupTasksByDate(tasks: Task[]): Array<[string, Task[]]> {
  const groups = new Map<string, Task[]>()

  tasks.forEach((task) => {
    const dateTasks = groups.get(task.date) ?? []
    dateTasks.push(task)
    groups.set(task.date, dateTasks)
  })

  return [...groups.entries()]
}
