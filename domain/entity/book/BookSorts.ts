import type { Book } from '@prisma/client'
import { ORDER, SortOrder, Sort } from 'utils/query/sort'
import { Serialized } from '..'

type BookSortKey = keyof Serialized<Book>

type BookSort = {
  key: BookSortKey
  defaultOrder: SortOrder
}

export const bookSortOptions: BookSort[] = [
  { key: 'author', defaultOrder: ORDER.ASC },
  { key: 'title', defaultOrder: ORDER.ASC },
  { key: 'suggestedBy', defaultOrder: ORDER.ASC },
  { key: 'createdAt', defaultOrder: ORDER.DESC },
  { key: 'updatedAt', defaultOrder: ORDER.DESC },
]

export const sortBy = (
  key: BookSortKey,
  order?: SortOrder
): Sort<Serialized<Book>> => {
  return {
    key,
    order:
      order ??
      bookSortOptions.find((sort) => sort.key === key)?.defaultOrder ??
      ORDER.ASC,
  }
}
