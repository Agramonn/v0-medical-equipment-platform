'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// ── Manuals ───────────────────────────────────────────────────────────────────

export async function createManual(data: {
  equipmentModelId: string
  name: string
  category: string
  pages?: number
  fileUrl?: string
}) {
  if (!data.name || !data.category || !data.equipmentModelId) {
    throw new Error('Name, category and model are required')
  }

  await db.manual.create({
    data: {
      equipmentModelId: data.equipmentModelId,
      name: data.name,
      category: data.category,
      pages: data.pages ?? null,
      fileUrl: data.fileUrl ?? null,
    },
  })

  revalidatePath(`/equipment`)
}

export async function updateManual(
  id: string,
  data: { name: string; category: string; pages?: number; fileUrl?: string }
) {
  await db.manual.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category,
      pages: data.pages ?? null,
      fileUrl: data.fileUrl ?? null,
    },
  })

  revalidatePath(`/equipment`)
}

export async function deleteManual(id: string) {
  await db.manual.delete({ where: { id } })
  revalidatePath(`/equipment`)
}

// ── Spare Parts ───────────────────────────────────────────────────────────────

export async function createSparePart(data: {
  equipmentModelId: string
  partNumber: string
  description: string
  manufacturer: string
  supplier?: string
  estimatedCost?: number
  stock: number
  reorderLevel: number
}) {
  if (!data.partNumber || !data.description || !data.manufacturer) {
    throw new Error('Part number, description and manufacturer are required')
  }

  await db.sparePart.create({
    data: {
      equipmentModelId: data.equipmentModelId,
      partNumber: data.partNumber,
      description: data.description,
      manufacturer: data.manufacturer,
      supplier: data.supplier ?? null,
      estimatedCost: data.estimatedCost ?? null,
      stock: data.stock,
      reorderLevel: data.reorderLevel,
    },
  })

  revalidatePath(`/equipment`)
}

export async function updateSparePart(
  id: string,
  data: {
    partNumber: string
    description: string
    manufacturer: string
    supplier?: string
    estimatedCost?: number
    stock: number
    reorderLevel: number
  }
) {
  await db.sparePart.update({
    where: { id },
    data: {
      partNumber: data.partNumber,
      description: data.description,
      manufacturer: data.manufacturer,
      supplier: data.supplier ?? null,
      estimatedCost: data.estimatedCost ?? null,
      stock: data.stock,
      reorderLevel: data.reorderLevel,
    },
  })

  revalidatePath(`/equipment`)
}

export async function deleteSparePart(id: string) {
  await db.sparePart.delete({ where: { id } })
  revalidatePath(`/equipment`)
}