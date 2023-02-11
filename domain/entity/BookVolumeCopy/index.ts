import * as s from 'superstruct'
import type * as DB from '@prisma/client'
import { nameStruct } from 'domain/attribute/name'
import { isOneOf } from 'utils/isOneOf'

export type Ownership = s.Infer<typeof ownershipStruct>

export const ownershipOptions = ['borrowed', 'owned', 'gifted'] as const
export const ownershipStruct = s.enums(ownershipOptions)
export const isOwnership = isOneOf(ownershipOptions)

export type BookVolumeCopy = s.Infer<typeof bookVolumeCopyStruct>

export const bookVolumeCopyStruct = s.object({
  ownership: ownershipStruct,
  from: nameStruct,
  to: nameStruct,
}) satisfies s.Describe<
  Pick<DB.BookVolumeCopy, 'from' | 'to'> & { ownership: Ownership }
>
