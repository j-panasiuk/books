import type { NextApiRequest, NextApiResponse } from 'next'
import type { Book } from '@prisma/client'
import { prisma } from 'prisma/client'
import { handleResponseError, type ResponseError } from 'utils/api/response'
import { toId } from 'domain/attribute/id'
import { bookItemInclude, bookUpdateInputStruct } from 'domain/entity/Book'

export default async function bookHandler(
  req: NextApiRequest,
  res: NextApiResponse<null | Book | ResponseError>
) {
  const id: Book['id'] = toId(req.query.bookId)

  switch (req.method) {
    case 'GET': {
      try {
        const book = await prisma.book.findUnique({
          where: { id },
          include: bookItemInclude,
        })
        return res.status(200).json(book)
      } catch (err) {
        const { status, ...responseError } = await handleResponseError(err)
        return res.status(status).json(responseError)
      }
    }

    case 'PUT': {
      try {
        const updateInput = bookUpdateInputStruct.create(req.body)
        const updated = await prisma.book.update({
          where: { id },
          data: updateInput,
        })
        return res.status(200).json(updated)
      } catch (err) {
        const { status, ...responseError } = await handleResponseError(err)
        return res.status(status).json(responseError)
      }
    }

    case 'DELETE': {
      try {
        const deleted = await prisma.book.delete({
          where: { id },
        })
        return res.status(200).json(deleted)
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
