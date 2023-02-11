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
import type { Seller } from '@prisma/client'
import { Labelled } from 'components/Labelled'
import type { BookVolume } from 'domain/entity/BookVolume'
import { SellerStockIcon } from 'domain/entity/BookVolumeSellerStock/icon'
import { SellerStockSelect } from 'domain/entity/BookVolumeSellerStock/select'

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
  sellers?: Seller[]
}

export function BookVolumeCard({
  volume,
  updateVolume,
  removeVolume,
  sellers,
}: Props) {
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

      <HLine />

      {sellers?.map(({ name, icon }) => {
        const key = `seller.${name}`
        const seller = volume.sellers.find((s) => s.sellerName === name)
        const stock = seller?.stock

        return (
          <Labelled
            key={key}
            htmlFor={key}
            label={name}
            icon={
              <SellerStockIcon
                sellerName={name}
                sellerIcon={icon}
                stock={stock}
              />
            }
          >
            <SellerStockSelect
              id={key}
              value={stock}
              onSelect={(stock) => {
                updateVolume({
                  ...volume,
                  sellers: stock
                    ? seller
                      ? volume.sellers.map((s) =>
                          s.sellerName === name ? { ...s, stock } : s
                        )
                      : volume.sellers.concat({
                          sellerName: name,
                          stock,
                        })
                    : volume.sellers.filter((s) => s.sellerName !== name),
                })
              }}
            />
          </Labelled>
        )
      })}
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
