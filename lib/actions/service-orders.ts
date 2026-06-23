'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createServiceOrder(formData: FormData) {
  const equipmentId = formData.get('equipmentId') as string
  const type = formData.get('type') as string
  const priority = formData.get('priority') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const scheduledAt = formData.get('scheduledAt') as string
  const estimatedHours = formData.get('estimatedHours') as string
  const assignedToId = formData.get('assignedToId') as string
  const serviceLocation = formData.get('serviceLocation') as string
  const objectives = formData.get('objectives') as string
  const activities = formData.get('activities') as string
  const safetyRequirements = formData.get('safetyRequirements') as string
  const customerNotes = formData.get('customerNotes') as string

  // TODO: replace with the real logged-in user once auth is implemented (Phase 2)
  const createdById = formData.get('createdById') as string

  if (!equipmentId || !type || !title || !createdById) {
    throw new Error('Missing required fields')
  }

  const equipment = await db.equipment.findUnique({
    where: { id: equipmentId },
    select: { organizationId: true },
  })

  if (!equipment) {
    throw new Error('Equipment not found')
  }

  await db.serviceOrder.create({
    data: {
      type: type as any,
      priority: (priority || 'MEDIUM') as any,
      title,
      description: description || null,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
      serviceLocation: serviceLocation || null,
      objectives: objectives || null,
      activities: activities || null,
      safetyRequirements: safetyRequirements || null,
      customerNotes: customerNotes || null,
      status: assignedToId ? 'ASSIGNED' : 'DRAFT',
      equipmentId,
      organizationId: equipment.organizationId,
      assignedToId: assignedToId || null,
      createdById,
      timelineEvents: {
        create: [
          {
            label: 'Service Order created',
            role: 'SUPERVISOR',
            byUserId: createdById,
          },
          ...(assignedToId
            ? [
                {
                  label: 'Service Order assigned',
                  role: 'SUPERVISOR' as const,
                  byUserId: createdById,
                },
              ]
            : []),
        ],
      },
    },
  })

  revalidatePath('/service-orders')
  revalidatePath(`/equipment/${equipmentId}`)
}

export async function updateServiceOrderStatus(
  orderId: string,
  newStatus: string,
  userId: string,
  options?: { note?: string; assignedToId?: string }
) {
  const order = await db.serviceOrder.findUnique({
    where: { id: orderId },
    select: { equipmentId: true },
  })

  if (!order) {
    throw new Error('Service order not found')
  }

  const statusLabels: Record<string, string> = {
    DRAFT: 'Marked as draft',
    ASSIGNED: 'Service Order assigned',
    IN_PROGRESS: 'Service started',
    PENDING_PARTS: 'Paused - waiting for parts',
    PENDING_CUSTOMER: 'Paused - waiting for customer',
    COMPLETED: 'Work submitted for review',
    PENDING_SIGNATURE: 'Completion approved',
    CLOSED: 'Service Order closed',
  }

  let label = statusLabels[newStatus] ?? `Status changed to ${newStatus}`

  if (newStatus === 'ASSIGNED' && options?.assignedToId) {
    const engineer = await db.user.findUnique({
      where: { id: options.assignedToId },
      select: { name: true },
    })
    label = `Assigned to ${engineer?.name ?? 'engineer'}`
  }

  await db.serviceOrder.update({
    where: { id: orderId },
    data: {
      status: newStatus as any,
      assignedToId: options?.assignedToId ?? undefined,
      completedAt: newStatus === 'COMPLETED' ? new Date() : undefined,
      closedAt: newStatus === 'CLOSED' ? new Date() : undefined,
      timelineEvents: {
        create: {
          label,
          role: 'SUPERVISOR',
          byUserId: userId,
          note: options?.note || null,
        },
      },
    },
  })

  revalidatePath('/service-orders')
  revalidatePath(`/equipment/${order.equipmentId}`)
}

export async function assignOrderToEngineer(orderId: string, engineerId: string) {
  const order = await db.serviceOrder.findUnique({
    where: { id: orderId },
    select: { equipmentId: true, createdById: true },
  })

  if (!order) {
    throw new Error('Service order not found')
  }

  await updateServiceOrderStatus(orderId, 'ASSIGNED', order.createdById, {
    assignedToId: engineerId,
  })
}

export async function cancelServiceOrder(orderId: string) {
  const order = await db.serviceOrder.findUnique({
    where: { id: orderId },
    select: { equipmentId: true, createdById: true },
  })

  if (!order) {
    throw new Error('Service order not found')
  }

  await updateServiceOrderStatus(orderId, 'CLOSED', order.createdById, {
    note: 'Service order cancelled',
  })
}