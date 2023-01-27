import { GridItem, SimpleGrid } from '@chakra-ui/react'
import { PhraseInput } from 'domain/attribute/phrase/input'
import { type BookFilters } from 'domain/entity/book/BookFilters'
import { type FiltersProps } from 'utils/query/filters'

export function BooksFilters({
  filters,
  setFilters,
  resetFilters,
}: FiltersProps<BookFilters>) {
  return (
    <SimpleGrid
      paddingX={2}
      marginY={2}
      spacing={2}
      columns={6}
      alignItems="center"
    >
      <GridItem>
        <PhraseInput
          value={filters.phrase}
          onChange={(ev) => {
            setFilters((fs) => ({ ...fs, phrase: ev.target.value }))
          }}
        />
      </GridItem>
    </SimpleGrid>
  )
}
