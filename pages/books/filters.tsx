import { Button, GridItem, SimpleGrid, Input } from '@chakra-ui/react'
import { Select } from 'components/Select'
import { ownershipOptions } from 'domain/attribute/ownership'
import { type BookFilters } from 'domain/entity/Book/BookFilters'
import { type FiltersProps } from 'utils/query/filters'
import { useBooksSuggestedByPeople } from '.'

export function BooksFilters({
  filters,
  setFilters,
  resetFilters,
}: FiltersProps<BookFilters>) {
  const people = useBooksSuggestedByPeople()

  return (
    <SimpleGrid paddingX={2} spacing={2} columns={8} alignItems="center">
      <GridItem colSpan={2}>
        <Input
          value={filters.phrase}
          onChange={(ev) => {
            setFilters((fs) => ({ ...fs, phrase: ev.target.value }))
          }}
          type="search"
          size="sm"
          placeholder="Phrase..."
          borderColor={filters.phrase ? 'orange.300' : undefined}
        />
      </GridItem>
      <GridItem colSpan={2}>
        <Select
          options={people}
          value={filters.suggestedBy}
          onSelect={(suggestedBy) => {
            setFilters((fs) => ({ ...fs, suggestedBy }))
          }}
          size="sm"
          placeholder="Suggested by..."
          borderColor={filters.suggestedBy ? 'orange.300' : undefined}
        />
      </GridItem>
      <GridItem colSpan={2}>
        <Select
          options={ownershipOptions}
          value={filters.ownership}
          onSelect={(ownership) => {
            setFilters((fs) => ({ ...fs, ownership }))
          }}
          size="sm"
          placeholder="Ownership..."
          borderColor={filters.ownership ? 'orange.300' : undefined}
        />
      </GridItem>
      <GridItem colSpan={2}>
        <Button size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </GridItem>
    </SimpleGrid>
  )
}
