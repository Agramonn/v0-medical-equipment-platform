import { PrismaClient } from './generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Make sure the Neon integration is connected and the environment variable is available.',
    )
  }
  const adapter = new PrismaNeon({ connectionString })
  return new PrismaClient({ adapter } as any)
}

// Lazily instantiate the client on first use so the connection string is read
// after environment variables are fully loaded (avoids dev-startup timing issues).
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = globalForPrisma.prisma ?? createPrismaClient()
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = client
    }
    const value = Reflect.get(client, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
