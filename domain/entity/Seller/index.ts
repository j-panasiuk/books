import type * as DB from '@prisma/client'
import * as s from 'superstruct'

export type Seller = s.Infer<typeof sellerStruct>

export const sellerStruct = s.type({
  name: s.nonempty(s.string()),
  icon: s.nonempty(s.string()),
}) satisfies s.Describe<DB.Seller>
