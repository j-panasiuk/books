export function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export function isNonEmpty<T>(value: T): value is NonNullable<T> {
  return !isEmpty(value)
}
