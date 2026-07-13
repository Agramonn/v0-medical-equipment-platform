import type { NextAuthConfig } from 'next-auth'

// El preview de v0 sirve la app dentro de un iframe cross-site sobre HTTPS.
// En ese contexto el navegador NO envía cookies `SameSite=Lax` (el default de
// Auth.js), lo que provoca un bucle de login: la sesión se crea pero el
// siguiente request no la ve. Detectamos el preview con V0_RUNTIME_URL (solo
// existe ahí, no en local) y usamos `SameSite=None; Secure` para que la cookie
// viaje dentro del iframe. En local (http://localhost) mantenemos los defaults.
const isV0Preview = !!process.env.V0_RUNTIME_URL

const iframeCookies: NextAuthConfig['cookies'] = isV0Preview
    ? {
          sessionToken: {
              name: '__Secure-authjs.session-token',
              options: { httpOnly: true, sameSite: 'none', path: '/', secure: true },
          },
          callbackUrl: {
              name: '__Secure-authjs.callback-url',
              options: { httpOnly: true, sameSite: 'none', path: '/', secure: true },
          },
          csrfToken: {
              name: '__Host-authjs.csrf-token',
              options: { httpOnly: true, sameSite: 'none', path: '/', secure: true },
          },
      }
    : undefined

export const authConfig: NextAuthConfig = {
    // Necesario cuando la app corre detrás de un proxy (preview de v0, Vercel,
    // etc.). Hace que Auth.js confíe en los headers de host reenviados en lugar
    // de asumir localhost:3000, lo que corrige los callbackUrl del login.
    trustHost: true,
    cookies: iframeCookies,
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnLogin = nextUrl.pathname.startsWith('/login')

            if (isOnLogin) {
                return !isLoggedIn
            }

            return isLoggedIn
        },
        jwt({ token, user }) {

            if (user) {
                token.role = user.role
                token.id = user.id
            }

            return token
        },
        session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id as string,
                role: token.role as 'SUPERVISOR' | 'ENGINEER',
            }
            return session
        },
    },
    providers: [], // Se completa en auth.ts (separamos config de providers por el middleware)
}
