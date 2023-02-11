export function partition<T>(
  arr: T[],
  predicate: (val: T) => boolean
): [T[], T[]] {
  let partitioned: [T[], T[]] = [[], []]
  arr.forEach((val) => {
    partitioned[predicate(val) ? 0 : 1].push(val)
  })
  return partitioned
}

export function partitionByOperation<T>(
  existing: T[],
  incoming: T[],
  eq: (exs: T, inc: T) => boolean
) {
  const [toCreate, toUpdate] = partition(
    incoming,
    (inc) => !existing.find((exs) => eq(exs, inc))
  )
  const toDelete = existing.filter(
    (exs) => !incoming.find((inc) => eq(exs, inc))
  )

  return { toDelete, toCreate, toUpdate }
}
