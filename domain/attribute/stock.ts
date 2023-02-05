import * as s from 'superstruct'
import { isOneOf } from 'utils/isOneOf'

export type Stock = s.Infer<typeof stockStruct>

const stockOptions = ['none', 'out_of_stock', 'available'] as const
export const stockStruct = s.enums(stockOptions)
export const isStock = isOneOf(stockOptions)

export function canBuy(stock: Stock): boolean {
  return stock === 'available'
}
