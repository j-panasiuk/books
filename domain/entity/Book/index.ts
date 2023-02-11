import type * as DB from '@prisma/client'
import * as s from 'superstruct'
import { nameStruct } from 'domain/attribute/name'
import { type Serialized, type Base, entityStruct } from 'domain/entity'
import { type BookVolume, bookVolumesStruct } from 'domain/entity/BookVolume'
import { pick } from 'utils/pick'

const author = nameStruct
const title = s.nonempty(nameStruct)
const suggestedBy = nameStruct
const volumes = bookVolumesStruct

/**
 * Book JSON object without any nested fields.
 */
export type Book = Serialized<DB.Book>

export const bookStruct = s.assign(
  entityStruct,
  s.type({
    author,
    title,
    suggestedBy,
  })
) satisfies s.Describe<Book>

/**
 * Book JSON object with full related data
 */
export type BookItem = Book & {
  volumes: BookVolume[]
}

export const bookItemStruct = s.assign(
  bookStruct,
  s.type({
    volumes,
  })
) satisfies s.Describe<BookItem>

export const bookItemInclude: DB.Prisma.BookInclude = {
  volumes: {
    select: {
      no: true,
      title: true,
      copies: {
        select: {
          ownership: true,
          from: true,
          to: true,
        },
      },
      sellers: {
        select: {
          sellerName: true,
          stock: true,
        },
      },
    },
  },
}

// --- CREATE & UPDATE ---

function coerceBookInput(val: unknown): {} {
  if (!val) {
    return {}
  }
  if (s.partial(bookItemStruct).is(val)) {
    return pick(val, ['author', 'title', 'suggestedBy', 'volumes'])
  }
  return val
}

// --- CREATE ---

export type BookCreateInput = s.Infer<typeof bookCreateInputStruct>
export const bookCreateInputStruct = s.coerce(
  s.object({
    author,
    title: nameStruct,
    suggestedBy,
    volumes,
  }),
  s.unknown(),
  coerceBookInput
) satisfies s.Describe<Base<BookItem>>

// --- UPDATE ---

export type BookUpdateInput = s.Infer<typeof bookUpdateInputStruct>
export const bookUpdateInputStruct = s.coerce(
  s.object({
    author,
    title,
    suggestedBy,
    volumes,
  }),
  s.unknown(),
  coerceBookInput
) satisfies s.Describe<Base<BookItem>>

// --- HELPERS ---

export function getShorthand(book: Pick<Book, 'author' | 'title'>): string {
  return [book.author, book.title].filter(Boolean).join(', ')
}

export function getTitleAndSubtitle(book: Pick<Book, 'title'>) {
  const [title, ...subtitles] = book.title.split(/\:\s|\?\s|\!\s|\.\s/)
  const subtitle = subtitles.join(' ')
  return { title, subtitle }
}

export function getSuggestedByPeople(
  book: Pick<Book, 'suggestedBy'>
): string[] {
  return book.suggestedBy?.split(', ') || []
}
