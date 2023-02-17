import { type ButtonProps, GridItem, CloseButton } from '@chakra-ui/react'
import { AddButton } from 'components/AddButton'
import { Select } from 'components/Select'
import { ownershipOptions } from 'domain/attribute/ownership'
import { T } from 'utils/translate'
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
        {T('+ Add Volume Copy')}
      </AddButton>
    </GridItem>
  )
}

export function BookVolumeCopyItem({ copy, onChange, onRemove }: Props) {
  return (
    <GridItem colStart={1} colEnd={-1} display="flex" alignItems="center">
      <BookVolumeCopyCover copy={copy} />
      <Select
        options={ownershipOptions}
        value={copy.ownership}
        onSelect={(ownership) => {
          onChange({ ownership, from: '', to: '' })
        }}
        mx={2}
      />
      <CloseButton onClick={onRemove} title={T('Remove copy')} />
    </GridItem>
  )
}
