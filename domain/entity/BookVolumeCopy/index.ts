import type * as DB from '@prisma/client'
import * as s from 'superstruct'
import { nameStruct } from 'domain/attribute/name'
import { type Ownership, ownershipStruct } from 'domain/attribute/ownership'

export type BookVolumeCopy = s.Infer<typeof bookVolumeCopyStruct>

export const bookVolumeCopyStruct = s.object({
  ownership: ownershipStruct,
  from: nameStruct,
  to: nameStruct,
}) satisfies s.Describe<
  Pick<DB.BookVolumeCopy, 'from' | 'to'> & { ownership: Ownership }
>
