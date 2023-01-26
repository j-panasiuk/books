// Seeding DB with prisma, according to:
// @see https://www.prisma.io/docs/guides/database/seed-database

import { type Prisma, PrismaClient } from '@prisma/client'
import books from './books.json'

const prisma = new PrismaClient()

const seedData: Prisma.BookCreateInput[] = books.map((book) => ({
  author: book.author,
  title: book.title,
}))

async function seed() {
  // Cleanup existing database
  console.log('seed: cleaning up existing records...')
  await prisma.book.deleteMany({})

  console.log('seed: importing initial records from json file...')
  for (const data of seedData) {
    await prisma.book.create({ data })
  }

  console.log('seed: done.')
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
