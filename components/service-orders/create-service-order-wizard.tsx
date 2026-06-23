'use client'

import * as React from 'react'
import {
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  Loader2,
  MapPin,
  Search,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createServiceOrder } from '@/lib/actions/service-orders'
import type { ServiceType as HumanServiceType } from '@/lib/service-order-data'

const STEPS = ['Equipment', 'Service Info', 'Scope of Work', 'Completion'] as const

type ServiceType = 'PREVENTIVE_MAINTENANCE' | 'CORRECTIVE_MAINTENANCE' | 'CALIBRATION' | 'INSPECTION' | 'INSTALLATION'
type ServicePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

const serviceTypeLabels: Record<ServiceType, string> = {
  PREVENTIVE_MAINTENANCE: 'Preventive Maintenance',
  CORRECTIVE_MAINTENANCE: 'Corrective Maintenance',
  CALIBRATION: 'Calibration',
  INSPECTION: 'Inspection',
  INSTALLATION: 'Installation',
}

const serviceTypes = Object.keys(serviceTypeLabels) as ServiceType[]

const humanToCodeType: Record<string, ServiceType> = {
  'Preventive Maintenance': 'PREVENTIVE_MAINTENANCE',
  'Corrective Maintenance': 'CORRECTIVE_MAINTENANCE',
  Calibration: 'CALIBRATION',
  Inspection: 'INSPECTION',
  Installation: 'INSTALLATION',
  PREVENTIVE_MAINTENANCE: 'PREVENTIVE_MAINTENANCE',
  CORRECTIVE_MAINTENANCE: 'CORRECTIVE_MAINTENANCE',
  CALIBRATION: 'CALIBRATION',
  INSPECTION: 'INSPECTION',
  INSTALLATION: 'INSTALLATION',
}

type EquipmentOption = {
  id: string
  name: string
  manufacturer: string
  model: string
  serialNumber: string
  assetNumber: string
  department: string
  organizationId: string
  organization: { name: string }
}

type EngineerOption = { id: string; name: string }

interface CreateServiceOrderWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  equipmentList: EquipmentOption[]
  engineers: EngineerOption[]
  currentUserId: string
  // When launched from Equipment workspace, equipment is pre-selected and locked.
  presetEquipmentId?: string
  // When launched from a "Create X Service Order" button, lock the type.
  presetType?: ServiceType | HumanServiceType
}

function EquipmentInfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

export function CreateServiceOrderWizard({
  open,
  onOpenChange,
  equipmentList,
  engineers,
  currentUserId,
  presetEquipmentId,
  presetType,
}: CreateServiceOrderWizardProps) {
  const [step, setStep] = React.useState(presetEquipmentId ? 1 : 0)
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Step 1
  const [equipmentId, setEquipmentId] = React.useState(presetEquipmentId ?? '')
  const [equipmentQuery, setEquipmentQuery] = React.useState('')

  const filteredEquipment = React.useMemo(() => {
    if (!equipmentQuery) return []
    const q = equipmentQuery.toLowerCase()
    return equipmentList.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.serialNumber.toLowerCase().includes(q) ||
        e.assetNumber.toLowerCase().includes(q) ||
        e.manufacturer.toLowerCase().includes(q) ||
        e.model.toLowerCase().includes(q)
    )
  }, [equipmentQuery, equipmentList])
  // Step 2
  const [serviceType, setServiceType] = React.useState<ServiceType | ''>(
    presetType ? (humanToCodeType[presetType as string] ?? '') : ''
  )
  const [priority, setPriority] = React.useState<ServicePriority>('MEDIUM')
  const [engineerId, setEngineerId] = React.useState('')
  const [scheduledDate, setScheduledDate] = React.useState('')
  const [estimatedHours, setEstimatedHours] = React.useState('')
  // Step 3
  const [title, setTitle] = React.useState('')
  const [objectives, setObjectives] = React.useState('')
  const [activities, setActivities] = React.useState('')
  const [safety, setSafety] = React.useState('')
  const [customerNotes, setCustomerNotes] = React.useState('')

  React.useEffect(() => {
    if (open) {
      setStep(presetEquipmentId ? 1 : 0)
      setEquipmentId(presetEquipmentId ?? '')
      setServiceType(presetType ? (humanToCodeType[presetType as string] ?? '') : '')
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, presetType, presetEquipmentId])

  const selectedEquipment =
    equipmentList.find((e) => e.id === equipmentId) ?? null

  function reset() {
    setStep(presetEquipmentId ? 1 : 0)
    setEquipmentId(presetEquipmentId ?? '')
    setServiceType(presetType ? (humanToCodeType[presetType as string] ?? '') : '')
    setPriority('MEDIUM')
    setEngineerId('')
    setScheduledDate('')
    setEstimatedHours('')
    setTitle('')
    setObjectives('')
    setActivities('')
    setSafety('')
    setCustomerNotes('')
    setError(null)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  async function handleCreate() {
    if (!selectedEquipment || !serviceType || !title) {
      setError('Please complete equipment, service type and title before creating.')
      return
    }

    setError(null)
    setIsPending(true)

    const formData = new FormData()
    formData.set('equipmentId', selectedEquipment.id)
    formData.set('type', serviceType)
    formData.set('priority', priority)
    formData.set('title', title)
    formData.set('scheduledAt', scheduledDate)
    formData.set('estimatedHours', estimatedHours)
    formData.set(
      'serviceLocation',
      selectedEquipment
        ? `${selectedEquipment.organization.name} — ${selectedEquipment.department}`
        : ''
    )
    formData.set('objectives', objectives)
    formData.set('activities', activities)
    formData.set('safetyRequirements', safety)
    formData.set('customerNotes', customerNotes)
    formData.set('assignedToId', engineerId)
    formData.set('createdById', currentUserId)

    try {
      await createServiceOrder(formData)
      handleOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create service order')
    } finally {
      setIsPending(false)
    }
  }

  const canContinue =
    (step === 0 && !!selectedEquipment) ||
    (step === 1 && !!serviceType && !!scheduledDate && !!title) ||
    step === 2 ||
    step === 3

  const visibleSteps = presetEquipmentId ? STEPS.slice(1) : STEPS
  const stepOffset = presetEquipmentId ? 1 : 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Service Order</DialogTitle>
          <DialogDescription>
            An official service record for a medical device.{' '}
            {selectedEquipment && presetEquipmentId ? `Equipment: ${selectedEquipment.name}` : null}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex flex-wrap items-center gap-y-2 px-1">
          {visibleSteps.map((label, index) => {
            const stepIndex = index + stepOffset
            const active = step === stepIndex
            const complete = step > stepIndex
            return (
              <div key={label} className="flex items-center">
                <div
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full text-xs font-medium',
                    active || complete
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {complete ? <CheckCircle2 className="size-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    'ml-2 text-sm',
                    active ? 'font-medium' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
                {index < visibleSteps.length - 1 && (
                  <ChevronRight className="mx-3 size-4 text-muted-foreground" />
                )}
              </div>
            )
          })}
        </div>

        <Separator />

        <ScrollArea className="-mr-2 min-h-0 flex-1 pr-4">
          {/* Step 1 - Equipment */}
          {step === 0 && (
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label>Select Equipment</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, serial number, or category..."
                    className="pl-9"
                    value={equipmentQuery}
                    onChange={(e) => setEquipmentQuery(e.target.value)}
                  />
                </div>
                {equipmentQuery && !selectedEquipment && (
                  <div className="max-h-[200px] space-y-1 overflow-y-auto rounded-lg border p-1">
                    {filteredEquipment.length === 0 && (
                      <p className="p-3 text-sm text-muted-foreground">No equipment found.</p>
                    )}
                    {filteredEquipment.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => {
                          setEquipmentId(e.id)
                          setEquipmentQuery('')
                        }}
                        className="flex w-full flex-col items-start rounded-md p-2 text-left text-sm hover:bg-accent"
                      >
                        <span className="font-medium">{e.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {e.organization.name} · {e.serialNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedEquipment && (
                <Card>
                  <CardHeader className="flex-row items-center justify-between pb-3">
                    <CardTitle className="text-sm">Equipment Information</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEquipmentId('')
                        setEquipmentQuery('')
                      }}
                    >
                      Change
                    </Button>
                  </CardHeader>
                  <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                    <EquipmentInfoRow label="Name" value={selectedEquipment.name} />
                    <EquipmentInfoRow label="Manufacturer" value={selectedEquipment.manufacturer} />
                    <EquipmentInfoRow label="Model" value={selectedEquipment.model} />
                    <EquipmentInfoRow
                      label="Serial Number"
                      value={<span className="font-mono">{selectedEquipment.serialNumber}</span>}
                    />
                    <EquipmentInfoRow
                      label="Asset Number"
                      value={<span className="font-mono">{selectedEquipment.assetNumber}</span>}
                    />
                    <EquipmentInfoRow label="Hospital" value={selectedEquipment.organization.name} />
                    <EquipmentInfoRow label="Department" value={selectedEquipment.department} />
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 2 - Service Information */}
          {step === 1 && (
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  placeholder="e.g. Resolve oxygen sensor calibration error"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Service Type *</Label>
                  <Select
                    value={serviceType}
                    onValueChange={(v) => setServiceType(v as ServiceType)}
                    disabled={!!presetType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {serviceTypeLabels[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={priority}
                    onValueChange={(v) => setPriority(v as ServicePriority)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assigned Engineer</Label>
                  <Select value={engineerId} onValueChange={setEngineerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned (save as draft)" />
                    </SelectTrigger>
                    <SelectContent>
                      {engineers.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Scheduled Date *</Label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Hours</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="e.g. 3"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Service Location</Label>
                <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="font-medium">
                    {selectedEquipment
                      ? `${selectedEquipment.organization.name} — ${selectedEquipment.department}`
                      : '—'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Auto-filled from the equipment record.
                </p>
              </div>
            </div>
          )}

          {/* Step 3 - Scope of Work */}
          {step === 2 && (
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label>Service Objectives</Label>
                <Textarea
                  placeholder="What this service must accomplish..."
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Activities to Perform</Label>
                <Textarea
                  placeholder="Step-by-step activities..."
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Safety Requirements</Label>
                <Textarea
                  placeholder="Lockout/tagout, PPE, patient disconnection..."
                  value={safety}
                  onChange={(e) => setSafety(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Customer Notes</Label>
                <Textarea
                  placeholder="Coordination notes, access instructions..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 4 - Summary */}
          {step === 3 && (
            <div className="space-y-4 p-1">
              <p className="text-sm text-muted-foreground">
                Review the order details before creating the record.
              </p>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileCheck2 className="size-4" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="divide-y divide-border">
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2">
                      <dt className="text-sm text-muted-foreground">Equipment</dt>
                      <dd className="text-sm font-medium text-right">{selectedEquipment?.name ?? '—'}</dd>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2">
                      <dt className="text-sm text-muted-foreground">Type</dt>
                      <dd className="text-sm font-medium text-right">
                        {serviceType ? serviceTypeLabels[serviceType] : '—'}
                      </dd>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2">
                      <dt className="text-sm text-muted-foreground">Engineer</dt>
                      <dd className="text-sm font-medium text-right">
                        {engineers.find((e) => e.id === engineerId)?.name ?? 'Unassigned'}
                      </dd>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2">
                      <dt className="text-sm text-muted-foreground">Scheduled</dt>
                      <dd className="text-sm font-medium text-right">{scheduledDate || '—'}</dd>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2">
                      <dt className="text-sm text-muted-foreground">Initial Status</dt>
                      <dd className="text-sm font-medium text-right">
                        {engineerId ? 'Assigned' : 'Draft'}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}
        </ScrollArea>

        <Separator />

        <DialogFooter className="shrink-0">
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(stepOffset, s - 1))}
              disabled={step === stepOffset || isPending}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {step < 3 ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
                  Continue
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              ) : (
                <Button onClick={handleCreate} disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 size-4" />
                  )}
                  {isPending ? 'Creating...' : 'Create Service Order'}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
