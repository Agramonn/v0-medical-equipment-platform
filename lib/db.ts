import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { requireDatabaseUrl } from './env'

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaNeon({ connectionString: requireDatabaseUrl() })
  return new PrismaClient({ adapter })
}

// Reutilizamos un único PrismaClient en todo el proceso.
//
// Cada PrismaClient abre su propio pool de conexiones a Neon, así que crear uno
// por request (o, peor, por cada acceso a una propiedad) fuga conexiones y
// memoria, y puede tumbar el proceso con "JavaScript heap out of memory".
//
// Lo guardamos en `globalThis` para que:
//   - En desarrollo, el hot reload de Next.js no cree un cliente nuevo en cada
//     cambio de archivo.
//   - En producción, se reutilice la misma instancia durante toda la vida del
//     proceso.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

// Proxy perezoso: el PrismaClient se crea en el primer uso real (una consulta),
// no al importar el módulo. Así `next build` puede recolectar datos de página
// sin necesitar la base de datos, y seguimos reutilizando un único cliente.
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient()
    const value = Reflect.get(client, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
