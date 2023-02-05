import * as s from 'superstruct'
import { noStruct } from 'domain/attribute/no'
import {
  bookVolumeSellerStocksStruct,
  type BookVolumeSellerStock,
} from 'domain/entity/BookVolumeSellerStock'

export type BookVolume = {
  no: number
  sellers: BookVolumeSellerStock[]
}

export const bookVolumeStruct = s.type({
  no: noStruct,
  sellers: bookVolumeSellerStocksStruct,
}) satisfies s.Describe<BookVolume>

export const bookVolumesStruct = s.array(bookVolumeStruct) satisfies s.Describe<
  BookVolume[]
>
