import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
    // Necesario cuando la app corre detrás de un proxy (preview de v0, Vercel,
    // etc.). Hace que Auth.js confíe en los headers de host reenviados en lugar
    // de asumir localhost:3000, lo que corrige los callbackUrl del login.
    trustHost: true,
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
