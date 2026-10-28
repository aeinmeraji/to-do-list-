import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const compiler = join(projectRoot, 'node_modules', 'typescript', 'bin', 'tsc')
const outputDirectory = mkdtempSync(join(tmpdir(), 'daymark-data-layer-'))

try {
  execFileSync(process.execPath, [
    compiler,
    'src/utils/date.ts',
    'src/utils/taskFilters.ts',
    'src/storage/appStorage.ts',
    'src/storage/defaults.ts',
    'src/types/index.ts',
    'src/types/task.ts',
    '--target', 'ES2022',
    '--module', 'CommonJS',
    '--moduleResolution', 'Node',
    '--ignoreConfig',
    '--ignoreDeprecations', '6.0',
    '--outDir', outputDirectory,
    '--esModuleInterop',
    '--skipLibCheck',
  ], { cwd: projectRoot, stdio: 'pipe' })

  const date = await import(pathToFileURL(join(outputDirectory, 'utils', 'date.js')))
  const filters = await import(pathToFileURL(join(outputDirectory, 'utils', 'taskFilters.js')))
  const storage = await import(pathToFileURL(join(outputDirectory, 'storage', 'appStorage.js')))

  const assert = (condition, message) => {
    if (!condition) throw new Error(message)
  }

  assert(date.isValidDateKey('2026-09-21'), 'valid date key rejected')
  assert(!date.isValidDateKey('2026-02-30'), 'invalid date key accepted')
  assert(date.compareDateKeys('2026-09-22', '2026-09-21') > 0, 'date comparison failed')

  const tasks = [
    { id: 'today', title: 'Today', description: '', date: '2026-09-21', time: '', listId: null, completed: false, createdAt: '2026-09-21T08:00:00.000Z' },
    { id: 'future', title: 'Future', description: 'Plan ahead', date: '2026-09-22', time: '', listId: null, completed: false, createdAt: '2026-09-21T09:00:00.000Z' },
    { id: 'past', title: 'Past', description: '', date: '2026-09-20', time: '', listId: null, completed: false, createdAt: '2026-09-21T07:00:00.000Z' },
  ]
  assert(filters.getUpcomingTasks(tasks, '2026-09-21').map((task) => task.id).join(',') === 'future', 'upcoming filtering failed')
  assert(filters.filterTasksBySearch(tasks, 'PLAN').length === 1, 'search filtering failed')

  const memoryStorage = new Map()
  const fakeStorage = {
    getItem: (key) => memoryStorage.get(key) ?? null,
    setItem: (key, value) => memoryStorage.set(key, value),
  }
  const initial = storage.createInitialAppData()
  assert(storage.writeAppData(initial, fakeStorage), 'storage write failed')
  assert(storage.readAppData(fakeStorage).lists.length === 3, 'storage persistence failed')
  memoryStorage.set(storage.STORAGE_KEY, '{malformed')
  assert(storage.readAppData(fakeStorage).tasks.length === 0, 'malformed storage fallback failed')

  console.log('data-layer tests passed')
} finally {
  rmSync(outputDirectory, { recursive: true, force: true })
}
