import { useCallback, useEffect, useState } from 'react'
import { scrollToTop } from 'components/Layout'
import { type BookItem } from 'domain/entity/Book'
import { useBooksQuery } from 'domain/entity/Book/queries'
import { BookFilters, matches } from 'domain/entity/Book/BookFilters'
import { hasFilters } from 'utils/query/filters'
import { type Sort, ORDER, by } from 'utils/query/sort'
import { type Pagination, countPages, rangeOf } from 'utils/query/pagination'

const initialFilters: BookFilters = {
  phrase: '',
}

const initialSort: Sort<BookItem> = {
  key: 'updatedAt',
  order: ORDER.DESC,
}

const initialPagination: Pagination = {
  pageSize: 100,
  pageIndex: 0,
}

export function useBooksList() {
  const booksQuery = useBooksQuery()

  const [filters, setFilters] = useState(initialFilters)
  const [sort, setSort] = useState(initialSort)
  const [pagination, setPagination] = useState(initialPagination)

  const resetFilters = useCallback(() => setFilters(initialFilters), [])
  const resetSort = useCallback(() => setSort(initialSort), [])
  const resetPagination = useCallback(
    () => setPagination(initialPagination),
    []
  )

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }, [filters, sort])

  useEffect(() => {
    scrollToTop()
  }, [pagination])

  let books = booksQuery.data
  let itemsTotal = books?.length
  let itemsMatching = itemsTotal

  if (Array.isArray(books)) {
    if (hasFilters(filters)) {
      books = books.filter(matches(filters))
      itemsMatching = books.length
    }

    books = books.sort(by(sort))

    if (books.length > pagination.pageSize) {
      books = books.slice(...rangeOf(pagination))
    }
  }

  const pageCount = countPages(pagination, itemsMatching)

  return {
    booksQuery,
    books,
    filters,
    setFilters,
    resetFilters,
    sort,
    setSort,
    resetSort,
    pagination,
    setPagination,
    resetPagination,
    itemsTotal,
    itemsMatching,
    pageCount,
  }
}
