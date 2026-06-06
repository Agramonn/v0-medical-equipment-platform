'use client'

import * as React from 'react'
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  Plus,
  Settings2,
  Wrench,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  availableEquipment,
  checklistTemplates,
  completionRequirementLabels,
  engineers,
  serviceTypeConfig,
  type CompletionRequirements,
  type EquipmentSnapshot,
  type ServicePriority,
  type ServiceType,
} from '@/lib/service-order-data'

const STEPS = ['Equipment', 'Service Info', 'Scope of Work', 'Completion'] as const

const serviceTypes = Object.keys(serviceTypeConfig) as ServiceType[]

const defaultRequirements: CompletionRequirements = {
  photos: true,
  measurements: false,
  checklist: true,
  testResults: false,
  partsUsage: true,
  engineerNotes: true,
  customerSignature: true,
}

interface CreateServiceOrderWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // When launched from Equipment, equipment is pre-selected and locked.
  presetEquipment?: EquipmentSnapshot
  // When launched from a "Create X Service Order" button, lock the type.
  presetType?: ServiceType
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
  presetEquipment,
  presetType,
}: CreateServiceOrderWizardProps) {
  const [step, setStep] = React.useState(presetEquipment ? 1 : 0)

  // Step 1
  const [equipmentId, setEquipmentId] = React.useState(
    presetEquipment?.equipmentId ?? '',
  )
  // Step 2
  const [serviceType, setServiceType] = React.useState<ServiceType | ''>(
    presetType ?? '',
  )
  const [priority, setPriority] = React.useState<ServicePriority>('medium')
  const [engineer, setEngineer] = React.useState('')
  const [scheduledDate, setScheduledDate] = React.useState('')
  const [estimatedHours, setEstimatedHours] = React.useState('')
  // Step 3
  const [objectives, setObjectives] = React.useState('')
  const [activities, setActivities] = React.useState('')
  const [tools, setTools] = React.useState('')
  const [parts, setParts] = React.useState('')
  const [safety, setSafety] = React.useState('')
  const [customerNotes, setCustomerNotes] = React.useState('')
  // Step 4
  const [requirements, setRequirements] =
    React.useState<CompletionRequirements>(defaultRequirements)

  // Sync preset values whenever the wizard is (re)opened. Presets can change
  // between opens (e.g. different Service Action button on the equipment page),
  // and useState initializers only run on first mount.
  React.useEffect(() => {
    if (open) {
      setStep(presetEquipment ? 1 : 0)
      setEquipmentId(presetEquipment?.equipmentId ?? '')
      setServiceType(presetType ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, presetType, presetEquipment?.equipmentId])

  const selectedEquipment =
    presetEquipment ??
    availableEquipment.find((e) => e.equipmentId === equipmentId)

  const checklistPreview = serviceType ? checklistTemplates[serviceType] : []

  function reset() {
    setStep(presetEquipment ? 1 : 0)
    setEquipmentId(presetEquipment?.equipmentId ?? '')
    setServiceType(presetType ?? '')
    setPriority('medium')
    setEngineer('')
    setScheduledDate('')
    setEstimatedHours('')
    setObjectives('')
    setActivities('')
    setTools('')
    setParts('')
    setSafety('')
    setCustomerNotes('')
    setRequirements(defaultRequirements)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  function handleCreate() {
    // Architecture-only: no persistence yet. This is where the new
    // ServiceOrder would be assembled and saved.
    handleOpenChange(false)
  }

  const canContinue =
    (step === 0 && !!selectedEquipment) ||
    (step === 1 && !!serviceType && !!scheduledDate) ||
    step === 2 ||
    step === 3

  const visibleSteps = presetEquipment ? STEPS.slice(1) : STEPS
  const stepOffset = presetEquipment ? 1 : 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Service Order</DialogTitle>
          <DialogDescription>
            An official service record for a medical device.{' '}
            {presetEquipment ? `Equipment: ${presetEquipment.name}` : null}
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

        <ScrollArea className="flex-1 pr-4">
          {/* Step 1 - Equipment */}
          {step === 0 && (
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label>Select Equipment</Label>
                <Select value={equipmentId} onValueChange={setEquipmentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEquipment.map((e) => (
                      <SelectItem key={e.equipmentId} value={e.equipmentId}>
                        {e.name} — {e.hospital}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEquipment && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Equipment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                    <EquipmentInfoRow label="Name" value={selectedEquipment.name} />
                    <EquipmentInfoRow
                      label="Manufacturer"
                      value={selectedEquipment.manufacturer}
                    />
                    <EquipmentInfoRow label="Model" value={selectedEquipment.model} />
                    <EquipmentInfoRow
                      label="Serial Number"
                      value={
                        <span className="font-mono">{selectedEquipment.serialNumber}</span>
                      }
                    />
                    <EquipmentInfoRow
                      label="Asset Number"
                      value={
                        <span className="font-mono">{selectedEquipment.assetNumber}</span>
                      }
                    />
                    <EquipmentInfoRow label="Hospital" value={selectedEquipment.hospital} />
                    <EquipmentInfoRow
                      label="Department"
                      value={selectedEquipment.department}
                    />
                    <EquipmentInfoRow
                      label="Contract"
                      value={<Badge variant="default">{selectedEquipment.contract}</Badge>}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 2 - Service Information */}
          {step === 1 && (
            <div className="space-y-4 p-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Service Order Number</Label>
                  <Input value="OS-2024-009" readOnly className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Service Type</Label>
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
                          {t}
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
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assigned Engineer</Label>
                  <Select value={engineer} onValueChange={setEngineer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned (save as draft)" />
                    </SelectTrigger>
                    <SelectContent>
                      {engineers.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Scheduled Date</Label>
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
                <Input
                  defaultValue={
                    selectedEquipment
                      ? `${selectedEquipment.hospital} - ${selectedEquipment.department}`
                      : ''
                  }
                  placeholder="Building, floor, room"
                />
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Required Tools</Label>
                  <Textarea
                    placeholder="One per line"
                    className="min-h-[80px]"
                    value={tools}
                    onChange={(e) => setTools(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Required Parts</Label>
                  <Textarea
                    placeholder="One per line"
                    className="min-h-[80px]"
                    value={parts}
                    onChange={(e) => setParts(e.target.value)}
                  />
                </div>
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

              {checklistPreview.length > 0 && (
                <Card className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <ClipboardList className="size-4" />
                      {serviceType} Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {checklistPreview.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Checkbox checked disabled />
                        <span>{item}</span>
                      </div>
                    ))}
                    <p className="pt-1 text-xs text-muted-foreground">
                      This checklist is auto-attached and completed by the engineer
                      during execution.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4 - Completion Requirements */}
          {step === 3 && (
            <div className="space-y-4 p-1">
              <p className="text-sm text-muted-foreground">
                Select the evidence the engineer must provide before the order can be
                submitted for review. These define what makes this service record
                audit-ready.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(completionRequirementLabels) as (keyof CompletionRequirements)[]).map(
                  (key) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-accent/50"
                    >
                      <Checkbox
                        checked={requirements[key]}
                        onCheckedChange={(checked) =>
                          setRequirements((prev) => ({
                            ...prev,
                            [key]: checked === true,
                          }))
                        }
                      />
                      <span className="text-sm font-medium">
                        {completionRequirementLabels[key]}
                      </span>
                    </label>
                  ),
                )}
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileCheck2 className="size-4" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                  <EquipmentInfoRow
                    label="Equipment"
                    value={selectedEquipment?.name ?? '—'}
                  />
                  <EquipmentInfoRow label="Type" value={serviceType || '—'} />
                  <EquipmentInfoRow
                    label="Engineer"
                    value={engineer || 'Unassigned'}
                  />
                  <EquipmentInfoRow label="Scheduled" value={scheduledDate || '—'} />
                  <EquipmentInfoRow
                    label="Initial Status"
                    value={engineer ? 'Assigned' : 'Draft'}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </ScrollArea>

        <Separator />

        <DialogFooter>
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(stepOffset, s - 1))}
              disabled={step === stepOffset}
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
                <Button onClick={handleCreate}>
                  <CheckCircle2 className="mr-2 size-4" />
                  Create Service Order
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
