import type { NextApiRequest, NextApiResponse } from 'next'
import type { Book } from '@prisma/client'
import { prisma } from 'prisma/client'
import { handleResponseError, type ResponseError } from 'utils/api/response'
import { bookCreateInputValidStruct, bookItemInclude } from 'domain/entity/Book'

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
        const { volumes, ...bookInput } = bookCreateInputValidStruct.create(
          req.body
        )
        const created = await prisma.book.create({
          data: {
            ...bookInput,
            volumes: {
              create: volumes.map(({ sellers, ...vol }) => ({
                ...vol,
                copies: {
                  create: [],
                },
                sellers: {
                  create: [],
                },
              })),
            },
          },
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
