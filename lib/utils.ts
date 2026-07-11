import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PartUsed } from '@/lib/service-order-data'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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