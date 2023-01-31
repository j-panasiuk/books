import { PageSize, Pages, Summary } from 'components/Pagination'
import { type PaginationProps } from 'utils/query/pagination'

interface Props extends PaginationProps {
  pageCount?: number
}

export function BooksPagination({ pageCount, ...paginationProps }: Props) {
  return (
    <>
      <PageSize {...paginationProps} />
      <Pages {...paginationProps} pageCount={pageCount} />
      <Summary {...paginationProps} />
    </>
  )
}
