import * as s from 'superstruct'
import {
  bookVolumeSellerStocksStruct,
  type BookVolumeSellerStock,
} from 'domain/entity/BookVolumeSellerStock'

export type BookVolume = {
  no: number
  sellers: BookVolumeSellerStock[]
}

export const bookVolumeStruct = s.type({
  no: s.integer(), // TODO create new attribute
  sellers: bookVolumeSellerStocksStruct,
}) satisfies s.Describe<BookVolume>

export const bookVolumesStruct = s.array(bookVolumeStruct) satisfies s.Describe<
  BookVolume[]
>
