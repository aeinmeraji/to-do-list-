import type { TaskList } from '../types'

export const LIST_COLOR_PALETTE = [
  '#f59e0b',
  '#6366f1',
  '#10b981',
  '#ec4899',
  '#0ea5e9',
  '#8b5cf6',
  '#f97316',
] as const

export function createDefaultLists(createdAt = new Date().toISOString()): TaskList[] {
  return [
    { id: 'list-personal', name: 'Personal', color: LIST_COLOR_PALETTE[0], createdAt },
    { id: 'list-work', name: 'Work', color: LIST_COLOR_PALETTE[1], createdAt },
    { id: 'list-study', name: 'Study', color: LIST_COLOR_PALETTE[2], createdAt },
  ]
}

export function getNextListColor(lists: TaskList[]): string {
  const unusedColor = LIST_COLOR_PALETTE.find(
    (color) => !lists.some((list) => list.color.toLowerCase() === color.toLowerCase()),
  )

  return unusedColor ?? LIST_COLOR_PALETTE[lists.length % LIST_COLOR_PALETTE.length]
}
