import * as s from 'superstruct'
import { isOneOf } from 'utils/isOneOf'

export type Stock = s.Infer<typeof stockStruct>

export const stockOptions = [
  'none',
  'out_of_stock',
  'out_of_stock:notify_me',
  'available',
  'available:last_chance',
  'available:cannot_deliver',
] as const
export const stockStruct = s.enums(stockOptions)
export const isStock = isOneOf(stockOptions)

export function canBuy(
  stock: Stock
): stock is 'available' | 'available:last_chance' {
  return stock === 'available' || stock === 'available:last_chance'
}
