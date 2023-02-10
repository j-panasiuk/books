export function pick<V extends object, T extends V>(
  object: T,
  keys: (keyof T)[]
): V {
  let picked = {} as any
  keys.forEach((key) => (picked[key] = object[key]))
  return picked as V
}
