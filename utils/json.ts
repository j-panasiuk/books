export function stringify(json: unknown): string {
  return JSON.stringify(json, null, 2)
}
