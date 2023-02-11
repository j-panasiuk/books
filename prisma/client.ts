import { PrismaClient } from '@prisma/client'

// Use a workaround to solve the issue with prisma spawning too many clients in development
// "warn(prisma-client) There are already 10 instances of Prisma Client actively running."
// @see
// https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

declare global {
  var prisma: PrismaClient
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export { prisma }
