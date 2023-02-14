import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchBooks } from './api'
import { getSuggestedByPeople } from '.'

export function useBooksQuery() {
  return useQuery(['books'], fetchBooks)
}

export function useBooks() {
  const booksQuery = useBooksQuery()
  return booksQuery.data || []
}

export function useBooksAuthorPeople() {
  const books = useBooks()

  const people = useMemo(() => {
    let people: string[] = []
    for (const book of books) {
      for (const person of book.author.split(', ')) {
        if (!people.includes(person)) people.push(person)
      }
    }
    return people.sort()
  }, [books])

  return people
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
