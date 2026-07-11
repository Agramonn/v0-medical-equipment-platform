'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { ChecklistResponse, ChecklistItemResponse } from '@/lib/types'
import { createHistoryFromOrder } from '@/lib/actions/service-history'

export async function createServiceOrder(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized. Please sign in.')
  }
  const createdById = session.user.id

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

  if (!equipmentId || !type || !title) {
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
  options?: { note?: string; assignedToId?: string }
) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized. Please sign in.')
  }
  const userId = session.user.id

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
    select: { equipmentId: true },
  })

  if (!order) {
    throw new Error('Service order not found')
  }

  await updateServiceOrderStatus(orderId, 'ASSIGNED', {
    assignedToId: engineerId,
  })
}

export async function cancelServiceOrder(orderId: string) {
  const order = await db.serviceOrder.findUnique({
    where: { id: orderId },
    select: { equipmentId: true },
  })

  if (!order) {
    throw new Error('Service order not found')
  }

  await updateServiceOrderStatus(orderId, 'CLOSED', {
    note: 'Service order cancelled',
  })
}

// ── Checklist ─────────────────────────────────────────────────────────────────

export async function saveChecklistProgress(
  orderId: string,
  items: ChecklistItemResponse[]
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const order = await db.serviceOrder.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      checklist: true,
      equipmentId: true,
      status: true,
    },
  })

  if (!order) throw new Error('Service order not found')

  if (!['ASSIGNED', 'IN_PROGRESS'].includes(order.status)) {
    throw new Error('Checklist can only be edited on assigned or in-progress orders')
  }

  // Merge with existing response — preserve previously saved items
  const existing = order.checklist as ChecklistResponse | null
  const updatedChecklist: ChecklistResponse = {
    templateId: existing?.templateId ?? '',
    templateVersion: existing?.templateVersion ?? '1.0',
    startedAt: existing?.startedAt ?? new Date().toISOString(),
    completedBy: session.user.id,
    items,
  }

  await db.serviceOrder.update({
    where: { id: orderId },
    data: {
      checklist: updatedChecklist as any,
      // Auto-advance to IN_PROGRESS when engineer starts filling checklist
      status: order.status === 'ASSIGNED' ? 'IN_PROGRESS' : undefined,
      timelineEvents: order.status === 'ASSIGNED'
        ? {
          create: {
            label: 'Service started — checklist in progress',
            role: 'ENGINEER',
            byUserId: session.user.id,
          },
        }
        : undefined,
    },
  })

  revalidatePath(`/equipment/${order.equipmentId}`)
  revalidatePath('/service-orders')
}

export async function completeChecklist(
  orderId: string,
  items: ChecklistItemResponse[],
  findings: string,
  laborHours: number
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const order = await db.serviceOrder.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      checklist: true,
      equipmentId: true,
      status: true,
      type: true,
    },
  })

  if (!order) throw new Error('Service order not found')

  // Validate all critical items are pass or fail — none pending
  const pendingItems = items.filter((i) => i.status === 'pending')
  if (pendingItems.length > 0) {
    throw new Error(
      `${pendingItems.length} checklist item(s) still pending. Complete all items before submitting.`
    )
  }

  const failedCritical = items.filter((i) => i.status === 'fail')

  const existing = order.checklist as ChecklistResponse | null
  const completedChecklist: ChecklistResponse = {
    templateId: existing?.templateId ?? '',
    templateVersion: existing?.templateVersion ?? '1.0',
    startedAt: existing?.startedAt ?? new Date().toISOString(),
    completedAt: new Date().toISOString(),
    completedBy: session.user.id,
    items,
  }

  // Corrective orders go to PENDING_CUSTOMER first
  // Preventive orders go directly to COMPLETED
  const nextStatus =
    order.type === 'CORRECTIVE_MAINTENANCE' ? 'PENDING_CUSTOMER' : 'COMPLETED'

  const timelineLabel =
    order.type === 'CORRECTIVE_MAINTENANCE'
      ? 'Corrective report submitted — awaiting customer confirmation'
      : failedCritical.length > 0
        ? `PM checklist submitted with ${failedCritical.length} failed item(s)`
        : 'PM checklist completed successfully'

  await db.serviceOrder.update({
    where: { id: orderId },
    data: {
      checklist: completedChecklist as any,
      findings: findings || null,
      laborHours: laborHours || null,
      completedAt: new Date(),
      status: nextStatus as any,
      timelineEvents: {
        create: {
          label: timelineLabel,
          role: 'ENGINEER',
          byUserId: session.user.id,
          note: failedCritical.length > 0
            ? `${failedCritical.length} critical item(s) failed`
            : null,
        },
      },
    },
  })

  revalidatePath(`/equipment/${order.equipmentId}`)
  revalidatePath('/service-orders')
}

export async function confirmCustomerAcceptance(
  orderId: string,
  confirmedByName: string
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const order = await db.serviceOrder.findUnique({
    where: { id: orderId },
    select: { id: true, equipmentId: true, status: true },
  })

  if (!order) throw new Error('Service order not found')

  if (order.status !== 'PENDING_CUSTOMER') {
    throw new Error('Order is not awaiting customer confirmation')
  }

  await db.serviceOrder.update({
    where: { id: orderId },
    data: {
      status: 'COMPLETED',
      customerSignedName: confirmedByName,
      customerSignedAt: new Date(),
      timelineEvents: {
        create: {
          label: `Customer acceptance confirmed by ${confirmedByName}`,
          role: 'SUPERVISOR',
          byUserId: session.user.id,
        },
      },
    },
  })

  revalidatePath('/service-orders')
  revalidatePath(`/equipment/${order.equipmentId}`)
}

export async function uploadSignedDocument(
  orderId: string,
  documentUrl: string,
  engineerName: string
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const order = await db.serviceOrder.findUnique({
    where: { id: orderId },
    select: { id: true, equipmentId: true, status: true },
  })

  if (!order) throw new Error('Service order not found')

  if (!['COMPLETED', 'PENDING_SIGNATURE'].includes(order.status)) {
    throw new Error('Document can only be uploaded on completed orders')
  }

  await db.serviceOrder.update({
    where: { id: orderId },
    data: {
      signedDocumentUrl: documentUrl,
      engineerSignedName: engineerName,
      engineerSignedAt: new Date(),
      status: 'PENDING_SIGNATURE',
      timelineEvents: {
        create: {
          label: 'Signed service report uploaded — awaiting supervisor approval',
          role: 'SUPERVISOR',
          byUserId: session.user.id,
          note: `Document: ${documentUrl}`,
        },
      },
    },
  })

  revalidatePath('/service-orders')
  revalidatePath(`/equipment/${order.equipmentId}`)
}

export async function approveAndCloseOrder(orderId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const order = await db.serviceOrder.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      equipmentId: true,
      status: true,
      signedDocumentUrl: true,
    },
  })

  if (!order) throw new Error('Service order not found')

  if (order.status !== 'PENDING_SIGNATURE') {
    throw new Error('Order must be in Pending Signature status to close')
  }

  if (!order.signedDocumentUrl) {
    throw new Error('Cannot close order without a signed document')
  }

  await db.serviceOrder.update({
    where: { id: orderId },
    data: {
      status: 'CLOSED',
      closedAt: new Date(),
      timelineEvents: {
        create: {
          label: 'Service Order approved and closed',
          role: 'SUPERVISOR',
          byUserId: session.user.id,
        },
      },
    },
  })

  // Update equipment last service date
  await db.equipment.update({
    where: { id: order.equipmentId },
    data: { lastServiceDate: new Date() },
  })

  // Generate the permanent technical history record from the closed order.
  // This is the direct link between Service Orders and the History section.
  await createHistoryFromOrder(order.id)

  revalidatePath('/service-orders')
  revalidatePath(`/equipment/${order.equipmentId}`)
  revalidatePath('/inventory')
  revalidatePath('/history')
}

// ── Auto-generate PM Service Orders ──────────────────────────────────────────

export async function generatePreventiveOrders(
  equipmentId: string,
  createdById: string
) {
  const equipment = await db.equipment.findUnique({
    where: { id: equipmentId },
    include: {
      equipmentModel: {
        include: {
          contractCoverage: {
            where: {
              contract: { status: 'ACTIVE' },
              pmVisitsPerYear: { gt: 0 },
            },
            include: {
              contract: {
                select: {
                  id: true,
                  endDate: true,
                  clientId: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!equipment) throw new Error('Equipment not found')

  const coverage = equipment.equipmentModel.contractCoverage
  if (coverage.length === 0) return // No active PM contract — skip

  const installDate = equipment.installDate
  const ordersCreated: string[] = []

  for (const cov of coverage) {
    const pmPerYear = cov.pmVisitsPerYear
    const monthsInterval = Math.floor(12 / pmPerYear)

    // Generate OS for each PM visit from install date to contract end
    const contractEnd = new Date(cov.contract.endDate)
    let scheduledDate = new Date(installDate)
    scheduledDate.setMonth(scheduledDate.getMonth() + monthsInterval)

    let visitNumber = 1

    while (scheduledDate <= contractEnd) {
      const order = await db.serviceOrder.create({
        data: {
          type: 'PREVENTIVE_MAINTENANCE',
          status: 'DRAFT',
          priority: 'MEDIUM',
          title: `PM Visit #${visitNumber} — ${equipment.equipmentModel.name}`,
          description: `Scheduled preventive maintenance visit #${visitNumber} of ${pmPerYear} per year.`,
          scheduledAt: scheduledDate,
          estimatedHours: cov.slaHours > 0 ? 2 : 1,
          serviceLocation: equipment.location,
          origin: 'PM_PLAN',
          equipmentId: equipment.id,
          organizationId: equipment.organizationId,
          createdById,
          timelineEvents: {
            create: {
              label: `PM Service Order auto-generated (Visit #${visitNumber})`,
              role: 'SYSTEM',
              byUserId: createdById,
            },
          },
        },
      })

      ordersCreated.push(order.id)
      visitNumber++
      scheduledDate = new Date(scheduledDate)
      scheduledDate.setMonth(scheduledDate.getMonth() + monthsInterval)
    }
  }

  revalidatePath('/service-orders')
  revalidatePath(`/equipment/${equipmentId}`)

  return ordersCreated
}
