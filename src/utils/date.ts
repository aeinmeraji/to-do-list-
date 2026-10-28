export const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const pad = (value: number) => value.toString().padStart(2, '0')

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayDateKey(now = new Date()): string {
  return toDateKey(now)
}

export function parseDateKey(dateKey: string): Date | null {
  if (!DATE_KEY_PATTERN.test(dateKey)) return null

  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export function isValidDateKey(dateKey: string): boolean {
  return parseDateKey(dateKey) !== null
}

export function compareDateKeys(left: string, right: string): number {
  if (!isValidDateKey(left) || !isValidDateKey(right)) {
    throw new Error('Dates must use the YYYY-MM-DD format.')
  }

  return left.localeCompare(right)
}

export function isSameDateKey(left: string, right: string): boolean {
  return compareDateKeys(left, right) === 0
}

export function moveMonth(dateKey: string, offset: number): string {
  const date = parseDateKey(dateKey)
  if (!date) throw new Error('Date must use the YYYY-MM-DD format.')

  const movedDate = new Date(date.getFullYear(), date.getMonth() + offset, 1)
  return toDateKey(movedDate)
}

export function shiftDateByMonth(dateKey: string, offset: number): string {
  const date = parseDateKey(dateKey)
  if (!date) throw new Error('Date must use the YYYY-MM-DD format.')

  const targetMonth = new Date(date.getFullYear(), date.getMonth() + offset, 1)
  const lastDayOfTargetMonth = new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth() + 1,
    0,
  ).getDate()
  const targetDay = Math.min(date.getDate(), lastDayOfTargetMonth)

  return toDateKey(
    new Date(targetMonth.getFullYear(), targetMonth.getMonth(), targetDay),
  )
}

export function isDateInSameMonth(left: string, right: string): boolean {
  const leftDate = parseDateKey(left)
  const rightDate = parseDateKey(right)
  if (!leftDate || !rightDate) {
    throw new Error('Dates must use the YYYY-MM-DD format.')
  }

  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth()
  )
}

export function getCalendarMonthDays(dateKey: string, weekStartsOn = 0): string[] {
  const date = parseDateKey(dateKey)
  if (!date) throw new Error('Date must use the YYYY-MM-DD format.')
  if (!Number.isInteger(weekStartsOn) || weekStartsOn < 0 || weekStartsOn > 6) {
    throw new Error('weekStartsOn must be a number from 0 to 6.')
  }

  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const leadingDays = (firstOfMonth.getDay() - weekStartsOn + 7) % 7
  const gridStart = new Date(
    firstOfMonth.getFullYear(),
    firstOfMonth.getMonth(),
    1 - leadingDays,
  )

  return Array.from({ length: 42 }, (_, index) =>
    toDateKey(
      new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + index,
      ),
    ),
  )
}

export function formatDate(
  dateKey: string,
  options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  },
  locale = 'en-US',
): string {
  const date = parseDateKey(dateKey)
  if (!date) throw new Error('Date must use the YYYY-MM-DD format.')

  return new Intl.DateTimeFormat(locale, options).format(date)
}
