'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createEquipment(formData: FormData) {
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const manufacturer = formData.get('manufacturer') as string
  const model = formData.get('model') as string
  const serialNumber = formData.get('serialNumber') as string
  const assetNumber = formData.get('assetNumber') as string
  const department = formData.get('department') as string
  const location = formData.get('location') as string
  const organizationId = formData.get('organizationId') as string
  const contractType = formData.get('contractType') as string

  if (!name || !serialNumber || !assetNumber || !organizationId) {
    throw new Error('Faltan campos obligatorios')
  }

  try {
    await db.equipment.create({
      data: {
        name,
        category,
        manufacturer,
        model,
        serialNumber,
        assetNumber,
        department,
        location,
        organizationId,
        contractType: contractType || null,
        installDate: new Date(),
        purchaseDate: new Date(),
        status: 'OPERATIONAL',
        hoursUsed: 0,
        maxHours: 15000,
      },
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0]
      if (field === 'serialNumber') {
        throw new Error('El número de serie ya existe en el inventario')
      } else if (field === 'assetNumber') {
        throw new Error('El número de activo ya existe en el inventario')
      }
      throw new Error('El valor ya existe en el inventario')
    }
    if (error.message) {
      throw error
    }
    throw new Error('Error al crear el equipo')
  }

  revalidatePath('/inventory')
}

export async function deleteEquipment(id: string) {
  try {
    await db.equipment.delete({
      where: { id },
    })
  } catch (error) {
    throw new Error(
      'Cannot delete equipment with existing service orders or history. Remove related records first.'
    )
  }

  revalidatePath('/inventory')
}

export async function updateEquipment(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const manufacturer = formData.get('manufacturer') as string
  const model = formData.get('model') as string
  const serialNumber = formData.get('serialNumber') as string
  const assetNumber = formData.get('assetNumber') as string
  const department = formData.get('department') as string
  const location = formData.get('location') as string
  const organizationId = formData.get('organizationId') as string
  const contractType = formData.get('contractType') as string
  const status = formData.get('status') as string

  if (!name || !serialNumber || !assetNumber || !organizationId) {
    throw new Error('Missing required fields')
  }

  try {
    await db.equipment.update({
      where: { id },
      data: {
        name,
        category,
        manufacturer,
        model,
        serialNumber,
        assetNumber,
        department,
        location,
        organizationId,
        contractType: contractType || null,
        status: status as any,
      },
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0]
      if (field === 'serialNumber') {
        throw new Error('El número de serie ya existe en el inventario')
      } else if (field === 'assetNumber') {
        throw new Error('El número de activo ya existe en el inventario')
      }
      throw new Error('El valor ya existe en el inventario')
    }
    if (error.message) {
      throw error
    }
    throw new Error('Error al actualizar el equipo')
  }

  revalidatePath('/inventory')
}