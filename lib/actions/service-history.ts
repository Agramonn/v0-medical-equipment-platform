'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import type { PartUsed } from '@/lib/service-order-data'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Shape of a service order needed to derive a ServiceHistory record.
 * Kept narrow so callers only have to `select` these fields.
 */
export interface OrderForHistory {
  id: string
  type: any
  title: string
  findings: string | null
  rootCause: string | null
  correctiveActions: string | null
  recommendations: string | null
  laborHours: number | null
  partsUsed: unknown
  requiredParts: string[]
  closedAt: Date | null
  completedAt: Date | null
  equipmentId: string
  assignedToId: string | null
  createdById: string
}

/** Turn the order's `partsUsed` JSON (or fallback `requiredParts`) into readable strings. */
export function derivePartsReplaced(order: OrderForHistory): string[] {
  const parts = order.partsUsed as PartUsed[] | null | undefined

  if (Array.isArray(parts) && parts.length > 0) {
    return parts.map((p) => {
      const qty = p.quantity && p.quantity > 1 ? ` x${p.quantity}` : ''
      const num = p.partNumber ? ` (${p.partNumber})` : ''
      return `${p.description || p.partNumber || 'Part'}${num}${qty}`.trim()
    })
  }

  // Fallback: parts that were planned for the job
  return order.requiredParts ?? []
}

/** Build the `data` payload for a ServiceHistory row from a service order. */
export function buildHistoryData(order: OrderForHistory) {
  const detailParts = [
    order.rootCause ? `Root cause: ${order.rootCause}` : null,
    order.correctiveActions ? `Corrective actions: ${order.correctiveActions}` : null,
    order.recommendations ? `Recommendations: ${order.recommendations}` : null,
  ].filter(Boolean)

  return {
    type: order.type,
    date: order.closedAt ?? order.completedAt ?? new Date(),
    summary: order.findings?.trim() || order.title,
    detail: detailParts.length > 0 ? detailParts.join('\n') : null,
    partsReplaced: derivePartsReplaced(order),
    serviceTime: order.laborHours ?? null,
    findings: order.findings ?? null,
    equipmentId: order.equipmentId,
    engineerId: order.assignedToId ?? order.createdById,
    serviceOrderId: order.id,
  }
}

const ORDER_HISTORY_SELECT = {
  id: true,
  type: true,
  title: true,
  findings: true,
  rootCause: true,
  correctiveActions: true,
  recommendations: true,
  laborHours: true,
  partsUsed: true,
  requiredParts: true,
  closedAt: true,
  completedAt: true,
  equipmentId: true,
  assignedToId: true,
  createdById: true,
} as const

/**
 * Create a ServiceHistory record from a service order if one does not already
 * exist. Safe to call more than once — the unique `serviceOrderId` guards
 * against duplicates. Meant to be invoked from within order lifecycle actions.
 */
export async function createHistoryFromOrder(orderId: string) {
  const order = await db.serviceOrder.findUnique({
    where: { id: orderId },
    select: ORDER_HISTORY_SELECT,
  })

  if (!order) return

  const existing = await db.serviceHistory.findUnique({
    where: { serviceOrderId: order.id },
    select: { id: true },
  })
  if (existing) return

  await db.serviceHistory.create({
    data: buildHistoryData(order as OrderForHistory),
  })
}

// ---------------------------------------------------------------------------
// Manual entry (supervisors)
// ---------------------------------------------------------------------------

export async function createManualHistoryRecord(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized. Please sign in.')
  if (session.user.role !== 'SUPERVISOR') {
    throw new Error('Only supervisors can add manual history records.')
  }

  const equipmentId = formData.get('equipmentId') as string
  const engineerId = formData.get('engineerId') as string
  const type = formData.get('type') as string
  const dateRaw = formData.get('date') as string
  const summary = (formData.get('summary') as string)?.trim()
  const detail = (formData.get('detail') as string)?.trim()
  const findings = (formData.get('findings') as string)?.trim()
  const serviceTimeRaw = formData.get('serviceTime') as string
  const partsRaw = (formData.get('partsReplaced') as string) ?? ''

  if (!equipmentId) throw new Error('Please select the equipment.')
  if (!engineerId) throw new Error('Please select the engineer.')
  if (!type) throw new Error('Please select the service type.')
  if (!summary) throw new Error('A summary is required.')

  // Validate the referenced rows exist to avoid FK errors
  const [equipment, engineer] = await Promise.all([
    db.equipment.findUnique({ where: { id: equipmentId }, select: { id: true } }),
    db.user.findUnique({ where: { id: engineerId }, select: { id: true } }),
  ])
  if (!equipment) throw new Error('Selected equipment was not found.')
  if (!engineer) throw new Error('Selected engineer was not found.')

  const partsReplaced = partsRaw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)

  const serviceTime = serviceTimeRaw ? parseFloat(serviceTimeRaw) : null

  await db.serviceHistory.create({
    data: {
      type: type as any,
      date: dateRaw ? new Date(dateRaw) : new Date(),
      summary,
      detail: detail || null,
      findings: findings || null,
      partsReplaced,
      serviceTime: serviceTime !== null && !Number.isNaN(serviceTime) ? serviceTime : null,
      equipmentId,
      engineerId,
      // Manual records are not tied to a specific order
      serviceOrderId: null,
    },
  })

  revalidatePath('/history')
  revalidatePath(`/equipment/${equipmentId}`)
}

// ---------------------------------------------------------------------------
// Backfill (supervisors) — generate history for already-closed orders
// ---------------------------------------------------------------------------

export async function backfillServiceHistory() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized. Please sign in.')
  if (session.user.role !== 'SUPERVISOR') {
    throw new Error('Only supervisors can run the history backfill.')
  }

  const closedWithoutHistory = await db.serviceOrder.findMany({
    where: {
      status: 'CLOSED',
      serviceHistory: { is: null },
    },
    select: ORDER_HISTORY_SELECT,
  })

  let created = 0
  for (const order of closedWithoutHistory) {
    await db.serviceHistory.create({
      data: buildHistoryData(order as OrderForHistory),
    })
    created++
  }

  revalidatePath('/history')

  return { created }
}
