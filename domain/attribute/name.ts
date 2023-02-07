import * as s from 'superstruct'

/** Any human-readable name */
export const nameStruct = s.nonempty(s.trimmed(s.string()))
