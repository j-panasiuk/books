import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Book } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import { BookFilters, matches } from 'domain/entity/book/BookFilters'
import { getSuggestedByPeople } from 'domain/entity/book/Book'
import { hasFilters } from 'utils/query/filters'
import { type Sort, ORDER, by } from 'utils/query/sort'
import { type Pagination, countPages, rangeOf } from 'utils/query/pagination'

async function fetchBooks(): Promise<Serialized<Book>[]> {
  return fetch('/api/books').then((res) => res.json())
}

function useBooksQuery() {
  return useQuery(['books'], fetchBooks)
}

export function useBooks() {
  const booksQuery = useBooksQuery()
  return booksQuery.data || []
}

const initialFilters: BookFilters = {
  phrase: '',
}

const initialSort: Sort<Serialized<Book>> = {
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

export function useBooksSuggestedByPeople() {
  const books = useBooks()

  const people = useMemo(() => {
    let people: string[] = []
    for (const book of books || []) {
      for (const person of getSuggestedByPeople(book)) {
        if (person && !people.includes(person)) people.push(person)
      }
    }
    return people.sort()
  }, [books])

  return people
}
