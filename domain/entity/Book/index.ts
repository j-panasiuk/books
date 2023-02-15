import type * as DB from '@prisma/client'
import * as s from 'superstruct'
import {
  nameStruct,
  validNameStruct,
  isSameCaseInsensitive,
  splitNames,
} from 'domain/attribute/name'
import { type Serialized, type Base, entityStruct } from 'domain/entity'
import { type BookVolume, bookVolumesStruct } from 'domain/entity/BookVolume'
import { type Matches } from 'utils/matches'
import { pick } from 'utils/pick'

const author = nameStruct
const title = nameStruct
const suggestedBy = nameStruct
const volumes = bookVolumesStruct

/**
 * Book JSON object without any nested fields.
 */
export type Book = s.Infer<typeof bookStruct>
export const bookStruct = s.assign(
  entityStruct,
  s.type({
    author,
    title,
    suggestedBy,
  })
) satisfies s.Describe<Serialized<DB.Book>>

/**
 * Book JSON object with full related data
 */
export type BookItem = s.Infer<typeof bookItemStruct>
export const bookItemStruct = s.assign(
  bookStruct,
  s.type({
    volumes,
  })
) satisfies s.Describe<Serialized<DB.Book> & { volumes: BookVolume[] }>

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
    title,
    suggestedBy,
    volumes,
  }),
  s.unknown(),
  coerceBookInput
) satisfies s.Describe<Base<BookItem>>
export const bookCreateInputValidStruct = s.assign(
  bookCreateInputStruct,
  s.object({
    title: validNameStruct,
  })
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
export const bookUpdateInputValidStruct = s.assign(
  bookUpdateInputStruct,
  s.object({
    title: validNameStruct,
  })
) satisfies s.Describe<Base<BookItem>>

// --- HELPERS ---

export function getShorthand(book: Pick<Book, 'author' | 'title'>): string {
  return [book.author, book.title].filter(Boolean).join(', ')
}

const TITLE_SUBTITLE_SEPARATORS = /\:\s|\?\s|\!\s|\.\s/

export function getTitleAndSubtitle(book: Pick<Book, 'title'>) {
  const [title, ...subtitles] = book.title.split(TITLE_SUBTITLE_SEPARATORS)
  const subtitle = subtitles.join(' ')
  return { title, subtitle }
}

export function getSuggestedByPeople(
  book: Pick<Book, 'suggestedBy'>
): string[] {
  return splitNames(book.suggestedBy)
}

export const matchByAuthor: Matches<string, Book> = (person) => (book) => {
  return splitNames(book.author).some((coauthor) =>
    isSameCaseInsensitive(coauthor, person)
  )
}
