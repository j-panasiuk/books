import * as s from 'superstruct'
import { nameStruct } from 'domain/attribute/name'
import { Stock, stockStruct } from 'domain/attribute/stock'

export type BookVolumeSellerStock = {
  sellerName: string
  stock: Stock
}

export const bookVolumeSellerStockStruct = s.type({
  stock: stockStruct,
  sellerName: nameStruct,
}) satisfies s.Describe<BookVolumeSellerStock>

export const bookVolumeSellerStocksStruct = s.array(
  bookVolumeSellerStockStruct
) satisfies s.Describe<BookVolumeSellerStock[]>
