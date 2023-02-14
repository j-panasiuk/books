import * as s from 'superstruct'
import type {
  Api,
  Search,
  Fetch,
  Create,
  Update,
  Remove,
} from 'domain/entity/api'
import {
  type Book,
  type BookItem,
  bookStruct,
  bookItemStruct,
} from 'domain/entity/Book'
import { request } from 'utils/api/request'
import { queryClient } from 'pages/queryClient'

// --- QUERIES ---

export const fetchBooks: Search<BookItem> = async () => {
  const responseData = await request.get('/api/books')
  s.assert(responseData, s.array(bookItemStruct))
  return responseData
}

export const fetchBook: Fetch<BookItem> = async (id) => {
  const responseData = await request.get(`/api/books/${id}`)
  s.assert(responseData, bookItemStruct)
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
