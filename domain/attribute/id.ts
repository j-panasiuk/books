import * as s from 'superstruct'
import type { DBEntity } from 'domain/entity'

type Id = DBEntity['id']

export const idStruct = s.coerce(s.nonempty(s.string()), s.unknown(), (val) => {
  if (Array.isArray(val) && typeof val[0] === 'string') return val[0]
  return val
}) satisfies s.Describe<Id>
