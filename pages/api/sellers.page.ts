import type { NextApiRequest, NextApiResponse } from 'next'
import type { Seller } from '@prisma/client'
import { prisma } from 'prisma/client'
import { type ResponseError } from 'utils/api/response'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Seller[] | ResponseError>
) {
  switch (req.method) {
    case 'GET': {
      const sellers = await prisma.seller.findMany({})
      return res.status(200).json(sellers)
    }

    default: {
      return res
        .status(405)
        .json({ message: 'Method not allowed: ' + req.method })
    }
  }
}
