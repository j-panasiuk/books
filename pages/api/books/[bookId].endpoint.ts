import type { NextApiRequest, NextApiResponse } from 'next'
import type { Book } from '@prisma/client'
import { prisma } from 'prisma/client'
import { handleResponseError, type ResponseError } from 'utils/api/response'
import { log } from 'utils/log'
import { omit } from 'utils/omit'
import { partitionByOperation } from 'utils/partition'
import { idStruct } from 'domain/attribute/id'
import { bookItemInclude, bookUpdateInputValidStruct } from 'domain/entity/Book'
import {
  type BookVolumeSellerStock,
  bookVolumeSellerStockStruct,
} from 'domain/entity/BookVolumeSellerStock'
import { type BookVolume, bookVolumeStruct } from 'domain/entity/BookVolume'

export default async function bookHandler(
  req: NextApiRequest,
  res: NextApiResponse<null | Book | ResponseError>
) {
  const bookId: Book['id'] = idStruct.create(req.query.bookId)

  switch (req.method) {
    case 'GET': {
      try {
        const book = await prisma.book.findUnique({
          where: { id: bookId },
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
        const bookInput = bookUpdateInputValidStruct.create(req.body)

        log.info('tx: starting transaction...')
        const updated = await prisma.$transaction(async (tx) => {
          const book = await tx.book.update({
            where: { id: bookId },
            data: omit(bookInput, ['volumes']),
            include: { volumes: { include: { sellers: true } } },
          })

          const volumes = partitionByOperation<BookVolume>(
            book.volumes.map((exs) => bookVolumeStruct.create(exs)),
            bookInput.volumes,
            (exs, inc) => exs.no === inc.no
          )

          // -> delete volume
          for (const { no } of volumes.toDelete) {
            await tx.bookVolume.delete({
              where: { bookId_no: { bookId, no } },
            })
            log.info('tx: deleted volume', no)
          }

          // -> create volume
          for (const { no, title, sellers } of volumes.toCreate) {
            await tx.bookVolume.create({
              data: {
                bookId,
                no,
                title,
                sellers: {
                  create: sellers,
                },
              },
            })
            log.info('tx: created volume', no)
          }

          // -> update volume
          for (const { no, title, sellers } of volumes.toUpdate) {
            await tx.bookVolume.update({
              where: { bookId_no: { bookId, no } },
              data: {
                title,
              },
            })
            log.info('tx: updated volume', no)

            const volume = book.volumes.find((v) => v.no === no)!
            const volumeSellers = partitionByOperation<BookVolumeSellerStock>(
              volume.sellers.map((exs) =>
                bookVolumeSellerStockStruct.create(exs)
              ),
              sellers,
              (exs, inc) => exs.sellerName === inc.sellerName
            )

            // -> delete volume seller
            for (const { sellerName } of volumeSellers.toDelete) {
              await tx.bookVolumeSellerStock.delete({
                where: {
                  bookId_volumeNo_sellerName: {
                    bookId,
                    volumeNo: no,
                    sellerName,
                  },
                },
              })
              log.info('tx: deleted volume seller stock', no, sellerName)
            }

            // -> create volume seller
            for (const { sellerName, stock } of volumeSellers.toCreate) {
              await tx.bookVolumeSellerStock.create({
                data: {
                  bookId,
                  volumeNo: no,
                  sellerName,
                  stock,
                },
              })
              log.info('tx: created volume seller stock', no, sellerName, stock)
            }

            // -> update volume seller
            for (const { sellerName, stock } of volumeSellers.toUpdate) {
              await tx.bookVolumeSellerStock.update({
                where: {
                  bookId_volumeNo_sellerName: {
                    bookId,
                    volumeNo: no,
                    sellerName,
                  },
                },
                data: {
                  stock,
                },
              })
              log.info('tx: updated volume seller stock', no, sellerName, stock)
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
          where: { id: bookId },
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
