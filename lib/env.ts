/**
 * Resuelve la cadena de conexión de PostgreSQL desde las distintas variables
 * de entorno posibles.
 *
 * - En local (VS Code) normalmente usarás `DATABASE_URL` en tu archivo `.env`.
 * - En v0 / Vercel, la integración de Neon expone las variables con prefijo
 *   `NEON_` (por ejemplo `NEON_DATABASE_URL`, `NEON_POSTGRES_PRISMA_URL`).
 *
 * Se prioriza `DATABASE_URL` para permitir sobreescribir el valor en local,
 * y se cae en cascada a las variables de la integración de Neon.
 */
export function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.NEON_DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.NEON_POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL ??
    process.env.NEON_POSTGRES_URL ??
    undefined
  )
}

/**
 * Igual que `getDatabaseUrl` pero lanza un error descriptivo si no encuentra
 * ninguna variable de conexión definida.
 */
export function requireDatabaseUrl(): string {
  const url = getDatabaseUrl()

  if (!url) {
    throw new Error(
      'No se encontró la cadena de conexión de la base de datos. ' +
        'Define DATABASE_URL en tu archivo .env (local) o conecta la ' +
        'integración de Neon en v0/Vercel (variable NEON_DATABASE_URL).',
    )
  }

  return url
}
