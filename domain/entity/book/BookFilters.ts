import type { Book } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import type { Matches } from 'utils/matches'

export type BookFilters = Partial<{
  phrase: string
  suggestedBy: string
}>

export const matches: Matches<BookFilters, Serialized<Book>> =
  (fs) => (book) => {
    if (fs.phrase && !matchesPhrase(fs.phrase)(book)) return false
    if (fs.suggestedBy && !matchesSuggestedBy(fs.suggestedBy)(book))
      return false
    return true
  }

// --- PHRASE ---

const matchesPhrase: Matches<BookFilters['phrase'], Serialized<Book>> =
  (phrase) => (book) => {
    return (['title', 'author'] as const).some((key) =>
      book[key]?.toLocaleLowerCase()?.includes(phrase.toLocaleLowerCase())
    )
  }

// --- SUGGESTED BY ---

const matchesSuggestedBy: Matches<
  BookFilters['suggestedBy'],
  Serialized<Book>
> = (suggestedBy) => (book) => {
  return book.suggestedBy?.includes(suggestedBy) ?? false
}
