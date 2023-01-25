import type { InferGetServerSidePropsType } from 'next'
import type { Book } from '@prisma/client'
import { Button } from '@chakra-ui/react'
import { Layout } from 'components/Layout'
import { prisma } from '.'

export default function IndexPage({
  books,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout actions={<Button size="sm">+ Add book</Button>}>
      {books
        ? books.map((book) => (
            <p key={book.id}>
              {book.author}, <em>{book.title}</em>
            </p>
          ))
        : 'Loading...'}
    </Layout>
  )
}

export async function getServerSideProps() {
  const books = await prisma.book.findMany()

  return {
    props: {
      books: books.map(serializeBook),
    },
  }
}

// Serialize datetime props
// This is not beautiful, but there seems to be no out-of-the-box solution atm
// @see https://github.com/vercel/next.js/issues/11993

type SerializedBook = Omit<Book, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

function serializeBook(book: Book): SerializedBook {
  return {
    ...book,
    createdAt: JSON.stringify(book.createdAt),
    updatedAt: JSON.stringify(book.updatedAt),
  }
}
