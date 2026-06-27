import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    role: session.user.role,
  }
}