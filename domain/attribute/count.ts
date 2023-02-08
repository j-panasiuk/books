import * as s from 'superstruct'

/** A counter with a minimum of 1 */
export const positiveCountStruct = s.coerce(
  s.min(s.integer(), 1),
  s.unknown(),
  (val) => val ?? 1
)
