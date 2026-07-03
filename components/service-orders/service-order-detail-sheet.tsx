'use client'

import * as React from 'react'
import {
  CheckCircle2,
  ClipboardList,
  FileSignature,
  FileText,
  Loader2,
  MessageSquareWarning,
  Package,
  PenLine,
  ShieldCheck,
  UserCog,
  Wrench,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ServiceOrderWithRelations } from '@/lib/types'
import { updateServiceOrderStatus } from '@/lib/actions/service-orders'
import { PriorityBadge, StatusBadge, TypeBadge } from './service-order-badges'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Status = ServiceOrderWithRelations['status']

const openStatuses: Status[] = [
  'DRAFT',
  'ASSIGNED',
  'IN_PROGRESS',
  'PENDING_PARTS',
  'PENDING_CUSTOMER',
  'COMPLETED',
  'PENDING_SIGNATURE',
]

function SectionField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm">{value}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-right font-medium">{value}</span>
    </div>
  )
}

type EngineerOption = { id: string; name: string }

export function ServiceOrderDetailSheet({
  order,
  open,
  onOpenChange,
  currentUserId,
  engineers,
}: {
  order: ServiceOrderWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: string
  engineers: EngineerOption[]
}) {
  const [pendingAction, setPendingAction] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedEngineerId, setSelectedEngineerId] = React.useState('')

  if (!order) return null

  const hasDocumentation =
    order.findings ||
    order.activities ||
    order.requiredParts.length > 0

  const isOpen = openStatuses.includes(order.status)

  async function handleStatusChange(
    newStatus: Status,
    actionKey: string,
    options?: { assignedToId?: string }
  ) {
    setError(null)
    setPendingAction(actionKey)
    try {
      await updateServiceOrderStatus(order!.id, newStatus, currentUserId, options)
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update status')
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-xl">
        <SheetHeader className="shrink-0 border-b p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            <span className="font-mono text-sm">{order.orderNumber.slice(0, 12)}</span>
          </SheetTitle>
          <SheetDescription>
            Official service record · {order.equipment.equipmentModel.name}
          </SheetDescription>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={order.status} />
            <PriorityBadge priority={order.priority} />
            <TypeBadge type={order.type} />
          </div>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-5 p-6">
            {/* Equipment snapshot */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Package className="size-4" />
                  Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InfoRow label="Name" value={order.equipment.equipmentModel.name} />
                <InfoRow
                  label="Manufacturer / Model"
                  value={`${order.equipment.equipmentModel.manufacturer} ${order.equipment.equipmentModel.model}`}
                />
                <InfoRow
                  label="Serial"
                  value={<span className="font-mono">{order.equipment.serialNumber}</span>}
                />
                <InfoRow
                  label="Asset"
                  value={<span className="font-mono">{order.equipment.assetNumber}</span>}
                />
                <InfoRow label="Hospital" value={order.organization.name} />
                <InfoRow label="Department" value={order.equipment.department} />
              </CardContent>
            </Card>

            {/* Service details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Wrench className="size-4" />
                  Service Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InfoRow
                  label="Assigned Engineer"
                  value={order.assignedTo?.name ?? 'Unassigned'}
                />
                <InfoRow
                  label="Scheduled"
                  value={order.scheduledAt?.toLocaleDateString('en-US') ?? '—'}
                />
                <InfoRow
                  label="Estimated Hours"
                  value={order.estimatedHours ? `${order.estimatedHours} h` : '—'}
                />
                <InfoRow label="Location" value={order.serviceLocation ?? '—'} />
                <InfoRow label="Created By" value={order.createdBy.name} />
              </CardContent>
            </Card>

            {/* Scope of work */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <ClipboardList className="size-4" />
                  Scope of Work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <SectionField label="Objectives" value={order.objectives} />
                <SectionField label="Activities" value={order.activities} />
                <SectionField label="Safety Requirements" value={order.safetyRequirements} />
                <SectionField label="Customer Notes" value={order.customerNotes} />
                {order.requiredParts.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Required Parts
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {order.requiredParts.map((p) => (
                        <Badge key={p} variant="secondary" className="font-normal">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {!order.objectives && !order.activities && order.requiredParts.length === 0 && (
                  <p className="text-sm text-muted-foreground">No scope of work defined.</p>
                )}
              </CardContent>
            </Card>

            {/* Documentation / findings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="size-4" />
                  Service Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hasDocumentation ? (
                  <>
                    <SectionField label="Findings" value={order.findings} />
                    <div className="flex flex-wrap gap-4 pt-1 text-sm text-muted-foreground">
                      {order.laborHours !== null && (
                        <span className="flex items-center gap-1">
                          <Wrench className="size-3.5" />
                          {order.laborHours} h labor
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No documentation submitted yet. The engineer will add findings
                    during service execution.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timelineEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="size-3.5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.byUser?.name ?? 'System'} ·{' '}
                          {event.createdAt.toLocaleString('en-US')}
                        </p>
                        {event.note && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{event.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {order.timelineEvents.length === 0 && (
                    <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Supervisor actions */}
        <div className="shrink-0 border-t bg-muted/30 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Supervisor Actions
          </p>
          {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
          <div className="grid grid-cols-2 gap-2">
            {order.status === 'DRAFT' && (
              <div className="col-span-2 space-y-2">
                <Select value={selectedEngineerId} onValueChange={setSelectedEngineerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select engineer to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {engineers.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!selectedEngineerId || pendingAction !== null}
                  onClick={() =>
                    handleStatusChange('ASSIGNED', 'assign', { assignedToId: selectedEngineerId })
                  }
                >
                  {pendingAction === 'assign' ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <UserCog className="mr-2 size-4" />
                  )}
                  Assign Engineer
                </Button>
              </div>
            )}
            {order.status === 'ASSIGNED' && (
              <Button
                size="sm"
                className="col-span-2"
                onClick={() => handleStatusChange('IN_PROGRESS', 'start')}
                disabled={pendingAction !== null}
              >
                {pendingAction === 'start' ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Wrench className="mr-2 size-4" />
                )}
                Mark In Progress
              </Button>
            )}

            {order.status === 'IN_PROGRESS' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleStatusChange('COMPLETED', 'complete')}
                  disabled={pendingAction !== null}
                >
                  {pendingAction === 'complete' ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 size-4" />
                  )}
                  Mark Completed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('PENDING_PARTS', 'pending-parts')}
                  disabled={pendingAction !== null}
                >
                  {pendingAction === 'pending-parts' ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <MessageSquareWarning className="mr-2 size-4" />
                  )}
                  Pause: Pending Parts
                </Button>
              </>
            )}

            {(order.status === 'PENDING_PARTS' || order.status === 'PENDING_CUSTOMER') && (
              <Button
                size="sm"
                className="col-span-2"
                onClick={() => handleStatusChange('IN_PROGRESS', 'resume')}
                disabled={pendingAction !== null}
              >
                {pendingAction === 'resume' ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Wrench className="mr-2 size-4" />
                )}
                Resume Work
              </Button>
            )}

            {order.status === 'COMPLETED' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleStatusChange('PENDING_SIGNATURE', 'approve')}
                  disabled={pendingAction !== null}
                >
                  {pendingAction === 'approve' ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 size-4" />
                  )}
                  Approve Completion
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('PENDING_CUSTOMER', 'request-info')}
                  disabled={pendingAction !== null}
                >
                  {pendingAction === 'request-info' ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <MessageSquareWarning className="mr-2 size-4" />
                  )}
                  Request More Info
                </Button>
              </>
            )}

            {order.status === 'PENDING_SIGNATURE' && (
              <Button
                size="sm"
                className="col-span-2"
                onClick={() => handleStatusChange('CLOSED', 'close')}
                disabled={pendingAction !== null}
              >
                {pendingAction === 'close' ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <PenLine className="mr-2 size-4" />
                )}
                Close Order
              </Button>
            )}

            {order.status === 'CLOSED' && (
              <p className="col-span-2 text-center text-sm text-muted-foreground">
                This order is closed and archived.
              </p>
            )}

            <Button variant="outline" size="sm" className="col-span-2" disabled>
              <FileText className="mr-2 size-4" />
              Generate PDF Report (coming soon)
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}