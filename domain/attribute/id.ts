import * as s from 'superstruct'

type Id = string

export const idStruct = s.nonempty(s.string()) satisfies s.Describe<Id>

export function toId(value: unknown): Id {
  return idStruct.create(value)
}
