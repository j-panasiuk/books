import { includesCaseInsensitive } from 'domain/attribute/name'
import { type Ownership } from 'domain/attribute/ownership'
import type { BookItem } from 'domain/entity/Book'
import type { Matches } from 'utils/matches'
import type { OPTION } from 'utils/forms/options'

export type BookFilters = Partial<{
  phraseField: PhraseField
  phrase: string
  suggestedBy: OPTION.NONE | OPTION.SOME | string
  ownership: Ownership
}>

export const matches: Matches<BookFilters, BookItem> = (fs) => (book) => {
  if (fs.phrase && !matchesPhrase(fs)(book)) return false
  if (fs.suggestedBy && !matchesSuggestedBy(fs.suggestedBy)(book)) return false
  if (fs.ownership && !matchesOwnership(fs.ownership)(book)) return false
  return true
}

// --- PHRASE ---

export type PhraseField = typeof phraseFieldOptions[number]
export const phraseFieldOptions = ['title', 'author'] as const
export const isPhraseField = (val: unknown): val is PhraseField => {
  return phraseFieldOptions.includes(val as any)
}

const matchesPhrase: Matches<
  Pick<BookFilters, 'phrase' | 'phraseField'>,
  BookItem
> =
  ({ phrase, phraseField }) =>
  (book) => {
    const fieldsToCheck: readonly PhraseField[] = isPhraseField(phraseField)
      ? [phraseField]
      : phraseFieldOptions

    return fieldsToCheck.some((key) =>
      includesCaseInsensitive(book[key], phrase || '')
    )
  }

// --- SUGGESTED BY ---

const matchesSuggestedBy: Matches<BookFilters['suggestedBy'], BookItem> =
  (suggestedBy) => (book) => {
    return book.suggestedBy?.includes(suggestedBy) ?? false
  }

// --- OWNERSHIP ---

const matchesOwnership: Matches<BookFilters['ownership'], BookItem> =
  (ownership) => (book) => {
    return book.volumes.some((vol) =>
      vol.copies.some((c) => c.ownership === ownership)
    )
  }
