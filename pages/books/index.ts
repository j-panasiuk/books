import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Book } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import { BookFilters, matches } from 'domain/entity/book/BookFilters'
import { getSuggestedByPeople } from 'domain/entity/book/Book'
import { hasFilters } from 'utils/query/filters'
import { type Sort, ORDER, by } from 'utils/query/sort'
import { type Pagination, range } from 'utils/query/pagination'

async function fetchBooks(): Promise<Serialized<Book>[]> {
  return fetch('/api/books').then((res) => res.json())
}

export function useBooks() {
  const booksQuery = useQuery(['books'], fetchBooks)
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

export function useFilteredBooks() {
  const books = useBooks()

  const [filters, setFilters] = useState(initialFilters)
  const [sort, setSort] = useState(initialSort)
  const [pagination, setPagination] = useState(initialPagination)

  const resetFilters = useCallback(() => setFilters(initialFilters), [])
  const resetSort = useCallback(() => setSort(initialSort), [])
  const resetPagination = useCallback(
    () => setPagination(initialPagination),
    []
  )

  let matchingBooks = books
  if (hasFilters(filters)) {
    matchingBooks = matchingBooks.filter(matches(filters))
  }

  matchingBooks = matchingBooks.sort(by(sort))

  if (matchingBooks.length > pagination.pageSize) {
    matchingBooks = matchingBooks.slice(...range(pagination))
  }

  return {
    matchingBooks,
    filters,
    setFilters,
    resetFilters,
    sort,
    setSort,
    resetSort,
    pagination,
    setPagination,
    resetPagination,
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
