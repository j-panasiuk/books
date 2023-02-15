import { type ButtonProps, Button, HStack, Text } from '@chakra-ui/react'
import { type PaginationProps } from 'utils/query/pagination'

interface Props extends PaginationProps {
  pageCount?: number
}

export function Pages({
  pageCount,
  pagination: { pageIndex },
  setPagination,
}: Props) {
  const setPage = (pageIndex: number) => {
    setPagination((p) => ({ ...p, pageIndex }))
  }

  return !pageCount ? null : (
    <HStack spacing={1}>
      {pageIndex > 1 && (
        <Button {...buttonProps} onClick={() => setPage(0)}>
          {1}
          <Text color="gray.300" marginLeft={1}>
            {'❮❮'}
          </Text>
        </Button>
      )}
      {Math.abs(pageIndex) > 2 && (
        <Button {...buttonProps} disabled>
          {'...'}
        </Button>
      )}
      {pageIndex > 0 && (
        <Button {...buttonProps} onClick={() => setPage(pageIndex - 1)}>
          {pageIndex}
        </Button>
      )}
      {pageCount > 1 && (
        <Button {...buttonProps} color="orange.300">
          {1 + pageIndex}
        </Button>
      )}
      {1 + pageIndex < pageCount && (
        <Button {...buttonProps} onClick={() => setPage(pageIndex + 1)}>
          {2 + pageIndex}
        </Button>
      )}
      {Math.abs(pageIndex - pageCount) > 2 && (
        <Button {...buttonProps} disabled>
          {'...'}
        </Button>
      )}
      {2 + pageIndex < pageCount && (
        <Button {...buttonProps} onClick={() => setPage(pageCount - 1)}>
          <Text color="gray.300" marginRight={1}>
            {'❯❯'}
          </Text>
          {pageCount}
        </Button>
      )}
    </HStack>
  )
}

const buttonProps: ButtonProps = {
  size: 'sm',
  variant: 'outline',
}
