import { Button, GridItem, SimpleGrid, Input, HStack } from '@chakra-ui/react'
import { Select } from 'components/Select'
import { ownershipOptions } from 'domain/attribute/ownership'
import { useBooksSuggestedByPeople } from 'domain/entity/Book/queries'
import {
  type BookFilters,
  phraseFieldOptions,
} from 'domain/entity/Book/BookFilters'
import { type FiltersProps } from 'utils/query/filters'
import { T } from 'utils/translate'

export function BooksFilters({
  filters,
  setFilters,
  resetFilters,
}: FiltersProps<BookFilters>) {
  const people = useBooksSuggestedByPeople()

  return (
    <SimpleGrid paddingX={2} spacing={2} columns={12} alignItems="center">
      <GridItem colSpan={6}>
        <HStack spacing={0}>
          <Select
            options={phraseFieldOptions}
            value={filters.phraseField}
            onSelect={(phraseField) => {
              setFilters((fs) => ({ ...fs, phraseField }))
            }}
            width={48}
            size="sm"
            placeholder={T('Search by...')}
            borderRightRadius="none"
            borderColor={filters.phraseField ? 'orange.300' : undefined}
            backgroundColor="gray.50"
          >
            <option value="author">{T('Author')}</option>
            <option value="title">{T('Title')}</option>
          </Select>
          <Input
            value={filters.phrase}
            onChange={(ev) => {
              setFilters((fs) => ({ ...fs, phrase: ev.target.value }))
            }}
            type="search"
            size="sm"
            placeholder={T('Phrase...')}
            borderLeftRadius="none"
            borderColor={filters.phrase ? 'orange.300' : undefined}
          />
        </HStack>
      </GridItem>
      <GridItem colSpan={2}>
        <Select
          options={people}
          value={filters.suggestedBy}
          onSelect={(suggestedBy) => {
            setFilters((fs) => ({ ...fs, suggestedBy }))
          }}
          size="sm"
          placeholder={T('Suggested by...')}
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
          placeholder={T('Ownership...')}
          borderColor={filters.ownership ? 'orange.300' : undefined}
        />
      </GridItem>
      <GridItem colSpan={2}>
        <Button size="sm" onClick={resetFilters}>
          {T('Reset')}
        </Button>
      </GridItem>
    </SimpleGrid>
  )
}
