export function range(count: number, from: number = 0): number[] {
  return Array.from({ length: count }).map((_, i) => i + from)
}
