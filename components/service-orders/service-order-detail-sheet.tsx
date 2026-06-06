'use client'

import * as React from 'react'
import {
  CheckCircle2,
  ClipboardList,
  FileSignature,
  FileText,
  Gauge,
  Image as ImageIcon,
  MessageSquareWarning,
  Package,
  PenLine,
  ShieldCheck,
  UserCog,
  Wrench,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  completionRequirementLabels,
  openStatuses,
  type CompletionRequirements,
  type ServiceOrder,
} from '@/lib/service-order-data'
import { PriorityBadge, StatusBadge, TypeBadge } from './service-order-badges'

function SectionField({ label, value }: { label: string; value?: string }) {
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
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

export function ServiceOrderDetailSheet({
  order,
  open,
  onOpenChange,
}: {
  order: ServiceOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!order) return null

  const doc = order.documentation
  const hasDocumentation =
    doc.findings ||
    doc.rootCause ||
    doc.correctiveActions ||
    doc.recommendations ||
    doc.partsUsed.length > 0 ||
    doc.measurements.length > 0

  const isOpen = openStatuses.includes(order.status)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-hidden p-0 sm:max-w-xl">
        <SheetHeader className="border-b p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            <span className="font-mono">{order.id}</span>
          </SheetTitle>
          <SheetDescription>
            Official service record · {order.equipment.name}
          </SheetDescription>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={order.status} />
            <PriorityBadge priority={order.priority} />
            <TypeBadge type={order.type} />
            {order.ticketId && (
              <Badge variant="outline" className="font-mono">
                {order.ticketId}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-5 p-6">
            {/* Equipment snapshot */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Package className="size-4" />
                  Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <InfoRow label="Name" value={order.equipment.name} />
                <InfoRow
                  label="Manufacturer / Model"
                  value={`${order.equipment.manufacturer} ${order.equipment.model}`}
                />
                <InfoRow
                  label="Serial"
                  value={<span className="font-mono">{order.equipment.serialNumber}</span>}
                />
                <InfoRow
                  label="Asset"
                  value={<span className="font-mono">{order.equipment.assetNumber}</span>}
                />
                <InfoRow
                  label="Location"
                  value={`${order.equipment.hospital} · ${order.equipment.department}`}
                />
                <InfoRow
                  label="Contract"
                  value={<Badge variant="secondary">{order.equipment.contract}</Badge>}
                />
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
              <CardContent className="grid gap-2 text-sm">
                <InfoRow
                  label="Assigned Engineer"
                  value={order.assignedEngineer ?? 'Unassigned'}
                />
                <InfoRow label="Scheduled" value={order.scheduledDate} />
                <InfoRow label="Estimated Hours" value={`${order.estimatedHours} h`} />
                <InfoRow label="Service Location" value={order.serviceLocation} />
                <InfoRow label="Created By" value={order.createdBy} />
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
                <SectionField label="Objectives" value={order.scope.objectives} />
                <SectionField label="Activities" value={order.scope.activities} />
                <SectionField
                  label="Safety Requirements"
                  value={order.scope.safetyRequirements}
                />
                {order.scope.requiredParts.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Required Parts
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {order.scope.requiredParts.map((p) => (
                        <Badge key={p} variant="secondary" className="font-normal">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {order.scope.checklist.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Checklist
                    </p>
                    {order.scope.checklist.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        <CheckCircle2
                          className={
                            item.done
                              ? 'size-4 text-success'
                              : 'size-4 text-muted-foreground/40'
                          }
                        />
                        <span className={item.done ? '' : 'text-muted-foreground'}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Completion requirements */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="size-4" />
                  Required Evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {(Object.keys(completionRequirementLabels) as (keyof CompletionRequirements)[])
                  .filter((key) => order.requirements[key])
                  .map((key) => (
                    <Badge key={key} variant="outline">
                      {completionRequirementLabels[key].replace(' Required', '')}
                    </Badge>
                  ))}
              </CardContent>
            </Card>

            {/* Service documentation / evidence */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="size-4" />
                  Service Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hasDocumentation ? (
                  <>
                    <SectionField label="Findings" value={doc.findings} />
                    <SectionField label="Root Cause" value={doc.rootCause} />
                    <SectionField
                      label="Corrective Actions"
                      value={doc.correctiveActions}
                    />
                    <SectionField label="Recommendations" value={doc.recommendations} />

                    {doc.measurements.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Measurements
                        </p>
                        {doc.measurements.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between rounded-md border px-3 py-1.5 text-sm"
                          >
                            <span className="flex items-center gap-2">
                              <Gauge className="size-3.5 text-muted-foreground" />
                              {m.label}
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="font-mono">
                                {m.value} {m.unit}
                              </span>
                              <Badge
                                className={
                                  m.pass
                                    ? 'bg-success/10 text-success'
                                    : 'bg-destructive/10 text-destructive'
                                }
                              >
                                {m.pass ? 'Pass' : 'Fail'}
                              </Badge>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {doc.partsUsed.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Parts Used
                        </p>
                        {doc.partsUsed.map((p) => (
                          <div
                            key={p.partNumber}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>{p.description}</span>
                            <span className="text-muted-foreground">
                              <span className="font-mono">{p.partNumber}</span> × {p.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 pt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Wrench className="size-3.5" />
                        {doc.laborHours} h labor
                      </span>
                      <span className="flex items-center gap-1">
                        <ImageIcon className="size-3.5" />
                        {doc.photos.length} photos
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No documentation submitted yet. The engineer will add findings,
                    measurements, parts and photos during service.
                  </p>
                )}

                {/* Signatures */}
                {(doc.engineerSignature || doc.customerSignature) && (
                  <>
                    <Separator />
                    <div className="grid gap-3 sm:grid-cols-2">
                      {doc.engineerSignature && (
                        <div className="rounded-lg border p-3">
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <FileSignature className="size-3.5" />
                            Engineer
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {doc.engineerSignature.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.engineerSignature.signedAt}
                          </p>
                        </div>
                      )}
                      {doc.customerSignature && (
                        <div className="rounded-lg border p-3">
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <FileSignature className="size-3.5" />
                            Customer
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {doc.customerSignature.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.customerSignature.role} · {doc.customerSignature.signedAt}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
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
                  {order.timeline.map((event) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="size-3.5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.by} · {event.at}
                        </p>
                        {event.note && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {event.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Supervisor actions */}
        <div className="border-t bg-muted/30 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Supervisor Actions
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" disabled={!isOpen}>
              <UserCog className="mr-2 size-4" />
              {order.assignedEngineer ? 'Reassign' : 'Assign'} Engineer
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={order.status !== 'completed'}
            >
              <MessageSquareWarning className="mr-2 size-4" />
              Request Info
            </Button>
            <Button size="sm" disabled={order.status !== 'completed'}>
              <CheckCircle2 className="mr-2 size-4" />
              Approve Completion
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={order.status !== 'pending-signature'}
            >
              <PenLine className="mr-2 size-4" />
              Close Order
            </Button>
            <Button variant="outline" size="sm" className="col-span-2">
              <FileText className="mr-2 size-4" />
              Generate PDF Report
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
