import * as s from 'superstruct'
import { datetimeStruct } from 'domain/attribute/datetime'
import { idStruct } from 'domain/attribute/id'

export interface DBEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface Entity {
  id: string
  createdAt: string
  updatedAt: string
}

export const dbEntityStruct = s.type({
  id: idStruct,
  createdAt: s.date(),
  updatedAt: s.date(),
}) satisfies s.Describe<DBEntity>

export const entityStruct = s.type({
  id: idStruct,
  createdAt: datetimeStruct,
  updatedAt: datetimeStruct,
}) satisfies s.Describe<Entity>

export type Base<T> = Omit<T, keyof Entity>

// Serialize datetime props (Date -> string)
// Reason: server-side can use js Date objects, but can't send them to client-side
// Note: this serialization is not recursive, to keep things simple
//
// This is not beautiful, but there seems to be no out-of-the-box solution atm
// @see https://github.com/vercel/next.js/issues/11993

export type Serialized<T extends DBEntity> = Omit<
  T,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

/**
 * @deprecated
 */
export function serialize<T extends DBEntity>(entity: T): Serialized<T> {
  return {
    ...entity,
    createdAt: JSON.stringify(entity.createdAt),
    updatedAt: JSON.stringify(entity.updatedAt),
  }
}
