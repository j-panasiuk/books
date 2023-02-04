import type { Book } from 'domain/entity/book/Book'
import type { Matches } from 'utils/matches'

export type BookFilters = Partial<{
  phrase: string
  suggestedBy: string
}>

export const matches: Matches<BookFilters, Book> = (fs) => (book) => {
  if (fs.phrase && !matchesPhrase(fs.phrase)(book)) return false
  if (fs.suggestedBy && !matchesSuggestedBy(fs.suggestedBy)(book)) return false
  return true
}

// --- PHRASE ---

const matchesPhrase: Matches<BookFilters['phrase'], Book> =
  (phrase) => (book) => {
    return (['title', 'author'] as const).some((key) =>
      book[key]?.toLocaleLowerCase()?.includes(phrase.toLocaleLowerCase())
    )
  }

// --- SUGGESTED BY ---

const matchesSuggestedBy: Matches<BookFilters['suggestedBy'], Book> =
  (suggestedBy) => (book) => {
    return book.suggestedBy?.includes(suggestedBy) ?? false
  }
