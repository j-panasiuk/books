import type { Book } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import type { Api, Search, Create, Update, Remove } from 'domain/entity/api'
import { request } from 'utils/api/request'
import { queryClient } from 'pages/queryClient'

export const fetchBooks: Search<Serialized<Book>> = async () => {
  const responseData = await request.get('/api/books')
  return responseData as any // TODO schema validation
}

export const createBook: Create<Serialized<Book>> = async (input) => {
  const responseData = await request.post('/api/books', input)
  queryClient.invalidateQueries(['books'])
  return responseData as any // TODO schema validation
}

export const updateBook: Update<Serialized<Book>> = async (id, input) => {
  const responseData = await request.put(`/api/books/${id}`, input)
  queryClient.invalidateQueries(['books'])
  return responseData as any // TODO schema validation
}

export const removeBook: Remove = async (id) => {
  const responseData = await request.delete(`/api/books/${id}`)
  queryClient.invalidateQueries(['books'])
  return responseData as any // TODO schema validation
}

export const api: Api<Serialized<Book>> = {
  create: createBook,
  update: updateBook,
  remove: removeBook,
}
