'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createOrganization(data: {
  name: string
  type: string
  address?: string
  city: string
  state: string
  phone?: string
  email?: string
  website?: string
  notes?: string
}) {
  if (!data.name || !data.city || !data.state) {
    throw new Error('Name, city and state are required')
  }

  await db.organization.create({
    data: {
      name: data.name,
      type: data.type as any,
      address: data.address || null,
      city: data.city,
      state: data.state,
      phone: data.phone || null,
      email: data.email || null,
      website: data.website || null,
      notes: data.notes || null,
    },
  })

  revalidatePath('/organizations')
}

export async function updateOrganization(id: string, data: {
  name: string
  type: string
  address?: string
  city: string
  state: string
  phone?: string
  email?: string
  website?: string
  notes?: string
}) {
  await db.organization.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type as any,
      address: data.address || null,
      city: data.city,
      state: data.state,
      phone: data.phone || null,
      email: data.email || null,
      website: data.website || null,
      notes: data.notes || null,
    },
  })

  revalidatePath('/organizations')
}

export async function deleteOrganization(id: string) {
  try {
    await db.organization.delete({ where: { id } })
  } catch {
    throw new Error(
      'Cannot delete organization with existing equipment or contracts.'
    )
  }
  revalidatePath('/organizations')
}

export async function createContact(organizationId: string, data: {
  name: string
  role: string
  email?: string
  phone?: string
  isPrimary: boolean
}) {
  if (!data.name || !data.role) {
    throw new Error('Name and role are required')
  }

  // Si es primario, quita el primary de los existentes
  if (data.isPrimary) {
    await db.organizationContact.updateMany({
      where: { organizationId },
      data: { isPrimary: false },
    })
  }

  await db.organizationContact.create({
    data: {
      organizationId,
      name: data.name,
      role: data.role,
      email: data.email || null,
      phone: data.phone || null,
      isPrimary: data.isPrimary,
    },
  })

  revalidatePath('/organizations')
}

export async function deleteContact(id: string) {
  await db.organizationContact.delete({ where: { id } })
  revalidatePath('/organizations')
}