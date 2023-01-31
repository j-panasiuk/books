import { HStack, Text } from '@chakra-ui/react'
import { type PaginationProps } from 'utils/query/pagination'

interface Props extends PaginationProps {
  itemsMatching?: number
  itemsTotal?: number
}

export function Summary({ itemsMatching, itemsTotal, pagination }: Props) {
  if (typeof itemsTotal !== 'number' || typeof itemsMatching !== 'number') {
    return null
  }

  const { pageSize, pageIndex } = pagination

  const isLastPage = (1 + pageIndex) * pageSize > itemsMatching
  const itemsShowing = isLastPage ? itemsMatching % pageSize : pageSize

  const firstItem = 1 + pageIndex * pageSize
  const lastItem = firstItem + itemsShowing - 1

  return itemsTotal === 0 ? null : (
    <HStack alignItems="center">
      {itemsMatching > 0 ? (
        <>
          <Text fontSize="sm">
            Showing {firstItem} - {lastItem} of
          </Text>
          <Text fontSize="sm" fontWeight="bold" mx={1}>
            {itemsMatching}
          </Text>
          <Text fontSize="sm"> / {itemsTotal}</Text>
        </>
      ) : (
        <Text fontSize="sm">No results found</Text>
      )}
    </HStack>
  )
}
