'use client'

import * as React from 'react'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileSignature,
  FileText,
  Loader2,
  MessageSquareWarning,
  Package,
  PenLine,
  Upload,
  UserCog,
  Wrench,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  ServiceOrderWithRelations,
  ChecklistTemplate,
  ChecklistItemResponse,
  ChecklistResponse,
} from '@/lib/types'
import {
  updateServiceOrderStatus,
  uploadSignedDocument,
  approveAndCloseOrder,
  confirmCustomerAcceptance,
} from '@/lib/actions/service-orders'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

type Status = ServiceOrderWithRelations['status']

const coverageLabels: Record<string, string> = {
  FULL_SERVICE: 'Full Service',
  PREVENTIVE_ONLY: 'Preventive Only',
  CORRECTIVE_ONLY: 'Corrective Only',
  LOAN_AGREEMENT: 'Loan Agreement',
  WARRANTY: 'Warranty',
  PARTS_ONLY: 'Parts Only',
}

const typeLabels: Record<string, string> = {
  PUBLIC_BID: 'Public Bid (Licitación)',
  DIRECT_AWARD: 'Direct Award',
  LIMITED_TENDER: 'Limited Tender',
  LOAN_AGREEMENT: 'Loan Agreement (Comodato)',
  PRIVATE: 'Private',
}

const typeOrderLabels: Record<string, string> = {
  PREVENTIVE_MAINTENANCE: 'Preventive Maintenance',
  CORRECTIVE_MAINTENANCE: 'Corrective Maintenance',
  CALIBRATION: 'Calibration',
  INSPECTION: 'Inspection',
  INSTALLATION: 'Installation',
}

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
    <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  )
}

// ── Checklist read-only view ──────────────────────────────────────────────────
function ChecklistReadOnly({
  checklist,
  template,
}: {
  checklist: ChecklistResponse
  template: ChecklistTemplate | null
}) {
  if (!template) return null

  const total = checklist.items.length
  const passed = checklist.items.filter((i) => i.status === 'pass').length
  const failed = checklist.items.filter((i) => i.status === 'fail').length
  const na = checklist.items.filter((i) => i.status === 'na').length
  const progress = Math.round(((passed + failed + na) / total) * 100)

  const sections = Array.from(new Set(template.items.map((i) => i.section)))

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{passed + failed + na}/{total} items</span>
          <span className="flex items-center gap-3">
            <span className="text-success">{passed} pass</span>
            <span className="text-destructive">{failed} fail</span>
            <span>{na} N/A</span>
          </span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {sections.map((section) => {
        const sectionTemplateItems = template.items.filter(
          (i) => i.section === section
        )
        return (
          <div key={section}>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {section}
            </p>
            <div className="space-y-1">
              {sectionTemplateItems.map((ti) => {
                const response = checklist.items.find((r) => r.itemId === ti.id)
                const status = response?.status ?? 'pending'
                return (
                  <div
                    key={ti.id}
                    className={cn(
                      'flex items-start gap-2 rounded-md p-2 text-sm',
                      status === 'pass' && 'bg-success/5',
                      status === 'fail' && 'bg-destructive/5',
                      status === 'pending' && 'bg-muted/30'
                    )}
                  >
                    <span className="mt-0.5 shrink-0">
                      {status === 'pass' && <Check className="size-3.5 text-success" />}
                      {status === 'fail' && <X className="size-3.5 text-destructive" />}
                      {status === 'na' && <span className="text-xs text-muted-foreground">N/A</span>}
                      {status === 'pending' && <span className="size-3.5 rounded-full border block mt-0.5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cn(ti.isCritical && 'font-medium')}>
                        {ti.description}
                      </p>
                      {response?.measuredValue && (
                        <p className="text-xs text-muted-foreground">
                          Measured: {response.measuredValue}
                          {ti.unit && ` ${ti.unit}`}
                        </p>
                      )}
                      {response?.notes && (
                        <p className="text-xs italic text-muted-foreground">
                          {response.notes}
                        </p>
                      )}
                    </div>
                    {ti.isCritical && (
                      <AlertTriangle className="mt-0.5 size-3 shrink-0 text-warning" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Upload Document section ───────────────────────────────────────────────────
function UploadDocumentSection({
  order,
  onSuccess,
}: {
  order: ServiceOrderWithRelations
  onSuccess: () => void
}) {
  const [docUrl, setDocUrl] = React.useState(
    // initialize with existing signed document URL if available
    // ServiceOrderWithRelations may have a field like signedDocumentUrl
    // fall back to empty string otherwise
    // @ts-ignore allow optional property access if not present on type
    (order as any).signedDocumentUrl ?? ''
  )
  const [engineerName, setEngineerName] = React.useState(
    order.engineerSignedName ?? ''
  )
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleUpload() {
    if (!docUrl || !engineerName) {
      setError('Document URL and engineer name are required')
      return
    }
    setError(null)
    setIsPending(true)
    try {
      await uploadSignedDocument(order.id, docUrl, engineerName)
      onSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to upload document')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label className="text-xs">Signed Document URL</Label>
        <Input
          placeholder="https://drive.google.com/..."
          value={docUrl}
          onChange={(e) => setDocUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Upload the scanned signed PDF to Google Drive, OneDrive or SharePoint
          and paste the shareable link here.
        </p>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Engineer Name (as signed)</Label>
        <Input
          placeholder="Ing. Juan Pérez"
          value={engineerName}
          onChange={(e) => setEngineerName(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button
        className="w-full"
        onClick={handleUpload}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Upload className="mr-2 size-4" />
        )}
        {isPending ? 'Uploading...' : 'Upload Signed Document'}
      </Button>
    </div>
  )
}

// ── Customer Confirmation section ─────────────────────────────────────────────
function CustomerConfirmationSection({
  order,
  onSuccess,
}: {
  order: ServiceOrderWithRelations
  onSuccess: () => void
}) {
  const [name, setName] = React.useState('')
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleConfirm() {
    if (!name) {
      setError('Contact name is required')
      return
    }
    setError(null)
    setIsPending(true)
    try {
      await confirmCustomerAcceptance(order.id, name)
      onSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to confirm')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Confirm that the hospital user area accepted the equipment as functional
        after the corrective service.
      </p>
      <div className="space-y-2">
        <Label className="text-xs">Confirmed by (hospital contact name)</Label>
        <Input
          placeholder="Dr. Roberto Fuentes"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button className="w-full" onClick={handleConfirm} disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <CheckCircle2 className="mr-2 size-4" />
        )}
        {isPending ? 'Confirming...' : 'Confirm Customer Acceptance'}
      </Button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function ServiceOrderDetailSheet({
  order,
  template,
  open,
  onOpenChange,
  engineers,
  currentUserId,
}: {
  order: ServiceOrderWithRelations | null
  template: ChecklistTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  engineers: { id: string; name: string }[]
  currentUserId: string
}) {
  const [pendingAction, setPendingAction] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedEngineerId, setSelectedEngineerId] = React.useState('')
  const [confirmClose, setConfirmClose] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)

  React.useEffect(() => {
    setSelectedEngineerId('')
    setError(null)
  }, [order?.id])

  if (!order) return null

  const checklist = order.checklist as ChecklistResponse | null
  const isPreventive = order.type === 'PREVENTIVE_MAINTENANCE'
  const isCorrective = order.type === 'CORRECTIVE_MAINTENANCE'

  async function handleStatusChange(
    newStatus: Status,
    actionKey: string,
    options?: { assignedToId?: string }
  ) {
    setError(null)
    setPendingAction(actionKey)
    try {
      await updateServiceOrderStatus(order!.id, newStatus, options)
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update status')
    } finally {
      setPendingAction(null)
    }
  }

  async function handleClose() {
    setIsClosing(true)
    try {
      await approveAndCloseOrder(order!.id)
      setConfirmClose(false)
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to close order')
    } finally {
      setIsClosing(false)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-2xl">
          <SheetHeader className="shrink-0 border-b p-6 pb-4">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              <span className="font-mono text-sm">
                {order.orderNumber.slice(0, 12)}
              </span>
            </SheetTitle>
            <SheetDescription>
              {typeOrderLabels[order.type] ?? order.type} ·{' '}
              {order.equipment.equipmentModel.name}
            </SheetDescription>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge
                className={cn(
                  order.status === 'ASSIGNED' ? 'bg-success/10 text-success' :
                    order.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary' :
                      order.status === 'PENDING_CUSTOMER' ? 'bg-warning/10 text-warning' :
                        order.status === 'PENDING_SIGNATURE' ? 'bg-primary/10 text-primary' :
                          order.status === 'CLOSED' ? 'bg-foreground/10 text-foreground' :
                            'bg-muted text-muted-foreground'
                )}
              >
                {order.status.replace(/_/g, ' ')}
              </Badge>
              <Badge variant="outline">{order.priority}</Badge>
              {isPreventive && (
                <Badge variant="outline" className="text-primary border-primary/30">
                  PM
                </Badge>
              )}
              {isCorrective && (
                <Badge variant="outline" className="text-destructive border-destructive/30">
                  CM
                </Badge>
              )}
            </div>
          </SheetHeader>

          <ScrollArea className="min-h-0 flex-1">
            <Tabs defaultValue="details" className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="shrink-0 border-b px-6">
                <TabsList className="h-10">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="checklist" disabled={!checklist}>
                    Checklist
                    {checklist && (
                      <Badge
                        variant="secondary"
                        className="ml-2 tabular-nums text-[10px]"
                      >
                        {checklist.items.filter((i) => i.status !== 'pending').length}/
                        {checklist.items.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Details tab — todo lo que ya tenías en el ScrollArea */}
              <TabsContent value="details" className="mt-0 min-h-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-5 p-6">
                    {/* Equipment */}
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
                    label="Model"
                    value={`${order.equipment.equipmentModel.manufacturer} ${order.equipment.equipmentModel.model}`}
                  />
                  <InfoRow
                    label="Serial"
                    value={<span className="font-mono">{order.equipment.serialNumber}</span>}
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
                  <InfoRow label="Title" value={order.title} />
                  <InfoRow
                    label="Engineer"
                    value={order.assignedTo?.name ?? 'Unassigned'}
                  />
                  <InfoRow
                    label="Scheduled"
                    value={order.scheduledAt?.toLocaleDateString('en-US') ?? '—'}
                  />
                  <InfoRow
                    label="Est. Hours"
                    value={order.estimatedHours ? `${order.estimatedHours}h` : '—'}
                  />
                  <InfoRow
                    label="Labor Hours"
                    value={order.laborHours ? `${order.laborHours}h` : '—'}
                  />
                  <InfoRow label="Created By" value={order.createdBy.name} />
                </CardContent>
              </Card>

              {/* Scope of Work */}
              {(order.objectives || order.activities || order.safetyRequirements) && (
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
                  </CardContent>
                </Card>
              )}

              {/* Checklist (read-only for supervisor) */}
              {checklist && template && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <ClipboardList className="size-4" />
                      Checklist Results
                      {checklist.completedAt && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Completed
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChecklistReadOnly checklist={checklist} template={template} />
                  </CardContent>
                </Card>
              )}

              {/* Findings */}
              {order.findings && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Engineer Findings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{order.findings}</p>
                  </CardContent>
                </Card>
              )}

              {/* Customer acceptance (corrective flow) */}
              {order.status === 'PENDING_CUSTOMER' && (
                <Card className="border-warning/30 bg-warning/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-warning">
                      <MessageSquareWarning className="size-4" />
                      Awaiting Customer Acceptance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CustomerConfirmationSection
                      order={order}
                      onSuccess={() => onOpenChange(false)}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Signed document upload */}
              {(order.status === 'COMPLETED' || order.status === 'PENDING_SIGNATURE') && (
                <Card className={order.signedDocumentUrl ? 'border-success/30' : ''}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <FileSignature className="size-4" />
                      Signed Service Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {order.signedDocumentUrl ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-3">
                          <CheckCircle2 className="size-4 text-success shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">Document uploaded</p>
                            <p className="text-xs text-muted-foreground">
                              Signed by {order.engineerSignedName} ·{' '}
                              {order.engineerSignedAt?.toLocaleDateString('en-US')}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={order.signedDocumentUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          </Button>
                        </div>
                        {order.status === 'PENDING_SIGNATURE' && (
                          <Button
                            className="w-full bg-success text-success-foreground hover:bg-success/90"
                            onClick={() => setConfirmClose(true)}
                          >
                            <CheckCircle2 className="mr-2 size-4" />
                            Approve & Close Order
                          </Button>
                        )}
                      </div>
                    ) : (
                      <UploadDocumentSection
                        order={order}
                        onSuccess={() => onOpenChange(false)}
                      />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {event.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {order.timelineEvents.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No activity recorded yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Checklist tab — read-only para supervisor */}
              <TabsContent value="checklist" className="mt-0 min-h-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    {checklist && template ? (
                      <div className="space-y-4">
                        {/* Completion info */}
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{template.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {checklist.completedAt
                                    ? `Completed ${new Date(checklist.completedAt).toLocaleDateString('en-US')}`
                                    : 'In progress'}
                                </p>
                              </div>
                              {checklist.completedAt ? (
                                <Badge className="bg-success/10 text-success">
                                  <CheckCircle2 className="mr-1 size-3" />
                                  Completed
                                </Badge>
                              ) : (
                                <Badge className="bg-primary/10 text-primary">
                                  In Progress
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Checklist read-only */}
                        <ChecklistReadOnly checklist={checklist} template={template} />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ClipboardList className="mb-3 size-8 text-muted-foreground/50" />
                        <p className="text-sm font-medium">No checklist started yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          The engineer will fill the checklist when the order is in progress.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

          </ScrollArea>

          {/* Supervisor Actions */}
          <div className="shrink-0 border-t bg-muted/30 p-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Supervisor Actions
            </p>
            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* DRAFT — assign engineer */}
            {order.status === 'DRAFT' && (
              <div className="space-y-2">
                <Select
                  value={selectedEngineerId}
                  onValueChange={setSelectedEngineerId}
                >
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
                  className="w-full"
                  disabled={!selectedEngineerId || pendingAction !== null}
                  onClick={() =>
                    handleStatusChange('ASSIGNED', 'assign', {
                      assignedToId: selectedEngineerId,
                    })
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

            {/* ASSIGNED — mark in progress */}
            {order.status === 'ASSIGNED' && (
              <Button
                className="w-full"
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

            {/* IN_PROGRESS */}
            {order.status === 'IN_PROGRESS' && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  handleStatusChange('PENDING_PARTS', 'pending-parts')
                }
                disabled={pendingAction !== null}
              >
                {pendingAction === 'pending-parts' ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <MessageSquareWarning className="mr-2 size-4" />
                )}
                Pause — Pending Parts
              </Button>
            )}

            {/* PENDING_PARTS */}
            {order.status === 'PENDING_PARTS' && (
              <Button
                className="w-full"
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

            {/* COMPLETED — reject back to IN_PROGRESS */}
            {order.status === 'COMPLETED' && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  handleStatusChange('IN_PROGRESS', 'reject')
                }
                disabled={pendingAction !== null}
              >
                {pendingAction === 'reject' ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <MessageSquareWarning className="mr-2 size-4" />
                )}
                Reject — Return to Engineer
              </Button>
            )}

            {order.status === 'CLOSED' && (
              <p className="text-center text-sm text-muted-foreground">
                This order is closed and archived.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirm close dialog */}
      <AlertDialog open={confirmClose} onOpenChange={setConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve and close this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently close the service order and update the
              equipment&apos;s last service date. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClosing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClose}
              disabled={isClosing}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              {isClosing && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isClosing ? 'Closing...' : 'Approve & Close'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}