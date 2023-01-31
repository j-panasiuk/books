import {
  Button,
  VStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { AppLayout } from 'pages'
import { BooksFilters } from './filters'
import { BooksSorting } from './sorting'
import { BooksPagination } from './pagination'
import { useBooksList } from '.'

export default function BooksPage() {
  const { booksQuery, books, ...controls } = useBooksList()

  return (
    <AppLayout actions={<Button size="sm">+ Add book</Button>}>
      <VStack>
        <BooksFilters {...controls} />
        <BooksSorting {...controls} />
        <BooksPagination {...controls} />
      </VStack>
      <Table size="sm" marginTop={2}>
        <Thead>
          <Tr>
            <Th>Author</Th>
            <Th>Title</Th>
            <Th>Suggested By</Th>
          </Tr>
        </Thead>
        <Tbody>
          {books?.map((book) => (
            <Tr key={book.id}>
              <Td>{book.author}</Td>
              <Td fontStyle="italic">{book.title}</Td>
              <Td>{book.suggestedBy}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {books?.length === 0 ? <p>No books found</p> : null}
    </AppLayout>
  )
}
