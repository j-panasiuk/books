import {
  Button,
  HStack,
  VStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Center,
  ButtonGroup,
  IconButton,
} from '@chakra-ui/react'
import type { Book } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import { usePanel } from 'utils/interaction/panel'
import { PageSize, Pages, Summary } from 'components/Pagination'
import { Pencil } from 'components/Icons/Pencil'
import { AppLayout } from 'pages'
import { BooksFilters } from './filters'
import { BooksSorting } from './sorting'
import { BookPanel } from './panel'
import { api } from './index.api'
import { useBooksList } from '.'

export default function BooksPage() {
  const { booksQuery, books, ...listControls } = useBooksList()
  const panelControls = usePanel<Serialized<Book>>()

  return (
    <AppLayout
      actions={
        <HStack spacing={2}>
          <Button
            size="sm"
            variant="outline"
            color="white"
            onClick={() => booksQuery.refetch()}
            isLoading={booksQuery.isFetching}
          >
            Refetch
          </Button>
          <Button size="sm" onClick={panelControls.openCreatePanel}>
            + Add book
          </Button>
        </HStack>
      }
    >
      <VStack paddingY={2}>
        <BooksFilters {...listControls} />
        <BooksSorting {...listControls} />
        <PageSize {...listControls} />
        <HStack>
          <Summary {...listControls} />
          <Pages {...listControls} />
        </HStack>
      </VStack>
      <Table
        size="sm"
        marginTop={2}
        opacity={booksQuery.isFetching ? 0.5 : undefined}
        hidden={!booksQuery.data?.length}
      >
        <Thead>
          <Tr>
            <Th>Author</Th>
            <Th>Title</Th>
            <Th>Suggested By</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {books?.map((book) => (
            <Tr key={book.id}>
              <Td>{book.author}</Td>
              <Td fontStyle="italic">{book.title}</Td>
              <Td>{book.suggestedBy}</Td>
              <Td isNumeric>
                <ButtonGroup size="sm" variant="ghost" color="gray.300">
                  <IconButton
                    title="Edit"
                    aria-label="Edit"
                    icon={<Pencil size={20} />}
                    onClick={() => panelControls.openUpdatePanel(book)}
                  />
                </ButtonGroup>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {books?.length === 0 ? (
        <Center p={2}>
          <Text
            textTransform="uppercase"
            fontWeight="bold"
            textColor="gray.300"
          >
            No books found
          </Text>
        </Center>
      ) : null}

      <BookPanel {...panelControls} {...api} />
    </AppLayout>
  )
}
