import { PrismaClient } from '../lib/generated/prisma/client'
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

// Single, cached PrismaClient instance for the whole process.
//
// IMPORTANT: We cache in BOTH development and production. Creating a new
// PrismaClient (each one opens its own Neon connection pool + WebSocket) on
// every access leaks connections and memory, which can crash the process with
// "JavaScript heap out of memory" during `next build`/`next start`.
//
// In development we also stash it on `globalThis` so hot-reload doesn't create
// a new client on every file change.
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

// A thin proxy so the client is created lazily on first use (after env vars are
// loaded), but only ONCE. Every property access reuses the same instance.
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient()
    const value = Reflect.get(client, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
