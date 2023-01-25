// Seeding DB with prisma, according to:
// @see https://www.prisma.io/docs/guides/database/seed-database

import { Book, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  // Cleanup existing database
  await prisma.book.deleteMany({})

  for (const data of seedData) {
    await prisma.book.create({ data })
  }
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

const seedData: Pick<Book, 'author' | 'title'>[] = [
  { author: 'Tove Jansson', title: 'Muminki' },
  { author: 'Alexander Milne', title: 'Kubuś Puchatek' },
  { author: 'JRR Tolkien', title: 'Hobbit' },
  { author: 'CS Lewis', title: 'Narnia' },
  { author: 'JK Rowling', title: 'Harry Potter' },
]
