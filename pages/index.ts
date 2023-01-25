import { useEffect, useState } from 'react'
import { PrismaClient, Book } from '@prisma/client'

export const prisma = new PrismaClient()

export function useBooks() {
  const [books, setBooks] = useState<Book[]>()

  useEffect(() => {
    prisma.book
      .findMany()
      .then((data) => {
        setBooks(data)
      })
      .catch((err) => {
        console.log('Failed to load books', err)
        setBooks([])
      })
  }, [])

  return books
}
