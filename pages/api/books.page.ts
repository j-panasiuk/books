import type { NextApiRequest, NextApiResponse } from 'next'
import type { Book } from '@prisma/client'
import { prisma } from 'prisma/client'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Book[]>
) {
  const books = await prisma.book.findMany({})
  res.status(200).json(books)
}

