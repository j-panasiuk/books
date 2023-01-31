import type { Dispatch, SetStateAction } from 'react'

export type Pagination = {
  pageSize: number
  pageIndex: number
}

export type PaginationProps = {
  pagination: Pagination
  setPagination: Dispatch<SetStateAction<Pagination>>
  resetPagination: () => void
}

export function range({
  pageIndex,
  pageSize,
}: Pagination): [start: number, end: number] {
  return [pageIndex * pageSize, (1 + pageIndex) * pageSize]
}
