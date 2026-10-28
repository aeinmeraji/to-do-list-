import { useContext } from 'react'
import { TaskStoreContext } from '../store/taskStoreContext'

export function useTaskStore() {
  const store = useContext(TaskStoreContext)

  if (!store) {
    throw new Error('useTaskStore must be used inside TaskStoreProvider.')
  }

  return store
}
