import { type ButtonProps, GridItem, HStack } from '@chakra-ui/react'
import { AddButton } from 'components/AddButton'
import { Select } from 'components/Select'
import { ownershipOptions } from 'domain/attribute/ownership'
import { BookVolumeCopyCover } from './Cover'
import { type BookVolumeCopy } from '.'

type Props = {
  copy: BookVolumeCopy
  onChange: (copy: BookVolumeCopy) => void
  onRemove: () => void
}

export function BookVolumeCopyItemAdd(
  props: Required<Pick<ButtonProps, 'onClick'>>
) {
  return (
    <GridItem colStart={1} colEnd={-1}>
      <AddButton minHeight={16} {...props}>
        + Add Volume Copy
      </AddButton>
    </GridItem>
  )
}

export function BookVolumeCopyItem({ copy, onChange, onRemove }: Props) {
  return (
    <GridItem colStart={1} colEnd={-1}>
      <HStack spacing={2}>
        <BookVolumeCopyCover copy={copy} />
        <Select
          options={ownershipOptions}
          value={copy.ownership}
          onSelect={(ownership) => {
            onChange({ ownership, from: '', to: '' })
          }}
        />
      </HStack>
    </GridItem>
  )
}
