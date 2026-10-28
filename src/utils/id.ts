let fallbackSequence = 0

export function createId(prefix: 'task' | 'list'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }

  fallbackSequence += 1
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).slice(2, 10)

  return `${prefix}-${timestamp}-${fallbackSequence.toString(36)}-${randomPart}`
}
