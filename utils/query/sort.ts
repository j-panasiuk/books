import type { Dispatch, SetStateAction } from 'react'
import { type Compare, compare } from 'utils/compare'

export enum ORDER {
  DESC = -1,
  ASC = 1,
}

export type SortOrder = typeof ORDER.ASC | typeof ORDER.DESC

export type Sort<T extends Record<string, unknown>> = {
  key: keyof T
  order: SortOrder
}

export interface SortProps<T extends Record<string, unknown>> {
  sort: Sort<T>
  setSort: Dispatch<SetStateAction<Sort<T>>>
  resetSort: () => void
}

export const isSortOrder = (val: unknown): val is SortOrder => {
  return val === ORDER.DESC || val === ORDER.ASC
}

export const by = <T extends Record<string, unknown>>({
  key,
  order,
}: Sort<T>): Compare<T> => {
  const val = (object: T) => object[key]

  return function compareFn(a: T, b: T) {
    switch (order * compare(val(a), val(b))) {
      case -1:
        return -1
      case 1:
        return 1
      default:
        return 0
    }
  }
}
