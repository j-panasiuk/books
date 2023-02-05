import * as s from 'superstruct'
import type { DBEntity } from 'domain/entity'

type Id = DBEntity['id']

export const idStruct = s.nonempty(s.string()) satisfies s.Describe<Id>

export function toId(value: unknown): Id {
  return idStruct.create(value)
}
