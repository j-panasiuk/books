import type * as DB from '@prisma/client'
import * as s from 'superstruct'
import { nameStruct } from 'domain/attribute/name'
import { type Ownership, ownershipStruct } from 'domain/attribute/ownership'

export type BookVolumeCopy = s.Infer<typeof bookVolumeCopyStruct>

export const bookVolumeCopyStruct = s.coerce(
  s.object({
    ownership: s.defaulted(ownershipStruct, 'owned'),
    from: nameStruct,
    to: nameStruct,
  }),
  s.unknown(),
  function coerce(val) {
    if (!val) return {}
    return val
  }
) satisfies s.Describe<
  Pick<DB.BookVolumeCopy, 'from' | 'to'> & { ownership: Ownership }
>
