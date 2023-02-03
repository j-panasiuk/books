import type { NextApiRequest, NextApiResponse } from 'next'
import type { Book } from '@prisma/client'
import { prisma } from 'prisma/client'
import { toId } from 'domain/attribute/id'
import { handleResponseError, type ResponseError } from 'utils/api/response'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Book | ResponseError>
) {
  const id: Book['id'] = toId(req.query.bookId)

  switch (req.method) {
    case 'PUT': {
      try {
        const updated = await prisma.book.update({
          where: { id },
          data: req.body,
        })
        return res.status(200).json(updated)
      } catch (err) {
        const { status, ...responseError } = handleResponseError(err)
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
        const { status, ...responseError } = handleResponseError(err)
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
