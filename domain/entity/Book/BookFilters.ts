import { includesCaseInsensitive } from 'domain/attribute/name'
import { type Ownership } from 'domain/attribute/ownership'
import { canBuy } from 'domain/attribute/stock'
import type { BookItem } from 'domain/entity/Book'
import type { Seller } from 'domain/entity/Seller'
import type { Matches } from 'utils/matches'
import { OPTION } from 'utils/forms/options'

export type BookFilters = Partial<{
  phraseField: PhraseField
  phrase: string
  suggestedBy: OPTION | string
  ownership: OPTION | Ownership
  sellerName: OPTION | Seller['name']
}>

export const matches: Matches<BookFilters, BookItem> = (fs) => (book) => {
  if (fs.phrase && !matchesPhrase(fs)(book)) return false
  if (fs.suggestedBy && !matchesSuggestedBy(fs.suggestedBy)(book)) return false
  if (fs.ownership && !matchesOwnership(fs.ownership)(book)) return false
  if (fs.sellerName && !matchesSeller(fs.sellerName)(book)) return false
  return true
}

// --- PHRASE ---

export type PhraseField = typeof phraseFieldOptions[number]
export const phraseFieldOptions = ['title', 'author'] as const
export const isPhraseField = (val: unknown): val is PhraseField => {
  return phraseFieldOptions.includes(val as any)
}

const matchesPhrase: Matches<
  Pick<BookFilters, 'phrase' | 'phraseField'>,
  BookItem
> =
  ({ phrase, phraseField }) =>
  (book) => {
    const fieldsToCheck: readonly PhraseField[] = isPhraseField(phraseField)
      ? [phraseField]
      : phraseFieldOptions

    return fieldsToCheck.some((key) =>
      includesCaseInsensitive(book[key], phrase || '')
    )
  }

// --- SUGGESTED BY ---

const matchesSuggestedBy: Matches<BookFilters['suggestedBy'], BookItem> =
  (suggestedBy) => (book) => {
    if (suggestedBy === OPTION.NONE) {
      return book.suggestedBy.length === 0
    }
    if (suggestedBy === OPTION.SOME) {
      return book.suggestedBy.length > 0
    }
    return book.suggestedBy?.includes(suggestedBy) ?? false
  }

// --- OWNERSHIP ---

const matchesOwnership: Matches<BookFilters['ownership'], BookItem> =
  (ownership) => (book) => {
    if (ownership === OPTION.NONE) {
      return book.volumes.every((vol) => vol.copies.length === 0)
    }
    if (ownership === OPTION.SOME) {
      return book.volumes.some((vol) => vol.copies.length > 0)
    }
    return book.volumes.some((vol) =>
      vol.copies.some((c) => c.ownership === ownership)
    )
  }

// --- SELLER ---

const matchesSeller: Matches<BookFilters['sellerName'], BookItem> =
  (sellerName) => (book) => {
    if (sellerName === OPTION.NONE) {
      return book.volumes.every((vol) =>
        vol.sellers.every((s) => !canBuy(s.stock))
      )
    }
    if (sellerName === OPTION.SOME) {
      return book.volumes.some((vol) =>
        vol.sellers.some((s) => canBuy(s.stock))
      )
    }
    return book.volumes.some((vol) => {
      const seller = vol.sellers.find((s) => s.sellerName === sellerName)
      return seller !== undefined && canBuy(seller.stock)
    })
  }
