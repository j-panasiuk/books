import * as s from 'superstruct'

/** Any human-readable name */
export const nameStruct = s.size(s.trimmed(s.string()), 0, 250)
