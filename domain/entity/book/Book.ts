import type * as DB from '@prisma/client'
import * as s from 'superstruct'
import { EntityStruct, Serialized } from 'domain/entity'

// TODO move BookVolume stuff to separate module

export type Book = Serialized<DB.Book> & {
  volumes: Pick<DB.BookVolume, 'no'>[]
}

// --- SCHEMA ---

export const bookSchema = s.assign(
  EntityStruct,
  s.type({
    author: s.string(),
    title: s.string(),
    suggestedBy: s.nullable(s.string()),
    volumes: s.array(s.object({ no: s.integer() })),
  })
) satisfies s.Describe<Book>

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
