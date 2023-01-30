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
import { useFilteredBooks } from '.'

export default function BooksPage() {
  const { matchingBooks, ...controls } = useFilteredBooks()

  return (
    <AppLayout actions={<Button size="sm">+ Add book</Button>}>
      <VStack>
        <BooksFilters {...controls} />
        <BooksSorting {...controls} />
      </VStack>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Author</Th>
            <Th>Title</Th>
            <Th>Suggested By</Th>
          </Tr>
        </Thead>
        <Tbody>
          {matchingBooks.map((book) => (
            <Tr key={book.id}>
              <Td>{book.author}</Td>
              <Td fontStyle="italic">{book.title}</Td>
              <Td>{book.suggestedBy}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {matchingBooks.length === 0 ? <p>No books found</p> : null}
    </AppLayout>
  )
}
