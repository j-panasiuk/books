import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchSellers } from './api'

export function useSellersQuery() {
  return useQuery(['sellers'], fetchSellers, {
    staleTime: 1000 * 60 * 60 * 12,
  })
}

export function useSellers() {
  const sellersQuery = useSellersQuery()
  return sellersQuery.data || []
}

export function useSellerNames() {
  const sellers = useSellers()

  const sellerNames = useMemo(() => {
    return sellers.map((s) => s.name)
  }, [sellers])

  return sellerNames
}
