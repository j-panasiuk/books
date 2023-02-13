import * as s from 'superstruct'

/** Any human-readable name */
export const nameStruct = s.defaulted(
  s.size(s.trimmed(s.string()), 0, 250),
  ''
) satisfies s.Describe<string>

export function shortenName(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n.charAt(0))
    .join('')
}

export function shortenNames(names: string): string {
  return names.split(', ').map(shortenName).join(', ')
}
