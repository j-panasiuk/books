export type Compare<T> = (a: T, b: T) => -1 | 0 | 1

export function compare(a: unknown, b: unknown): -1 | 0 | 1 {
  if (Array.isArray(a) && Array.isArray(b)) return compare(a.length, b.length)
  if (a === b) return 0
  if (b === undefined) return 1
  if (a === undefined) return -1
  return (a as any) > (b as any) ? 1 : -1
}
