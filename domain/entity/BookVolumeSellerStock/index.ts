import type * as DB from '@prisma/client'
import * as s from 'superstruct'
import { nameStruct } from 'domain/attribute/name'
import { Stock, stockStruct } from 'domain/attribute/stock'

export type BookVolumeSellerStock = {
  sellerName: string
  stock: Stock
}

export const bookVolumeSellerStockStruct = s.type({
  sellerName: nameStruct,
  stock: stockStruct,
}) satisfies s.Describe<BookVolumeSellerStock>

// --- SELECT ---

export const bookVolumeSellerStockSelect = {
  sellerName: true,
  stock: true,
} satisfies DB.Prisma.BookVolumeSellerStockSelect
