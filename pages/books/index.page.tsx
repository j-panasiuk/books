import type { InferGetServerSidePropsType } from 'next'
import { Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { prisma } from 'prisma/client'
import { serialize } from 'domain/entity'
import { AppLayout } from 'pages'
import { BooksFilters } from './filters'
import { useBooks } from '.'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function BooksPage({ books }: Props) {
  const { matchingBooks, ...controls } = useBooks(books)

  return (
    <AppLayout actions={<Button size="sm">+ Add book</Button>}>
      <BooksFilters {...controls} />
      {/* <Sorting /> */}
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Author</Th>
            <Th>Title</Th>
          </Tr>
        </Thead>
        <Tbody>
          {matchingBooks.map((book) => (
            <Tr key={book.id}>
              <Td>{book.author}</Td>
              <Td fontStyle="italic">{book.title}</Td>
            </Tr>
          ))}
          {matchingBooks.length === 0 ? 'No books found' : null}
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
      books: books.map(serialize),
    },
  }
}
