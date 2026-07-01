'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

type UnitInput = {
  serialNumber: string
  assetNumber: string
}

type CreateEquipmentInput = {
  // Opción A: modelo existente
  equipmentModelId?: string

  // Opción B: modelo nuevo
  modelName?: string
  manufacturer?: string
  model?: string
  category?: string

  // Datos compartidos por todas las unidades
  organizationId: string
  department: string
  location: string
  contractType?: string

  // Una o más unidades
  units: UnitInput[]
}

export async function createEquipmentWithUnits(input: CreateEquipmentInput) {
  const {
    equipmentModelId,
    modelName,
    manufacturer,
    model,
    category,
    organizationId,
    department,
    location,
    contractType,
    units,
  } = input

  if (!organizationId || !department || units.length === 0) {
    throw new Error('Missing required fields')
  }

  // Paso 1: Obtener o crear el modelo
  let resolvedModelId = equipmentModelId

  if (!resolvedModelId) {
    // Opción B: crear el modelo nuevo al vuelo
    if (!modelName || !manufacturer || !model || !category) {
      throw new Error('Model details are required when creating a new model')
    }

    const newModel = await db.equipmentModel.create({
      data: {
        name: modelName,
        manufacturer,
        model,
        category,
      },
    })
    resolvedModelId = newModel.id
  }

  // Paso 2: Crear todas las unidades en paralelo
  const results = await Promise.allSettled(
    units.map((unit) =>
      db.equipment.create({
        data: {
          serialNumber: unit.serialNumber,
          assetNumber: unit.assetNumber,
          department,
          location: location || '',
          organizationId,
          contractType: contractType || null,
          equipmentModelId: resolvedModelId!,
          installDate: new Date(),
          purchaseDate: new Date(),
          status: 'OPERATIONAL',
          hoursUsed: 0,
          maxHours: 15000,
        },
      })
    )
  )

  // Reportar errores individuales por unidad (ej. serial duplicado)
  const errors: string[] = []
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const error = result.reason
      if (error?.code === 'P2002') {
        const target = error.meta?.target
        const fieldStr = Array.isArray(target) ? target.join(',') : String(target ?? '')

        if (fieldStr.includes('serialNumber')) {
          errors.push(`Unit ${index + 1}: Serial number "${units[index].serialNumber}" already exists`)
        } else if (fieldStr.includes('assetNumber')) {
          errors.push(`Unit ${index + 1}: Asset number "${units[index].assetNumber}" already exists`)
        } else {
          errors.push(`Unit ${index + 1}: Duplicate serial or asset number`)
        }
      }
    }
  })

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
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
  const serialNumber = formData.get('serialNumber') as string
  const assetNumber = formData.get('assetNumber') as string
  const department = formData.get('department') as string
  const location = formData.get('location') as string
  const organizationId = formData.get('organizationId') as string
  const contractType = formData.get('contractType') as string
  const status = formData.get('status') as string

  if (!serialNumber || !assetNumber || !organizationId || !department) {
    throw new Error('Missing required fields')
  }

  try {
    await db.equipment.update({
      where: { id },
      data: {
        serialNumber,
        assetNumber,
        department,
        location: location || '',
        organizationId,
        contractType: contractType || null,
        status: status as any,
      },
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      const target = error.meta?.target
      const fieldStr = Array.isArray(target) ? target.join(',') : String(target ?? '')
      if (fieldStr.includes('serialNumber')) {
        throw new Error('Serial number already exists in inventory')
      } else if (fieldStr.includes('assetNumber')) {
        throw new Error('Asset number already exists in inventory')
      }
      throw new Error('Duplicate value in inventory')
    }
    throw new Error(error.message ?? 'Failed to update equipment')
  }

  revalidatePath('/inventory')
}