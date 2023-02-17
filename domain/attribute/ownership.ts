import * as s from 'superstruct'
import { isOneOf } from 'utils/isOneOf'

export type Ownership = s.Infer<typeof ownershipStruct>

export const ownershipOptions = [
  'borrowed',
  'ordered',
  'owned',
  'gifted',
] as const
export const ownershipStruct = s.enums(ownershipOptions)
export const isOwnership = isOneOf(ownershipOptions)
