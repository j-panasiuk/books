import type { Dispatch, SetStateAction } from 'react'
import { isNonEmpty } from 'utils/isEmpty'

export interface FiltersProps<F extends Record<string, unknown>> {
  filters: F
  setFilters: Dispatch<SetStateAction<F>>
  resetFilters: () => void
}

export function hasFilters(filters: Record<string, unknown>): boolean {
  return Object.values(filters).some(isNonEmpty)
}
