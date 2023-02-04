import { assert } from 'superstruct'
import type { Book } from 'domain/entity/book/Book'
import type { Api, Search, Create, Update, Remove } from 'domain/entity/api'
import { bookSchema, booksSchema } from 'domain/entity/book/Book'
import { request } from 'utils/api/request'
import { queryClient } from 'pages/queryClient'

export const fetchBooks: Search<Book> = async () => {
  const responseData = await request.get('/api/books')
  assert(responseData, booksSchema)
  return responseData
}

export const createBook: Create<Book> = async (input) => {
  const responseData = await request.post('/api/books', input)
  queryClient.invalidateQueries(['books'])
  assert(responseData, bookSchema)
  return responseData
}

export const updateBook: Update<Book> = async (id, input) => {
  const responseData = await request.put(`/api/books/${id}`, input)
  queryClient.invalidateQueries(['books'])
  assert(responseData, bookSchema)
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
