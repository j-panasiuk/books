import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Book } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import { BookFilters, matches } from 'domain/entity/book/BookFilters'
import { getSuggestedByPeople } from 'domain/entity/book/Book'
import { hasFilters } from 'utils/query/filters'

async function fetchBooks(): Promise<Serialized<Book>[]> {
  return fetch('/api/books').then((res) => res.json())
}

const initialFilters: BookFilters = {
  phrase: '',
}

export function useBooks() {
  const booksQuery = useQuery(['books'], fetchBooks)
  return booksQuery.data || []
}

export function useFilteredBooks() {
  const books = useBooks()

  const [filters, setFilters] = useState<BookFilters>(initialFilters)

  const resetFilters = useCallback(() => setFilters(initialFilters), [])

  let matchingBooks = books
  if (hasFilters(filters)) {
    matchingBooks = matchingBooks.filter(matches(filters))
  }

  return {
    matchingBooks,
    filters,
    setFilters,
    resetFilters,
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
