import { Stock, stockStruct } from 'domain/attribute/stock'
import * as s from 'superstruct'

export type BookVolumeSellerStock = {
  sellerName: string
  stock: Stock
}

export const bookVolumeSellerStockStruct = s.type({
  stock: stockStruct,
  sellerName: s.nonempty(s.string()), // TODO name -> attribute
}) satisfies s.Describe<BookVolumeSellerStock>

export const bookVolumeSellerStocksStruct = s.array(
  bookVolumeSellerStockStruct
) satisfies s.Describe<BookVolumeSellerStock[]>
