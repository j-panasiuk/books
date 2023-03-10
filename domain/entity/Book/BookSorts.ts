import type { BookItem } from 'domain/entity/Book'
import { ORDER, SortOrder, Sort } from 'utils/query/sort'

type BookSortKey = keyof BookItem

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

export const sortBy = (key: BookSortKey, order?: SortOrder): Sort<BookItem> => {
  return {
    key,
    order:
      order ??
      bookSortOptions.find((sort) => sort.key === key)?.defaultOrder ??
      ORDER.ASC,
  }
}
