import type { NextApiRequest, NextApiResponse } from 'next'
import type { Book } from '@prisma/client'
import { prisma } from 'prisma/client'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Book | Book[] | { message: string }>
) {
  switch (req.method) {
    case 'GET': {
      console.log('fetching books...')
      const books = await prisma.book.findMany({})
      console.log('fetched books...', books.length)
      return res.status(200).json(books)
    }

    case 'POST': {
      console.log('creating book...', req.body)
      const created = await prisma.book.create({
        data: req.body,
      })
      console.log('created book...', created)
      return res.status(201).json(created)
    }

    default: {
      return res
        .status(405)
        .json({ message: 'Method not allowed: ' + req.method })
    }
  }
}
