import {
  Button,
  type ButtonProps,
  CloseButton,
  Divider,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
} from '@chakra-ui/react'
import type { BookVolume } from 'domain/entity/BookVolume'

export function BookVolumeCardAdd(
  props: Required<Pick<ButtonProps, 'onClick'>>
) {
  return (
    <Button
      variant="unstyled"
      height="100%"
      minHeight={28}
      borderWidth={4}
      borderColor="gray.100"
      borderStyle="dashed"
      color="blue.400"
      {...props}
    >
      + Add Volume
    </Button>
  )
}

type Props = {
  volume: BookVolume
  updateVolume: (vol: BookVolume) => void
  removeVolume?: () => void
}

export function BookVolumeCard({ volume, updateVolume, removeVolume }: Props) {
  return (
    <SimpleGrid
      columns={2}
      templateRows="max-content min-content 1fr"
      padding={2}
      spacing={2}
      borderWidth={1}
      borderColor="gray.200"
    >
      <GridItem
        colSpan={2}
        minHeight={8}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading as="h4" size="sm">
          Vol. {volume.no}
        </Heading>
        {removeVolume ? (
          <CloseButton onClick={removeVolume} title="Remove volume" />
        ) : null}
      </GridItem>

      <HLine />

      <GridItem colSpan={2}>
        <Input
          type="text"
          placeholder="Volume title"
          value={volume.title || ''}
          onChange={(ev) => {
            updateVolume({ ...volume, title: ev.target.value })
          }}
        />
      </GridItem>
    </SimpleGrid>
  )
}

function HLine() {
  return (
    <GridItem colStart={1} colEnd={-1}>
      <Divider />
    </GridItem>
  )
}
