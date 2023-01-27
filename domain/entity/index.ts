export interface Entity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// Serialize datetime props (Date -> string)
// Reason: server-side can use js Date objects, but can't send them to client-side
// Note: this serialization is not recursive, to keep things simple
//
// This is not beautiful, but there seems to be no out-of-the-box solution atm
// @see https://github.com/vercel/next.js/issues/11993

export type Serialized<T extends Entity> = Omit<
  T,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

export function serialize<T extends Entity>(entity: T): Serialized<T> {
  return {
    ...entity,
    createdAt: JSON.stringify(entity.createdAt),
    updatedAt: JSON.stringify(entity.updatedAt),
  }
}
