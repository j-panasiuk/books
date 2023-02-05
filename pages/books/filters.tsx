import {
  type InputProps,
  type SelectProps,
  Button,
  GridItem,
  SimpleGrid,
  Input,
  Select,
} from '@chakra-ui/react'
import { type BookFilters } from 'domain/entity/Book/BookFilters'
import { type FiltersProps } from 'utils/query/filters'
import { useBooksSuggestedByPeople } from '.'

export function BooksFilters({
  filters,
  setFilters,
  resetFilters,
}: FiltersProps<BookFilters>) {
  return (
    <SimpleGrid paddingX={2} spacing={2} columns={6} alignItems="center">
      <GridItem colSpan={2}>
        <PhraseInput
          value={filters.phrase}
          onChange={(ev) => {
            setFilters((fs) => ({ ...fs, phrase: ev.target.value }))
          }}
        />
      </GridItem>
      <GridItem colSpan={2}>
        <SuggestedBySelect
          value={filters.suggestedBy || ''}
          onChange={(ev) => {
            setFilters((fs) => ({ ...fs, suggestedBy: ev.target.value }))
          }}
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

function PhraseInput(props: InputProps) {
  return <Input size="sm" type="search" placeholder="Phrase..." {...props} />
}

function SuggestedBySelect(props: SelectProps) {
  const people = useBooksSuggestedByPeople()

  return (
    <Select size="sm" placeholder="Suggested by..." {...props}>
      {people.map((person) => (
        <option key={person} value={person}>
          {person}
        </option>
      ))}
    </Select>
  )
}
