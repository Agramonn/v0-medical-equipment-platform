'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

type CoverageInput = {
  equipmentModelId: string
  selectedUnitIds: string[]
  coverageType: string
  pmVisitsPerYear: number
  slaHours: number
  includesParts: boolean
  includesLabor: boolean
  notes?: string
}

export async function createContract(data: {
  contractNumber: string
  type: string
  clientId: string
  startDate: string
  endDate: string
  totalValue?: string
  currency: string
  notes?: string
  coverage: CoverageInput[]
}) {
  if (!data.contractNumber || !data.type || !data.clientId || !data.startDate || !data.endDate) {
    throw new Error('Missing required fields')
  }

  await db.contract.create({
    data: {
      contractNumber: data.contractNumber,
      type: data.type as any,
      status: 'ACTIVE',
      clientId: data.clientId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      totalValue: data.totalValue ? parseFloat(data.totalValue) : null,
      currency: data.currency || 'MXN',
      notes: data.notes || null,
      equipmentCoverage: {
        create: data.coverage.map((c) => ({
          equipmentModelId: c.equipmentModelId,
          coverageType: c.coverageType as any,
          pmVisitsPerYear: c.pmVisitsPerYear,
          slaHours: c.slaHours,
          includesParts: c.includesParts,
          includesLabor: c.includesLabor,
          notes: c.notes || null,
          // Crea los registros de unidades específicas
          units: {
            create: c.selectedUnitIds.map((equipmentId) => ({ equipmentId })),
          },
        })),
      },
    },
  })

  revalidatePath('/contracts')
}

export async function updateContractStatus(id: string, status: string) {
  await db.contract.update({
    where: { id },
    data: { status: status as any },
  })
  revalidatePath('/contracts')
}

export async function deleteContract(id: string) {
  try {
    await db.contract.delete({ where: { id } })
  } catch {
    throw new Error('Cannot delete contract with existing records.')
  }
  revalidatePath('/contracts')
}