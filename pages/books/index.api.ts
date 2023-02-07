import * as s from 'superstruct'
import type { Seller } from '@prisma/client'
import type { Book } from 'domain/entity/Book'
import type { Api, Search, Create, Update, Remove } from 'domain/entity/api'
import { bookStruct } from 'domain/entity/Book'
import { sellersStruct } from 'domain/entity/Seller'
import { request } from 'utils/api/request'
import { queryClient } from 'pages/queryClient'

// --- QUERIES ---

export const fetchBooks: Search<Book> = async () => {
  const responseData = await request.get('/api/books')
  s.assert(responseData, s.array(bookStruct))
  return responseData
}

export const fetchSellers = async (): Promise<Seller[]> => {
  const responseData = await request.get('/api/sellers')
  s.assert(responseData, sellersStruct)
  return responseData
}

// --- MUTATIONS ---

export const createBook: Create<Book> = async (input) => {
  const responseData = await request.post('/api/books', input)
  queryClient.invalidateQueries(['books'])
  s.assert(responseData, bookStruct)
  return responseData
}

export const updateBook: Update<Book> = async (id, input) => {
  const responseData = await request.put(`/api/books/${id}`, input)
  queryClient.invalidateQueries(['books'])
  s.assert(responseData, bookStruct)
  return responseData
}

export const removeBook: Remove = async (id) => {
  const responseData = await request.delete(`/api/books/${id}`)
  queryClient.invalidateQueries(['books'])
  return responseData
}

export const api: Api<Book> = {
  create: createBook,
  update: updateBook,
  remove: removeBook,
}
