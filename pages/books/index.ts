import { useCallback, useState } from 'react'
import type { Book } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import { BookFilters, matches } from 'domain/entity/book/BookFilters'
import { hasFilters } from 'utils/query/filters'

const initialFilters: BookFilters = {
  phrase: '',
}

export function useBooks(books: Serialized<Book>[]) {
  const [filters, setFilters] = useState<BookFilters>(initialFilters)

  const resetFilters = useCallback(() => setFilters(initialFilters), [])

  const matchingBooks = hasFilters(filters)
    ? books.filter(matches(filters))
    : books

  return {
    matchingBooks,
    filters,
    setFilters,
    resetFilters,
  }
}
