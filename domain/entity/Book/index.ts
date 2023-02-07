import type * as DB from '@prisma/client'
import * as s from 'superstruct'
import { nameStruct } from 'domain/attribute/name'
import { type Serialized, entityStruct } from 'domain/entity'
import { type BookVolume, bookVolumeStruct } from 'domain/entity/BookVolume'

export type Book = Serialized<DB.Book> & {
  volumes: BookVolume[]
}

const author = s.string()
const title = nameStruct
const suggestedBy = s.string()

export const bookStruct = s.assign(
  entityStruct,
  s.type({
    author,
    title,
    suggestedBy: s.nullable(suggestedBy),
    volumes: s.array(bookVolumeStruct),
  })
) satisfies s.Describe<Book>

// --- CREATE ---

export const bookCreateInputStruct = s.coerce(
  s.object({
    author,
    title,
    suggestedBy: s.optional(s.nullable(suggestedBy)),
    volumes: s.coerce(
      s.optional(
        s.object({
          // Using `any` type for simplicity
          // Exactly typed nested definition doesn't want to compile
          // Looks like Prisma vs Superstruct typings mismatch
          create: s.any(),
        })
      ),
      s.unknown(),
      function coerceToBookCreateInputVolumes(val) {
        if (s.array(s.partial(bookVolumeStruct)).is(val)) {
          return {
            create: val.map((v, i) => ({
              no: v.no ?? i + 1,
              title: v.title,
              sellers: {
                create: v.sellers || [],
              },
            })),
          }
        }
        console.log('bookCreateInputStruct: coerce unexpected "volumes"', val)
        return {
          create: [{ no: 1, sellers: { create: [] } }],
        }
      }
    ),
  }),
  s.unknown(),
  function coerceToBookCreateInput(val) {
    if (s.partial(bookStruct).is(val)) {
      return {
        author: val.author,
        title: val.title,
        suggestedBy: val.suggestedBy,
        volumes: val.volumes,
      }
    }
    return val
  }
) satisfies s.Describe<DB.Prisma.BookCreateInput>

// --- UPDATE ---

export const bookUpdateInputStruct = s.coerce(
  s.object({
    author: s.optional(author),
    title: s.optional(title),
    suggestedBy: s.optional(s.nullable(suggestedBy)),
    volumes: s.coerce(
      s.optional(
        s.object({
          // Using `any` type for simplicity
          // Exactly typed nested definition doesn't want to compile
          // Looks like Prisma vs Superstruct typings mismatch
          upsert: s.any(),
        })
      ),
      s.unknown(),
      function coerceToBookInputUpdateVolumes(val) {
        if (s.array(s.partial(bookVolumeStruct)).is(val)) {
          return {
            upsert: val.map((v, i) => ({
              no: v.no ?? i + 1,
              title: v.title,
              sellers: {
                upsert: v.sellers || [],
              },
            })),
          }
        }
        console.log('bookUpdateInputStruct: coerce unexpected "volumes"', val)
        return val
      }
    ),
  }),
  s.unknown(),
  function coerceToBookUpdateInput(val) {
    if (s.partial(bookStruct).is(val)) {
      return {
        author: val.author,
        title: val.title,
        suggestedBy: val.suggestedBy,
        volumes: val.volumes,
      }
    }
    return val
  }
) satisfies s.Describe<SimplifiedUpdate<DB.Prisma.BookUpdateInput>>

type SimplifiedUpdate<T> = {
  [Property in keyof T]: Exclude<
    T[Property],
    | DB.Prisma.StringFieldUpdateOperationsInput
    | DB.Prisma.NullableStringFieldUpdateOperationsInput
  >
}

// --- HELPERS ---

export function getShorthand(book: Pick<Book, 'author' | 'title'>): string {
  return [book.author, book.title].filter(Boolean).join(', ')
}

export function getSuggestedByPeople(
  book: Pick<Book, 'suggestedBy'>
): string[] {
  return book.suggestedBy?.split(', ') || []
}
