export function isOneOf<T>(options: T[] | readonly T[]) {
  return function is(value: unknown): value is T {
    return options.includes(value as any)
  }
}
