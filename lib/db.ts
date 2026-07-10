import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Connect the Neon integration and make sure the environment variable is available.',
    )
  }

  const adapter = new PrismaNeon({ connectionString })
  return new PrismaClient({ adapter })
}

// Reuse a single PrismaClient across the whole process.
//
// Each PrismaClient opens its own Neon connection pool, so creating one per
// request (or, worse, per property access) leaks connections and memory and
// can crash the process with "JavaScript heap out of memory".
//
// In development we also stash the instance on `globalThis` so Next.js hot
// reload does not spin up a new client on every file change.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
