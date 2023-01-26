import { useEffect, useState } from 'react'
import type { Book } from '@prisma/client'
import { prisma } from 'prisma/client'

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
