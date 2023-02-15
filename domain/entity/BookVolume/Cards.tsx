import {
  type ButtonProps,
  CloseButton,
  Divider,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
} from '@chakra-ui/react'
import type { Seller } from '@prisma/client'
import { AddButton } from 'components/AddButton'
import { Labelled } from 'components/Labelled'
import { Select } from 'components/Select'
import { stockOptions } from 'domain/attribute/stock'
import type { BookVolume } from 'domain/entity/BookVolume'
import {
  BookVolumeCopyItem,
  BookVolumeCopyItemAdd,
} from 'domain/entity/BookVolumeCopy/Item'
import { SellerStockIcon } from 'domain/entity/BookVolumeSellerStock/icon'
import { T } from 'utils/translate'

export function BookVolumeCardAdd(
  props: Required<Pick<ButtonProps, 'onClick'>>
) {
  return (
    <AddButton minHeight={28} {...props}>
      {T('+ Add Volume')}
    </AddButton>
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
        <Heading as="h4" size="sm" width="100%" textAlign="center">
          {T(`Vol. no ${volume.no}`)}
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

      {sellers ? <HLine /> : null}

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
            <Select
              id={key}
              options={stockOptions}
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
