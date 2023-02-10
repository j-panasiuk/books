export function omit<V extends object, T extends V>(
  object: T,
  keys: (keyof T)[]
): V {
  let omitted = { ...object }
  keys.forEach((key) => delete omitted[key])
  return omitted as V
}
