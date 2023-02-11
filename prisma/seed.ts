// Seeding DB with prisma, according to:
// @see https://www.prisma.io/docs/guides/database/seed-database

import type { Prisma } from '@prisma/client'
import { log } from 'utils/log'
import { prisma } from './client'
import books from './books.json'

let sellers: Set<string> = new Set()
books.forEach((book) => {
  book.tomes.forEach((tome) => {
    if ('sellers' in tome && tome.sellers) {
      Object.keys(tome.sellers).forEach((sellerName) => {
        sellers.add(sellerName)
      })
    }
  })
})

const seedSellers: Prisma.SellerCreateInput[] = Array.from(sellers).map(
  (seller) => {
    const iconName = seller.split('_')[0]
    return {
      name: seller,
      icon: '/' + iconName + '.ico',
    }
  }
)

const seedBooks: Prisma.BookCreateInput[] = books.map((book) => {
  let input: Prisma.BookCreateInput = {
    author: book.author.trim(),
    title: book.title.trim(),
    createdAt: book.created_at,
    updatedAt: book.updated_at ?? undefined,
    suggestedBy: book.suggested_by?.join(', ').trim() ?? undefined,
  }

  input.volumes = {
    create: book.tomes.map((tome, i) => ({
      no: i + 1,
      title: undefined,
      sellers: {
        create:
          'sellers' in tome
            ? Object.entries(tome.sellers || {}).map(([k, v]) => ({
                sellerName: k,
                stock: v,
              }))
            : [],
      },
    })),
  }

  return input
})

async function seed() {
  // Cleanup existing database
  log.info('seed', 'cleaning up existing records...')
  await prisma.seller.deleteMany({})
  await prisma.book.deleteMany({})

  log.info('seed', 'importing sellers from json file...')
  for (const data of seedSellers) {
    await prisma.seller.create({ data })
  }

  log.info('seed', 'importing books from json file...')
  for (const data of seedBooks) {
    await prisma.book.create({ data })
  }

  log.success('seed', 'done')
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
