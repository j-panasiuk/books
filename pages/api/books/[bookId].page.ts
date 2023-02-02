import type { NextApiRequest, NextApiResponse } from 'next'
import type { Book } from '@prisma/client'
import { prisma } from 'prisma/client'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Book | { message: string }>
) {
  // TODO assert bookId
  const id: Book['id'] = getId(req.query.bookId)

  switch (req.method) {
    case 'PUT': {
      console.log('updating book...', req.query.bookId)
      const updated = await prisma.book.update({
        where: { id },
        data: req.body,
      })
      console.log('updated book...', updated)
      return res.status(200).json(updated)
    }

    case 'DELETE': {
      console.log('deleting book...', req.query.bookId)
      const deleted = await prisma.book.delete({
        where: { id },
      })
      console.log('deleted book...', deleted)
      return res.status(200).json(deleted)
    }

    default: {
      return res
        .status(405)
        .json({ message: 'Method not allowed: ' + req.method })
    }
  }
}

// TODO move to some utils
function getId(id: string | string[] | undefined): string {
  if (typeof id === 'string') return id
  if (Array.isArray(id) && id[0]) return id[0]
  throw new Error('Missing id')
}
