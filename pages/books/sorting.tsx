import type { Book } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import type { SortProps } from 'utils/query/sort'

export function BooksSorting({
  sort,
  setSort,
  resetSort,
}: SortProps<Serialized<Book>>) {
  // TODO
  return (
    <div>
      <pre>{JSON.stringify(sort, null, 2)}</pre>
    </div>
  )
}
