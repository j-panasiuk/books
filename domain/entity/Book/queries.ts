import { useQuery } from '@tanstack/react-query'
import { fetchBooks } from './api'

export function useBooksQuery() {
  return useQuery(['books'], fetchBooks)
}

export function useBooks() {
  const booksQuery = useBooksQuery()
  return booksQuery.data || []
}
