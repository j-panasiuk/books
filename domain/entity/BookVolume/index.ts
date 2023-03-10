import type * as DB from '@prisma/client'
import * as s from 'superstruct'
import { nameStruct } from 'domain/attribute/name'
import { positiveCountStruct } from 'domain/attribute/count'
import {
  bookVolumeCopySelect,
  bookVolumeCopyStruct,
  type BookVolumeCopy,
} from 'domain/entity/BookVolumeCopy'
import {
  bookVolumeSellerStockSelect,
  bookVolumeSellerStockStruct,
  type BookVolumeSellerStock,
} from 'domain/entity/BookVolumeSellerStock'

export type BookVolume = s.Infer<typeof bookVolumeStruct>
export const bookVolumeStruct = s.coerce(
  s.type({
    no: positiveCountStruct,
    title: nameStruct,
    copies: s.array(bookVolumeCopyStruct),
    sellers: s.array(bookVolumeSellerStockStruct),
  }),
  s.unknown(),
  function coerceToBookVolume(val) {
    if (positiveCountStruct.is(val)) {
      return {
        no: val,
        title: '',
        copies: [],
        sellers: [],
      }
    }
    return val
  }
) satisfies s.Describe<
  Pick<DB.BookVolume, 'no' | 'title'> & {
    copies: BookVolumeCopy[]
    sellers: BookVolumeSellerStock[]
  }
>

export const bookVolumesStruct = s.coerce(
  s.nonempty(s.array(bookVolumeStruct)),
  s.unknown(),
  (val) => {
    if (!(Array.isArray(val) && val[0])) return [bookVolumeStruct.create(1)]
    return val
  }
)

export const bookVolumeSelect = {
  no: true,
  title: true,
  copies: { select: bookVolumeCopySelect },
  sellers: { select: bookVolumeSellerStockSelect },
} satisfies DB.Prisma.BookVolumeSelect
export function canRemoveVolume(
  volume: Pick<BookVolume, 'no'>,
  volumes: Pick<BookVolume, 'no'>[]
) {
  // Only allow to remove last book volume, so that there are no gaps in volume numbering
  // It doesn't make sense to remove "Vol. 2" while leaving "Vol. 3" anyway...
  return volume.no > 1 && volume.no === volumes.length
}
