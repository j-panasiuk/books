import * as s from 'superstruct'
import { nameStruct } from 'domain/attribute/name'
import { noStruct } from 'domain/attribute/no'
import {
  bookVolumeSellerStockStruct,
  type BookVolumeSellerStock,
} from 'domain/entity/BookVolumeSellerStock'

export type BookVolume = {
  no: number
  sellers: BookVolumeSellerStock[]
  title?: string | null
}

export const bookVolumeStruct = s.type({
  no: noStruct,
  sellers: s.array(bookVolumeSellerStockStruct),
  title: s.optional(s.nullable(nameStruct)),
}) satisfies s.Describe<BookVolume>

export function canRemoveVolume(
  volume: Pick<BookVolume, 'no'>,
  volumes: Pick<BookVolume, 'no'>[]
) {
  // Only allow to remove last book volume, so that there are no gaps in volume numbering
  // It doesn't make sense to remove "Vol. 2" while leaving "Vol. 3" anyway...
  return volume.no > 1 && volume.no === volumes.length
}