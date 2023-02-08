import * as s from 'superstruct'

/** Any human-readable name */
export const nameStruct = s.trimmed(s.string())
