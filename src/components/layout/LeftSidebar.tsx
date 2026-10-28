import { useState, type FormEvent } from 'react'
import { Button, Input } from '../ui'
import { useAppState } from '../../hooks/useAppState'
import { useTaskStore } from '../../hooks/useTaskStore'
import type { AppView } from '../../types'
import { LIST_COLOR_PALETTE, getNextListColor } from '../../storage/defaults'

const navigation = [
  { id: 'today', label: 'Today', icon: 'today' },
  { id: 'upcoming', label: 'Upcoming', icon: 'upcoming' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
]

function NavigationIcon({ name }: { name: string }) {
  if (name === 'calendar') {
    return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3.5" y="4.5" width="13" height="12" rx="2" /><path d="M6.5 3.5v3M13.5 3.5v3M3.5 8h13" strokeLinecap="round" /></svg>
  }

  if (name === 'upcoming') {
    return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 14.5h12M5.5 11.5h9M7 8.5h6M8.5 5.5h3" strokeLinecap="round" /></svg>
  }

  return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10" cy="10" r="6.5" /><path d="m10 6.5.01 3.8 2.5 1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="8.5" cy="8.5" r="4.75" /><path d="m12 12 4 4" strokeLinecap="round" /></svg>
}

export function LeftSidebar() {
  const {
    activeView,
    navigateTo,
    searchQuery,
    selectedListId,
    selectList,
    setSearchQuery,
  } = useAppState()
  const { createList, lists } = useTaskStore()
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [listError, setListError] = useState('')
  const [newListColor, setNewListColor] = useState(getNextListColor(lists))

  const addList = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const list = createList({ name: newListName, color: newListColor })
      setNewListName('')
      setListError('')
      setIsAddingList(false)
      selectList(list.id)
    } catch (error) {
      setListError(error instanceof Error ? error.message : 'Unable to create list.')
    }
  }

  const cancelAddingList = () => {
    setIsAddingList(false)
    setNewListName('')
    setListError('')
    setNewListColor(getNextListColor(lists))
  }

  return (
    <aside className="border-b border-line bg-[#f8f8f9] p-5 lg:border-b-0 lg:border-r lg:p-6">
      <div className="mt-1">
        <div className="relative">
          <SearchIcon />
        <Input
          label="Search tasks"
          hideLabel
          type="search"
          placeholder="Search tasks"
          className="pl-10"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        </div>
      </div>

      <nav aria-label="Task views" className="mt-8">
        <p className="px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Tasks</p>
        <ul className="mt-3 grid grid-cols-3 gap-2 lg:block lg:space-y-1">
          {navigation.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => navigateTo(item.id as AppView)}
                aria-current={(activeView === item.id || (item.id === 'calendar' && activeView === 'day')) ? 'page' : undefined}
                className={`focus-ring flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition ${
                  (activeView === item.id || (item.id === 'calendar' && activeView === 'day')) ? 'bg-white text-ink shadow-sm' : 'text-muted hover:bg-white/70 hover:text-ink'
                }`}
              >
                <NavigationIcon name={item.icon} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="lists-heading" className="mt-8">
        <div className="flex items-center justify-between px-2">
          <p id="lists-heading" className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Lists</p>
          <button
            type="button"
            onClick={() => setIsAddingList((value) => !value)}
            className="focus-ring rounded-md px-1.5 py-1 text-xs font-semibold text-accent hover:bg-indigo-50"
          >
            + Add
          </button>
        </div>

        {isAddingList ? (
          <form className="mt-3 px-2" onSubmit={addList}>
            <Input
              label="New list name"
              hideLabel
              value={newListName}
              placeholder="New list name"
              aria-invalid={Boolean(listError)}
              aria-describedby={listError ? 'new-list-error' : undefined}
              onChange={(event) => {
                setNewListName(event.target.value)
                if (listError) setListError('')
              }}
            />
            <fieldset className="mt-3">
              <legend className="mb-2 text-xs font-semibold text-muted">Choose a color</legend>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="List color">
                {LIST_COLOR_PALETTE.map((color) => (
                  <label key={color} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="new-list-color"
                      value={color}
                      checked={newListColor === color}
                      onChange={() => setNewListColor(color)}
                      className="peer sr-only"
                    />
                    <span className="block size-6 rounded-full border-2 border-transparent shadow-sm transition peer-checked:border-ink peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2" style={{ backgroundColor: color }} />
                    <span className="sr-only">{color}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {listError ? <p id="new-list-error" role="alert" className="mt-2 text-xs font-medium text-red-600">{listError}</p> : null}
            <div className="mt-2 flex gap-2">
              <Button type="submit" className="min-h-9 px-3">Create</Button>
              <Button type="button" variant="ghost" className="min-h-9 px-3" onClick={cancelAddingList}>Cancel</Button>
            </div>
          </form>
        ) : null}

        <ul className="mt-3 space-y-1">
          <li>
            <button
              type="button"
              onClick={() => selectList(null)}
              aria-pressed={selectedListId === null}
              className={`focus-ring flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm transition ${
                selectedListId === null ? 'bg-white font-semibold text-ink shadow-sm' : 'text-muted hover:bg-white hover:text-ink'
              }`}
            >
              <span className="size-2.5 rounded-full bg-zinc-300" aria-hidden="true" />
              All tasks
            </button>
          </li>
          {lists.map((list) => (
            <li key={list.id}>
              <button
                type="button"
                onClick={() => selectList(list.id)}
                aria-pressed={selectedListId === list.id}
                className={`focus-ring flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm transition ${
                  selectedListId === list.id ? 'bg-white font-semibold text-ink shadow-sm' : 'text-muted hover:bg-white hover:text-ink'
                }`}
              >
                <span className="size-2.5 rounded-full" style={{ backgroundColor: list.color }} aria-hidden="true" />
                {list.name}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
