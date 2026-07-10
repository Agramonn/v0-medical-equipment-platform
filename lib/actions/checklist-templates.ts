'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createChecklistTemplate(data: {
  equipmentModelId: string
  name: string
  serviceType: string
  estimatedMinutes: number
  items: {
    section: string
    description: string
    expectedValue?: string
    unit?: string
    isCritical: boolean
    requiresEvidence: boolean
    order: number
  }[]
}) {
  if (!data.name || !data.serviceType || !data.equipmentModelId) {
    throw new Error('Name, service type and model are required')
  }

  await db.checklistTemplate.create({
    data: {
      name: data.name,
      serviceType: data.serviceType as any,
      estimatedMinutes: data.estimatedMinutes,
      equipmentModelId: data.equipmentModelId,
      items: {
        create: data.items.map((item, index) => ({
          ...item,
          order: item.order ?? index + 1,
          expectedValue: item.expectedValue || null,
          unit: item.unit || null,
        })),
      },
    },
  })

  revalidatePath('/equipment')
}

export async function updateChecklistTemplateItem(
  itemId: string,
  data: {
    section: string
    description: string
    expectedValue?: string
    unit?: string
    isCritical: boolean
    requiresEvidence: boolean
  }
) {
  await db.checklistTemplateItem.update({
    where: { id: itemId },
    data: {
      ...data,
      expectedValue: data.expectedValue || null,
      unit: data.unit || null,
    },
  })
  revalidatePath('/equipment')
}

export async function addChecklistTemplateItem(
  templateId: string,
  data: {
    section: string
    description: string
    expectedValue?: string
    unit?: string
    isCritical: boolean
    requiresEvidence: boolean
  }
) {
  const lastItem = await db.checklistTemplateItem.findFirst({
    where: { templateId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  await db.checklistTemplateItem.create({
    data: {
      templateId,
      order: (lastItem?.order ?? 0) + 1,
      section: data.section,
      description: data.description,
      expectedValue: data.expectedValue || null,
      unit: data.unit || null,
      isCritical: data.isCritical,
      requiresEvidence: data.requiresEvidence,
    },
  })
  revalidatePath('/equipment')
}

export async function deleteChecklistTemplateItem(itemId: string) {
  await db.checklistTemplateItem.delete({ where: { id: itemId } })
  revalidatePath('/equipment')
}

export async function deleteChecklistTemplate(templateId: string) {
  await db.checklistTemplate.delete({ where: { id: templateId } })
  revalidatePath('/equipment')
}

export async function updateServiceOrderFields(
  orderId: string,
  data: {
    title: string
    priority: string
    assignedToId?: string
    scheduledAt?: string
    estimatedHours?: number
    description?: string
  }
) {
  await db.serviceOrder.update({
    where: { id: orderId },
    data: {
      title: data.title,
      priority: data.priority as any,
      assignedToId: data.assignedToId || null,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      estimatedHours: data.estimatedHours ?? null,
      description: data.description || null,
    },
  })
  revalidatePath('/service-orders')
  revalidatePath('/equipment')
}