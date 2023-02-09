import type { Prisma } from '@prisma/client'
import type { Entity } from '.'

export type Search<T extends Entity> = () => Promise<T[]>
export type Fetch<T extends Entity> = (id: Entity['id']) => Promise<T>

export type Create<T extends Entity> = (
  input: Prisma.InputJsonObject
) => Promise<T>

export type Update<T extends Entity> = (
  id: Entity['id'],
  input: Prisma.InputJsonObject
) => Promise<T>

export type Remove = (id: Entity['id']) => Promise<unknown>

export interface Api<T extends Entity> {
  create: Create<T>
  update: Update<T>
  remove: Remove
}
