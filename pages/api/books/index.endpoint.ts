import type { NextApiRequest, NextApiResponse } from 'next'
import type { Book } from '@prisma/client'
import { prisma } from 'prisma/client'
import { handleResponseError, type ResponseError } from 'utils/api/response'
import { bookCreateInputStruct, bookItemInclude } from 'domain/entity/Book'

export default async function booksHandler(
  req: NextApiRequest,
  res: NextApiResponse<Book | Book[] | ResponseError>
) {
  switch (req.method) {
    case 'GET': {
      const books = await prisma.book.findMany({
        include: bookItemInclude,
      })
      return res.status(200).json(books)
    }

    case 'POST': {
      try {
        const createInput = bookCreateInputStruct.create(req.body)
        const created = await prisma.book.create({
          data: createInput,
        })
        return res.status(201).json(created)
      } catch (err) {
        const { status, ...responseError } = await handleResponseError(err)
        return res.status(status).json(responseError)
      }
    }

    default: {
      return res
        .status(405)
        .json({ message: 'Method not allowed: ' + req.method })
    }
  }
}
