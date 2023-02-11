import type { NextApiRequest, NextApiResponse } from 'next'
import type { Book } from '@prisma/client'
import { prisma } from 'prisma/client'
import { handleResponseError, type ResponseError } from 'utils/api/response'
import { idStruct } from 'domain/attribute/id'
import { bookItemInclude, bookUpdateInputStruct } from 'domain/entity/Book'
import { range } from 'utils/range'
import { omit } from 'utils/omit'
import { log } from 'utils/log'

export default async function bookHandler(
  req: NextApiRequest,
  res: NextApiResponse<null | Book | ResponseError>
) {
  const id: Book['id'] = idStruct.create(req.query.bookId)

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
        const bookInput = bookUpdateInputStruct.create(req.body)

        log.info('tx: starting transaction...')
        const updated = await prisma.$transaction(async (tx) => {
          const { volumes, ...data } = bookInput

          const book = await tx.book.update({
            where: { id },
            data,
            include: { volumes: { include: { sellers: true } } },
          })

          const existingVolumes = book.volumes
          const incomingVolumes = volumes
          const totalVolumesRange = range(
            Math.max(existingVolumes.length, incomingVolumes.length)
          )

          for (const i of totalVolumesRange) {
            let no = i + 1
            let existing = existingVolumes[i]
            let incoming = incomingVolumes[i]
            if (existing && incoming) {
              // edit volume
              await tx.bookVolume.update({
                where: { bookId_no: { bookId: id, no } },
                data: {
                  title: incoming.title,
                  // sellers: incoming.sellers, // TODO update volume sellers
                },
              })
              log.info('tx: updated volume', no)
            } else if (existing) {
              // remove volume
              await tx.bookVolume.delete({
                where: { bookId_no: { bookId: id, no } },
              })
              log.info('tx: deleted volume', no)
            } else if (incoming) {
              // add volume
              const { sellers, ...bookVolumeInput } = incoming
              await tx.bookVolume.create({
                data: {
                  bookId: id,
                  ...bookVolumeInput,
                  sellers: {
                    create: sellers,
                  },
                },
              })
              log.info('tx: created volume', no)
            }
          }
          log.success('tx: successful')

          return omit(book, ['volumes']) as Book
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
