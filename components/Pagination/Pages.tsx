import { Button, HStack } from '@chakra-ui/react'
import { type PaginationProps } from 'utils/query/pagination'

interface Props extends PaginationProps {
  pageCount?: number
}

export function Pages({
  pageCount,
  pagination: { pageIndex },
  setPagination,
}: Props) {
  return pageCount === undefined ? null : (
    <HStack spacing={1}>
      {pageIndex > 1 && (
        <Button
          size="sm"
          onClick={() => setPagination((p) => ({ ...p, pageIndex: 0 }))}
        >
          {'<< '}
          {1}
        </Button>
      )}
      {Math.abs(pageIndex) > 2 && (
        <Button size="sm" disabled>
          ...
        </Button>
      )}
      {pageIndex > 0 && (
        <Button
          size="sm"
          onClick={() =>
            setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))
          }
        >
          {pageIndex}
        </Button>
      )}
      <Button size="sm" color="orange.300">
        {1 + pageIndex}
      </Button>
      {1 + pageIndex < pageCount && (
        <Button
          size="sm"
          onClick={() =>
            setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))
          }
        >
          {2 + pageIndex}
        </Button>
      )}
      {Math.abs(pageIndex - pageCount) > 2 && (
        <Button size="sm" disabled>
          ...
        </Button>
      )}
      {2 + pageIndex < pageCount && (
        <Button
          size="sm"
          onClick={() =>
            setPagination((p) => ({ ...p, pageIndex: pageCount - 1 }))
          }
        >
          {'>> '}
          {pageCount}
        </Button>
      )}
    </HStack>
  )
}
