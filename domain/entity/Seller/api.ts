import * as s from 'superstruct'
import { request } from 'utils/api/request'
import { type Seller, sellerStruct } from '.'

// --- QUERIES ---

export const fetchSellers = async (): Promise<Seller[]> => {
  const responseData = await request.get('/api/sellers')
  s.assert(responseData, s.array(sellerStruct))
  return responseData
}
