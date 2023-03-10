import * as s from 'superstruct'
import { T } from 'utils/translate'

/** Any human-readable name */
export const nameStruct = s.defaulted(
  s.size(s.string(), 0, 250),
  ''
) satisfies s.Describe<string>

export const validNameStruct = s.refine(nameStruct, 'validName', (name) => {
  if (name.length === 0) return T('valid name cannot be empty')
  if (name.trim().length === 0) return T('valid name cannot be blank')
  return true
}) satisfies s.Describe<string>

const WHITESPACE = /\s+/
const NAMES_SEPARATOR_SPLIT = /\s*,\s*/
const NAMES_SEPARATOR_JOIN = ', '

/**
 * Split comma-separated names into an array
 * @example splitNames("Janek, Franek") == ["Janek", "Franek"]
 */
export function splitNames(names: string): string[] {
  return names.split(NAMES_SEPARATOR_SPLIT)
}

export function shortenName(name: string): string {
  return name
    .split(WHITESPACE)
    .map((n) => n.charAt(0))
    .join('')
}

export function shortenNames(names: string): string {
  return names
    .split(NAMES_SEPARATOR_SPLIT)
    .map(shortenName)
    .join(NAMES_SEPARATOR_JOIN)
}

export function isSameCaseInsensitive(fst: string, snd: string): boolean {
  return fst.trim().toLocaleLowerCase() === snd.trim().toLocaleLowerCase()
}

export function includesCaseInsensitive(whole: string, part: string): boolean {
  return whole.toLocaleLowerCase().includes(part.toLocaleLowerCase())
}
