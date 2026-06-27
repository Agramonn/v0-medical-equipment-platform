'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'


export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password' }
    }
    throw error
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/login' })
}