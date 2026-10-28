import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { getNextListColor, readAppData, writeAppData } from '../storage'
import type { CreateListInput, CreateTaskInput, Task, TaskList, UpdateTaskInput } from '../types'
import { isValidDateKey } from '../utils/date'
import { createId } from '../utils/id'
import { isValidTime } from '../utils/time'
import { taskStoreReducer } from './taskStoreReducer'
import { TaskStoreContext, type TaskStoreValue } from './taskStoreContext'

type TaskStoreProviderProps = {
  children: ReactNode
}

function requireTitle(title: string, entity: 'Task' | 'List'): string {
  const trimmedTitle = title.trim()
  if (!trimmedTitle) throw new Error(`${entity} title is required.`)
  return trimmedTitle
}

function validateListId(listId: string | null | undefined, listIds: Set<string>) {
  if (listId !== undefined && listId !== null && !listIds.has(listId)) {
    throw new Error('The selected list does not exist.')
  }
}

function validateTaskUpdates(
  updates: UpdateTaskInput,
  listIds: Set<string>,
): UpdateTaskInput {
  const validatedUpdates = { ...updates }

  if (updates.title !== undefined) validatedUpdates.title = requireTitle(updates.title, 'Task')
  if (updates.date !== undefined && !isValidDateKey(updates.date)) {
    throw new Error('Task date must use the YYYY-MM-DD format.')
  }
  if (updates.time !== undefined && !isValidTime(updates.time)) {
    throw new Error('Task time must use the HH:mm format.')
  }
  validateListId(updates.listId, listIds)

  return validatedUpdates
}

export function TaskStoreProvider({ children }: TaskStoreProviderProps) {
  const [state, dispatch] = useReducer(taskStoreReducer, undefined, readAppData)

  useEffect(() => {
    writeAppData(state)
  }, [state])

  const listIds = useMemo(() => new Set(state.lists.map((list) => list.id)), [state.lists])

  const createTask = useCallback(
    (input: CreateTaskInput): Task => {
      if (!isValidDateKey(input.date)) {
        throw new Error('Task date must use the YYYY-MM-DD format.')
      }
      if (!isValidTime(input.time ?? '')) {
        throw new Error('Task time must use the HH:mm format.')
      }
      validateListId(input.listId, listIds)

      const task: Task = {
        id: createId('task'),
        title: requireTitle(input.title, 'Task'),
        description: input.description?.trim() ?? '',
        date: input.date,
        time: input.time ?? '',
        listId: input.listId ?? null,
        completed: input.completed ?? false,
        createdAt: new Date().toISOString(),
      }

      dispatch({ type: 'task/created', task })
      return task
    },
    [listIds],
  )

  const updateTask = useCallback(
    (taskId: string, updates: UpdateTaskInput) => {
      dispatch({
        type: 'task/updated',
        taskId,
        updates: validateTaskUpdates(updates, listIds),
      })
    },
    [listIds],
  )

  const toggleTaskCompletion = useCallback((taskId: string) => {
    dispatch({ type: 'task/completion-toggled', taskId })
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    dispatch({ type: 'task/deleted', taskId })
  }, [])

  const createList = useCallback(
    (input: CreateListInput): TaskList => {
      const name = requireTitle(input.name, 'List')
      if (state.lists.some((list) => list.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
        throw new Error('A list with this name already exists.')
      }

      const list: TaskList = {
        id: createId('list'),
        name,
        color: input.color ?? getNextListColor(state.lists),
        createdAt: new Date().toISOString(),
      }

      dispatch({ type: 'list/created', list })
      return list
    },
    [state.lists],
  )

  const storeValue = useMemo<TaskStoreValue>(
    () => ({
      tasks: state.tasks,
      lists: state.lists,
      createTask,
      updateTask,
      toggleTaskCompletion,
      deleteTask,
      createList,
    }),
    [createList, createTask, deleteTask, state.lists, state.tasks, toggleTaskCompletion, updateTask],
  )

  return <TaskStoreContext.Provider value={storeValue}>{children}</TaskStoreContext.Provider>
}
