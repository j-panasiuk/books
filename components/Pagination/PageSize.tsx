import { Button, HStack, Select } from '@chakra-ui/react'
import { type PaginationProps } from 'utils/query/pagination'
import { T } from 'utils/translate'

const pageSizeOptions = [20, 50, 100, 200, Infinity]

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
        {pageSizeOptions.map((option) => (
          <option key={`size.${option}`} value={option}>
            {Number.isFinite(option)
              ? T(`Page size: ${option}`)
              : T('Show all')}
          </option>
        ))}
      </Select>

      <Button size="sm" onClick={resetPagination}>
        Reset
      </Button>
    </HStack>
  )
}
