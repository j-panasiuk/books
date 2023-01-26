import type { InferGetServerSidePropsType } from 'next'
import type { Book } from '@prisma/client'
import { Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { prisma } from 'prisma/client'
import { AppLayout } from 'pages'

export default function BooksPage({
  books,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AppLayout actions={<Button size="sm">+ Add book</Button>}>
      {/* <Filters /> */}
      {/* <Sorting /> */}
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Author</Th>
            <Th>Title</Th>
          </Tr>
        </Thead>
        <Tbody>
          {books.map((book) => (
            <Tr key={book.id}>
              <Td>{book.author}</Td>
              <Td fontStyle="italic">{book.title}</Td>
            </Tr>
          ))}
          {books.length === 0 ? 'No books found' : null}
        </Tbody>
      </Table>
    </AppLayout>
  )
}

export async function getServerSideProps() {
  const books = await prisma.book.findMany({
    orderBy: [{ author: 'asc' }, { title: 'asc' }],
    // take: 100,
  })

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
