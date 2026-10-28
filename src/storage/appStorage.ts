import type { Task, TaskList } from '../types'
import { isValidDateKey } from '../utils/date'
import { isValidTime } from '../utils/time'
import { createDefaultLists } from './defaults'

export const STORAGE_KEY = 'daymark.todo-data'
export const STORAGE_VERSION = 1 as const

export type AppData = {
  tasks: Task[]
  lists: TaskList[]
}

export type PersistedAppData = AppData & {
  version: typeof STORAGE_VERSION
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isIsoTimestamp = (value: unknown): value is string =>
  typeof value === 'string' && Number.isFinite(Date.parse(value))

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.title === 'string' &&
    value.title.trim().length > 0 &&
    typeof value.description === 'string' &&
    typeof value.date === 'string' &&
    isValidDateKey(value.date) &&
    typeof value.time === 'string' &&
    isValidTime(value.time) &&
    (typeof value.listId === 'string' || value.listId === null) &&
    typeof value.completed === 'boolean' &&
    isIsoTimestamp(value.createdAt)
  )
}

function isTaskList(value: unknown): value is TaskList {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    typeof value.color === 'string' &&
    value.color.length > 0 &&
    isIsoTimestamp(value.createdAt)
  )
}

function isPersistedAppData(value: unknown): value is PersistedAppData {
  if (!isRecord(value)) return false

  return (
    value.version === STORAGE_VERSION &&
    Array.isArray(value.tasks) &&
    value.tasks.every(isTask) &&
    Array.isArray(value.lists) &&
    value.lists.every(isTaskList)
  )
}

export function createInitialAppData(): AppData {
  return {
    tasks: [],
    lists: createDefaultLists(),
  }
}

export function getBrowserStorage(): Storage | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readAppData(storage: Storage | null = getBrowserStorage()): AppData {
  if (!storage) return createInitialAppData()

  try {
    const rawData = storage.getItem(STORAGE_KEY)
    if (!rawData) return createInitialAppData()

    const parsedData: unknown = JSON.parse(rawData)
    if (!isPersistedAppData(parsedData)) return createInitialAppData()

    const listIds = new Set(parsedData.lists.map((list) => list.id))

    return {
      tasks: parsedData.tasks.map((task) => ({
        ...task,
        listId: task.listId && listIds.has(task.listId) ? task.listId : null,
      })),
      lists: parsedData.lists,
    }
  } catch {
    return createInitialAppData()
  }
}

export function writeAppData(
  data: AppData,
  storage: Storage | null = getBrowserStorage(),
): boolean {
  if (!storage) return false

  const persistedData: PersistedAppData = {
    version: STORAGE_VERSION,
    tasks: data.tasks,
    lists: data.lists,
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(persistedData))
    return true
  } catch {
    return false
  }
}
