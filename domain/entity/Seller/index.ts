import type * as DB from '@prisma/client'
import * as s from 'superstruct'

export type Seller = DB.Seller

export const sellerStruct = s.type({
  name: s.nonempty(s.string()),
  icon: s.nonempty(s.string()),
}) satisfies s.Describe<DB.Seller>

export const sellersStruct = s.array(sellerStruct) satisfies s.Describe<
  DB.Seller[]
>
