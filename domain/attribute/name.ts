import * as s from 'superstruct'

/** Any human-readable name */
export const nameStruct = s.defaulted(
  s.size(s.trimmed(s.string()), 0, 250),
  ''
) satisfies s.Describe<string>
