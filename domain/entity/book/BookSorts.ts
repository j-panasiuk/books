import type { Book } from 'domain/entity/book/Book'
import { ORDER, SortOrder, Sort } from 'utils/query/sort'

type BookSortKey = keyof Book

type BookSort = {
  key: BookSortKey
  defaultOrder: SortOrder
}

export const bookSortOptions: BookSort[] = [
  { key: 'author', defaultOrder: ORDER.ASC },
  { key: 'title', defaultOrder: ORDER.ASC },
  { key: 'suggestedBy', defaultOrder: ORDER.ASC },
  { key: 'volumes', defaultOrder: ORDER.DESC },
  { key: 'createdAt', defaultOrder: ORDER.DESC },
  { key: 'updatedAt', defaultOrder: ORDER.DESC },
]

export const sortBy = (key: BookSortKey, order?: SortOrder): Sort<Book> => {
  return {
    key,
    order:
      order ??
      bookSortOptions.find((sort) => sort.key === key)?.defaultOrder ??
      ORDER.ASC,
  }
}
