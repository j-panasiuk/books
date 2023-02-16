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
  ButtonGroup,
  IconButton,
} from '@chakra-ui/react'
import { usePanel } from 'utils/interaction/panel'
import { T } from 'utils/translate'
import { PageSize, Pages, Summary } from 'components/Pagination'
import { Pencil } from 'components/Icons/Pencil'
import { shortenNames } from 'domain/attribute/name'
import type { Stock } from 'domain/attribute/stock'
import type { Seller } from 'domain/entity/Seller'
import { useSellers } from 'domain/entity/Seller/queries'
import {
  type Book,
  type BookItem,
  getTitleAndSubtitle,
} from 'domain/entity/Book'
import { api } from 'domain/entity/Book/api'
import type { BookVolume } from 'domain/entity/BookVolume'
import { BookVolumeCopy } from 'domain/entity/BookVolumeCopy'
import { BookVolumeCopyCover } from 'domain/entity/BookVolumeCopy/Cover'
import { SellerStockIcon } from 'domain/entity/BookVolumeSellerStock/icon'
import { AppLayout } from 'pages'
import { BooksFilters } from './filters'
import { BooksSorting } from './sorting'
import { BookPanel } from './panel'
import { useBooksList } from '.'

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
            {T('Refetch')}
          </Button>
          <Button size="sm" onClick={() => panelControls.openCreatePanel()}>
            {T('+ Add book')}
          </Button>
        </HStack>
      }
    >
      <VStack paddingY={2}>
        <BooksFilters {...listControls} />
        <BooksSorting {...listControls} />
        <PageSize {...listControls} />
      </VStack>
      <Table
        size="sm"
        marginTop={2}
        opacity={booksQuery.isFetching ? 0.5 : undefined}
        hidden={!booksQuery.data?.length}
      >
        <Thead>
          <Tr>
            <Th>{T('Author')}</Th>
            <Th>{T('Volumes')}</Th>
            <Th>{T('Title')}</Th>
            <Th>{T('Copies')}</Th>
            <Th>{T('Suggested By')}</Th>
            <Th>{T('Sellers')}</Th>
            <Th>{T('Actions')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {books?.map((book) => (
            <Tr key={book.id}>
              <Td>{book.author}</Td>
              <Td>
                <HStack spacing={1} justifyContent="flex-end">
                  {book.volumes.map(({ no }) => (
                    <Box key={no} p={1} border="1px" borderColor="gray.300">
                      <Text fontSize="sm" fontWeight="bold" color="gray.300">
                        {no}
                      </Text>
                    </Box>
                  ))}
                </HStack>
              </Td>
              <Td>
                <Title book={book} />
              </Td>
              <Td>
                <BookCopies book={book} />
              </Td>
              <Td title={book.suggestedBy}>{shortenNames(book.suggestedBy)}</Td>
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
                    title={T('Edit')}
                    aria-label={T('Edit')}
                    icon={<Pencil size={20} />}
                    onClick={() => panelControls.openUpdatePanel(book)}
                  />
                </ButtonGroup>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <VStack paddingY={2} background="white" position="sticky" bottom={0}>
        <HStack>
          <Summary {...listControls} />
          <Pages {...listControls} />
        </HStack>
      </VStack>

      <BookPanel {...panelControls} {...api} />
    </AppLayout>
  )
}

type TitleProps = {
  book: Book
}

function Title({ book }: TitleProps) {
  const { title, subtitle } = getTitleAndSubtitle(book)

  return (
    <>
      <Text fontSize="small">{title}</Text>
      {subtitle ? (
        <Text fontSize="smaller" fontStyle="italic">
          {subtitle}
        </Text>
      ) : null}
    </>
  )
}

type BookCopiesProps = {
  book: BookItem
}

function BookCopies({ book }: BookCopiesProps) {
  const getCopyCoverTitle = (copy: BookVolumeCopy): string => {
    switch (copy.ownership) {
      case 'borrowed':
        return copy.from
      case 'owned':
        return copy.to
      case 'gifted':
        return copy.to
    }
  }

  return (
    <HStack spacing={1}>
      {book.volumes.flatMap((vol) =>
        vol.copies.flatMap((copy, i) => (
          <BookVolumeCopyCover
            key={`${vol.no}.${i}`}
            copy={copy}
            title={getCopyCoverTitle(copy)}
            width={5}
          />
        ))
      ) ?? null}
    </HStack>
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
