import type { Book } from '@prisma/client'

export function getSuggestedByPeople(
  book: Pick<Book, 'suggestedBy'>
): string[] {
  return book.suggestedBy?.split(', ') || []
}

export function getShorthand(book: Pick<Book, 'author' | 'title'>): string {
  return [book.author, book.title].filter(Boolean).join(', ')
}
