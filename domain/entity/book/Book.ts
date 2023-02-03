import type { Book } from '@prisma/client'
import * as s from 'superstruct'
import { EntityStruct, Serialized } from 'domain/entity'

// --- SCHEMA ---

export const bookSchema = s.assign(
  EntityStruct,
  s.type({
    author: s.string(),
    title: s.string(),
    suggestedBy: s.nullable(s.string()),
  })
) satisfies s.Describe<Serialized<Book>>

export const booksSchema = s.array(bookSchema)

// --- HELPERS ---

export function getShorthand(book: Pick<Book, 'author' | 'title'>): string {
  return [book.author, book.title].filter(Boolean).join(', ')
}

export function getSuggestedByPeople(
  book: Pick<Book, 'suggestedBy'>
): string[] {
  return book.suggestedBy?.split(', ') || []
}
