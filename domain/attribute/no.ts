import * as s from 'superstruct'

/** Positive integer index */
export const noStruct = s.coerce(
  s.min(s.integer(), 1),
  s.unknown(),
  (val) => val ?? 1
)
