import type { Book } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import type { Matches } from 'utils/matches'

export type BookFilters = Partial<{
  phrase: string
}>

export const matches: Matches<BookFilters, Serialized<Book>> =
  (fs) => (book) => {
    if (fs.phrase && !matchesPhrase(fs.phrase)(book)) return false
    return true
  }

const bookSearchableKeys: (keyof Serialized<Book>)[] = ['title', 'author']

const matchesPhrase: Matches<BookFilters['phrase'], Serialized<Book>> =
  (phrase) => (book) => {
    return bookSearchableKeys.some((key) =>
      book[key]?.toLocaleLowerCase()?.includes(phrase.toLocaleLowerCase())
    )
  }
