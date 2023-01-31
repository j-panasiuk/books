import { Button, HStack, Select } from '@chakra-ui/react'
import { type PaginationProps } from 'utils/query/pagination'

export function PageSize({
  pagination: { pageSize },
  setPagination,
  resetPagination,
}: PaginationProps) {
  return (
    <HStack spacing={2}>
      <Select
        size="sm"
        width="fit-content"
        value={pageSize}
        onChange={(ev) => {
          const value = Number(ev.target.value)
          if (Number.isInteger(value)) {
            setPagination({ pageSize: value, pageIndex: 0 })
          }
        }}
      >
        <option value={20}>Page size: 20</option>
        <option value={50}>Page size: 50</option>
        <option value={100}>Page size: 100</option>
        <option value={200}>Page size: 200</option>
        <option value={Infinity}>Show all</option>
      </Select>

      <Button size="sm" onClick={resetPagination}>
        Reset
      </Button>
    </HStack>
  )
}
