import * as s from 'superstruct'

/** A counter with a minimum of 1 */
export const positiveCountStruct = s.coerce(
  s.min(s.integer(), 1),
  s.unknown(),
  (val) => {
    if (val === undefined || val === null) return 1
    if (typeof val === 'string') return Number(val)
    return val
  }
)
