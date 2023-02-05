import type * as DB from '@prisma/client'
import * as s from 'superstruct'
import { nameStruct } from 'domain/attribute/name'
import { type Serialized, entityStruct } from 'domain/entity'
import { type BookVolume, bookVolumesStruct } from 'domain/entity/BookVolume'

export type Book = Serialized<DB.Book> & {
  volumes: BookVolume[]
}

export const bookStruct = s.assign(
  entityStruct,
  s.type({
    author: s.string(),
    title: nameStruct,
    suggestedBy: s.nullable(s.string()),
    volumes: bookVolumesStruct,
  })
) satisfies s.Describe<Book>

export const booksStruct = s.array(bookStruct) satisfies s.Describe<Book[]>

// --- HELPERS ---

export function getShorthand(book: Pick<Book, 'author' | 'title'>): string {
  return [book.author, book.title].filter(Boolean).join(', ')
}

export function getSuggestedByPeople(
  book: Pick<Book, 'suggestedBy'>
): string[] {
  return book.suggestedBy?.split(', ') || []
}
