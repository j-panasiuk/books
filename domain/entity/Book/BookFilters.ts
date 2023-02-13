import { type Ownership } from 'domain/attribute/ownership'
import type { BookItem } from 'domain/entity/Book'
import type { Matches } from 'utils/matches'
import type { OPTION } from 'utils/forms/options'

export type BookFilters = Partial<{
  phrase: string
  suggestedBy: OPTION.NONE | OPTION.SOME | string
  ownership: Ownership
}>

export const matches: Matches<BookFilters, BookItem> = (fs) => (book) => {
  if (fs.phrase && !matchesPhrase(fs.phrase)(book)) return false
  if (fs.suggestedBy && !matchesSuggestedBy(fs.suggestedBy)(book)) return false
  if (fs.ownership && !matchesOwnership(fs.ownership)(book)) return false
  return true
}

// --- PHRASE ---

const matchesPhrase: Matches<BookFilters['phrase'], BookItem> =
  (phrase) => (book) => {
    return (['title', 'author'] as const).some((key) =>
      book[key]?.toLocaleLowerCase()?.includes(phrase.toLocaleLowerCase())
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
