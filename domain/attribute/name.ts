import * as s from 'superstruct'

export const nameStruct = s.nonempty(s.trimmed(s.string()))
