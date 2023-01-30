import { Button, ButtonGroup, HStack, Text } from '@chakra-ui/react'
import type { Book } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import { bookSortOptions, sortBy } from 'domain/entity/book/BookSorts'
import { type SortProps, ORDER, reverse } from 'utils/query/sort'

export function BooksSorting({
  sort,
  setSort,
  resetSort,
}: SortProps<Serialized<Book>>) {
  const onSort = (key: keyof Serialized<Book>) => {
    setSort((currentSort) => {
      return sortBy(
        key,
        key === currentSort.key ? reverse(currentSort.order) : undefined
      )
    })
  }

  return (
    <HStack>
      <ButtonGroup isAttached size="sm" variant="outline">
        {bookSortOptions.map((option) => (
          <Button
            key={option.key}
            onClick={() => onSort(option.key)}
            color={sort.key === option.key ? 'orange.300' : undefined}
          >
            {option.key}
            <Text marginLeft={1} fontSize="md" hidden={sort.key !== option.key}>
              {sort.order === ORDER.ASC ? '▴' : '▾'}
            </Text>
          </Button>
        ))}
      </ButtonGroup>

      <Button size="sm" onClick={resetSort}>
        Reset
      </Button>
    </HStack>
  )
}
