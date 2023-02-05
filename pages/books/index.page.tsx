import {
  Button,
  Box,
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
import type { Seller } from '@prisma/client'
import { usePanel } from 'utils/interaction/panel'
import { PageSize, Pages, Summary } from 'components/Pagination'
import { Pencil } from 'components/Icons/Pencil'
import type { Book } from 'domain/entity/Book'
import { SellerStockIcon } from 'domain/entity/BookVolumeSellerStock/icon'
import { AppLayout } from 'pages'
import { BooksFilters } from './filters'
import { BooksSorting } from './sorting'
import { BookPanel } from './panel'
import { api } from './index.api'
import { useBooksList, useSellers } from '.'
import { BookVolume } from 'domain/entity/BookVolume'
import { Stock } from 'domain/attribute/stock'

export default function BooksPage() {
  const { booksQuery, books, ...listControls } = useBooksList()
  const sellers = useSellers()
  const panelControls = usePanel<Book>()

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
          <Button size="sm" onClick={() => panelControls.openCreatePanel()}>
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
            <Th>Volumes</Th>
            <Th>Suggested By</Th>
            <Th>Sellers</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {books?.map((book) => (
            <Tr key={book.id}>
              <Td>{book.author}</Td>
              <Td fontStyle="italic">{book.title}</Td>
              <Td>
                <HStack spacing={1}>
                  {book.volumes.map(({ no }) => (
                    <Box key={no} p={1} border="1px" borderColor="gray.300">
                      <Text fontSize="sm" fontWeight="bold" color="gray.300">
                        {no}
                      </Text>
                    </Box>
                  ))}
                </HStack>
              </Td>
              <Td>{book.suggestedBy}</Td>
              <Td>
                <HStack spacing={1}>
                  {sellers.map((seller) => (
                    <BookSellerStock
                      key={seller.name}
                      seller={seller}
                      volumes={book.volumes}
                    />
                  ))}
                </HStack>
              </Td>
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

      <VStack paddingY={2}>
        <HStack>
          <Summary {...listControls} />
          <Pages {...listControls} />
        </HStack>
      </VStack>

      <BookPanel {...panelControls} {...api} />
    </AppLayout>
  )
}

type BookSellerStockProps = {
  seller: Seller
  volumes: BookVolume[]
}

function BookSellerStock({ seller, volumes }: BookSellerStockProps) {
  const volumeStocks = new Set(
    volumes
      .flatMap((vol) => vol.sellers)
      .filter((s) => s.sellerName === seller.name)
      .map((s) => s.stock)
  )

  let stock: Stock | undefined
  if (volumeStocks.has('none')) stock = 'none'
  if (volumeStocks.has('out_of_stock')) stock = 'out_of_stock'
  if (volumeStocks.has('available')) stock = 'available'

  return (
    <SellerStockIcon
      sellerName={seller.name}
      sellerIcon={seller.icon}
      stock={stock}
      borderStyle={volumeStocks.size > 1 ? 'dashed' : 'inherit'}
    />
  )
}
