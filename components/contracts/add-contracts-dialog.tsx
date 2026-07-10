'use client'

import * as React from 'react'
import {
  ChevronRight,
  CheckCircle2,
  Loader2,
  Trash2,
  Package,
  Building2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { createContract } from '@/lib/actions/contracts'
import { EquipmentForContract } from '@/app/contracts/page'

type Organization = { id: string; name: string; city: string; state: string }

// Grupo de unidades del mismo modelo en el mismo hospital
type ModelGroup = {
  modelId: string
  name: string
  manufacturer: string
  model: string
  category: string
  units: EquipmentForContract[]
}

// Una fila de cobertura = un modelo con las unidades específicas seleccionadas
type CoverageRow = {
  equipmentModelId: string
  modelName: string
  manufacturer: string
  model: string
  selectedUnitIds: string[]  // IDs de Equipment (unidades físicas)
  coverageType: string
  pmVisitsPerYear: number
  slaHours: number
  includesParts: boolean
  includesLabor: boolean
  notes: string
}

const STEPS = ['Contract Info', 'Equipment & Units', 'Review'] as const

function groupByModel(equipment: EquipmentForContract[]): ModelGroup[] {
  const map = new Map<string, ModelGroup>()
  for (const eq of equipment) {
    const existing = map.get(eq.equipmentModelId)
    if (existing) {
      existing.units.push(eq)
    } else {
      map.set(eq.equipmentModelId, {
        modelId: eq.equipmentModelId,
        name: eq.equipmentModel.name,
        manufacturer: eq.equipmentModel.manufacturer,
        model: eq.equipmentModel.model,
        category: eq.equipmentModel.category,
        units: [eq],
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export function AddContractDialog({
  open,
  onOpenChange,
  organizations,
  equipmentByOrg,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizations: Organization[]
  equipmentByOrg: EquipmentForContract[]
}) {
  const [step, setStep] = React.useState(0)
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Step 1
  const [contractNumber, setContractNumber] = React.useState('')
  const [type, setType] = React.useState('')
  const [clientId, setClientId] = React.useState('')
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')
  const [totalValue, setTotalValue] = React.useState('')
  const [currency, setCurrency] = React.useState('MXN')
  const [notes, setNotes] = React.useState('')

  // Step 2 — qué modelos están expandidos para ver sus unidades
  const [expandedModels, setExpandedModels] = React.useState<Set<string>>(new Set())
  const [coverage, setCoverage] = React.useState<CoverageRow[]>([])

  const hospitalEquipment = React.useMemo(() => {
    if (!clientId) return []
    return groupByModel(equipmentByOrg.filter((e) => e.organizationId === clientId))
  }, [clientId, equipmentByOrg])

  const selectedClient = organizations.find((o) => o.id === clientId)

  function toggleExpanded(modelId: string) {
    setExpandedModels((prev) => {
      const next = new Set(prev)
      if (next.has(modelId)) next.delete(modelId)
      else next.add(modelId)
      return next
    })
  }

  function getCoverageRow(modelId: string): CoverageRow | undefined {
    return coverage.find((c) => c.equipmentModelId === modelId)
  }

  function toggleUnit(group: ModelGroup, unitId: string) {
    setCoverage((prev) => {
      const existing = prev.find((c) => c.equipmentModelId === group.modelId)
      if (existing) {
        const hasUnit = existing.selectedUnitIds.includes(unitId)
        const newIds = hasUnit
          ? existing.selectedUnitIds.filter((id) => id !== unitId)
          : [...existing.selectedUnitIds, unitId]

        // Si quedan 0 unidades seleccionadas, quita el modelo entero
        if (newIds.length === 0) {
          return prev.filter((c) => c.equipmentModelId !== group.modelId)
        }
        return prev.map((c) =>
          c.equipmentModelId === group.modelId ? { ...c, selectedUnitIds: newIds } : c
        )
      } else {
        // Primera unidad de este modelo — agrega la fila con defaults
        return [
          ...prev,
          {
            equipmentModelId: group.modelId,
            modelName: group.name,
            manufacturer: group.manufacturer,
            model: group.model,
            selectedUnitIds: [unitId],
            coverageType: 'FULL_SERVICE',
            pmVisitsPerYear: 2,
            slaHours: 48,
            includesParts: true,
            includesLabor: true,
            notes: '',
          },
        ]
      }
    })
  }

  function selectAllUnits(group: ModelGroup) {
    setCoverage((prev) => {
      const allIds = group.units.map((u) => u.id)
      const existing = prev.find((c) => c.equipmentModelId === group.modelId)
      if (existing) {
        return prev.map((c) =>
          c.equipmentModelId === group.modelId ? { ...c, selectedUnitIds: allIds } : c
        )
      }
      return [
        ...prev,
        {
          equipmentModelId: group.modelId,
          modelName: group.name,
          manufacturer: group.manufacturer,
          model: group.model,
          selectedUnitIds: allIds,
          coverageType: 'FULL_SERVICE',
          pmVisitsPerYear: 2,
          slaHours: 48,
          includesParts: true,
          includesLabor: true,
          notes: '',
        },
      ]
    })
  }

  function deselectAllUnits(modelId: string) {
    setCoverage((prev) => prev.filter((c) => c.equipmentModelId !== modelId))
  }

  function updateCoverage(modelId: string, field: keyof CoverageRow, value: any) {
    setCoverage((prev) =>
      prev.map((c) => (c.equipmentModelId === modelId ? { ...c, [field]: value } : c))
    )
  }

  function reset() {
    setStep(0)
    setContractNumber('')
    setType('')
    setClientId('')
    setStartDate('')
    setEndDate('')
    setTotalValue('')
    setCurrency('MXN')
    setNotes('')
    setCoverage([])
    setExpandedModels(new Set())
    setError(null)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  function handleClientChange(id: string) {
    setClientId(id)
    setCoverage([])
    setExpandedModels(new Set())
  }

  const canStep1 = !!contractNumber && !!type && !!clientId && !!startDate && !!endDate
  const canStep2 = coverage.length > 0 && coverage.every((c) => c.selectedUnitIds.length > 0)
  const totalUnits = coverage.reduce((sum, c) => sum + c.selectedUnitIds.length, 0)

  async function handleCreate() {
    setError(null)
    setIsPending(true)
    try {
      await createContract({
        contractNumber,
        type,
        clientId,
        startDate,
        endDate,
        totalValue: totalValue || undefined,
        currency,
        notes: notes || undefined,
        coverage: coverage.map((c) => ({
          equipmentModelId: c.equipmentModelId,
          selectedUnitIds: c.selectedUnitIds,
          coverageType: c.coverageType,
          pmVisitsPerYear: c.pmVisitsPerYear,
          slaHours: c.slaHours,
          includesParts: c.includesParts,
          includesLabor: c.includesLabor,
          notes: c.notes || undefined,
        })),
      })
      handleOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create contract')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-[88vh] max-w-3xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>New Contract</DialogTitle>
          <DialogDescription>
            Register a service contract or coverage agreement.
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center px-1">
          {STEPS.map((label, index) => {
            const active = step === index
            const complete = step > index
            return (
              <div key={label} className="flex items-center">
                <div className={cn(
                  'flex size-7 items-center justify-center rounded-full text-xs font-medium',
                  active || complete
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {complete ? <CheckCircle2 className="size-4" /> : index + 1}
                </div>
                <span className={cn('ml-2 text-sm', active ? 'font-medium' : 'text-muted-foreground')}>
                  {label}
                </span>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="mx-3 size-4 text-muted-foreground" />
                )}
              </div>
            )
          })}
        </div>

        <Separator />

        <ScrollArea className="min-h-0 flex-1 -mr-2 pr-4">

          {/* ── Step 1 ── */}
          {step === 0 && (
            <div className="space-y-4 p-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Contract Number *</Label>
                  <Input
                    placeholder="LPN-HGM-2025-001"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contract Type *</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC_BID">Public Bid (Licitación)</SelectItem>
                      <SelectItem value="DIRECT_AWARD">Direct Award (Adjudicación)</SelectItem>
                      <SelectItem value="LIMITED_TENDER">Limited Tender (Invitación)</SelectItem>
                      <SelectItem value="LOAN_AGREEMENT">Loan Agreement (Comodato)</SelectItem>
                      <SelectItem value="PRIVATE">Private Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Client (Hospital / Institution) *</Label>
                <Select value={clientId} onValueChange={handleClientChange}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name} — {org.city}, {org.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {clientId && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="size-3" />
                    Step 2 shows only equipment registered at this hospital.
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Total Value</Label>
                  <Input type="number" placeholder="850000" value={totalValue} onChange={(e) => setTotalValue(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MXN">MXN — Mexican Peso</SelectItem>
                      <SelectItem value="USD">USD — US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Input placeholder="Additional details..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Step 2: Equipment & Units ── */}
          {step === 1 && (
            <div className="space-y-4 p-1">
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
                <Building2 className="size-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">{selectedClient?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {hospitalEquipment.length} model{hospitalEquipment.length !== 1 ? 's' : ''} ·{' '}
                    {equipmentByOrg.filter((e) => e.organizationId === clientId).length} total units ·{' '}
                    <span className="font-medium text-foreground">{totalUnits} selected</span>
                  </p>
                </div>
              </div>

              {hospitalEquipment.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Package className="mx-auto mb-3 size-8 text-muted-foreground" />
                  <p className="text-sm font-medium">No equipment registered</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add equipment to this hospital in Inventory first.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {hospitalEquipment.map((group) => {
                    const row = getCoverageRow(group.modelId)
                    const selectedCount = row?.selectedUnitIds.length ?? 0
                    const isExpanded = expandedModels.has(group.modelId)
                    const allSelected = selectedCount === group.units.length

                    return (
                      <div key={group.modelId} className={cn(
                        'rounded-lg border transition-colors',
                        selectedCount > 0 && 'border-primary/30 bg-primary/[0.02]'
                      )}>
                        {/* Model header */}
                        <div className="flex items-center gap-3 p-3">
                          <Checkbox
                            checked={allSelected && selectedCount > 0}
                            ref={(el) => {
                              if (el) (el as any).indeterminate = selectedCount > 0 && !allSelected
                            }}
                            onCheckedChange={(checked) => {
                              if (checked) selectAllUnits(group)
                              else deselectAllUnits(group.modelId)
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{group.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {group.manufacturer} · {group.model} · {group.category}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge
                              variant={selectedCount > 0 ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {selectedCount}/{group.units.length}
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => toggleExpanded(group.modelId)}
                            >
                              {isExpanded
                                ? <ChevronUp className="size-4" />
                                : <ChevronDown className="size-4" />}
                            </Button>
                          </div>
                        </div>

                        {/* Unit list */}
                        {isExpanded && (
                          <div className="border-t">
                            {group.units.map((unit) => {
                              const isUnitSelected = row?.selectedUnitIds.includes(unit.id) ?? false
                              return (
                                <label
                                  key={unit.id}
                                  className={cn(
                                    'flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-accent',
                                    isUnitSelected && 'bg-primary/5'
                                  )}
                                >
                                  <Checkbox
                                    checked={isUnitSelected}
                                    onCheckedChange={() => toggleUnit(group, unit.id)}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-mono">{unit.serialNumber}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Asset: {unit.assetNumber} · {unit.department}
                                    </p>
                                  </div>
                                </label>
                              )
                            })}
                          </div>
                        )}

                        {/* Coverage config — solo si hay unidades seleccionadas */}
                        {row && selectedCount > 0 && (
                          <div className="border-t bg-muted/20 p-3 space-y-3">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Coverage terms for {selectedCount} unit{selectedCount !== 1 ? 's' : ''}
                            </p>
                            <div className="grid gap-3 sm:grid-cols-3">
                              <div className="space-y-1.5">
                                <Label className="text-xs">Coverage Type</Label>
                                <Select
                                  value={row.coverageType}
                                  onValueChange={(v) => updateCoverage(group.modelId, 'coverageType', v)}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="FULL_SERVICE">Full Service</SelectItem>
                                    <SelectItem value="PREVENTIVE_ONLY">Preventive Only</SelectItem>
                                    <SelectItem value="CORRECTIVE_ONLY">Corrective Only</SelectItem>
                                    <SelectItem value="LOAN_AGREEMENT">Loan Agreement</SelectItem>
                                    <SelectItem value="WARRANTY">Warranty</SelectItem>
                                    <SelectItem value="PARTS_ONLY">Parts Only</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">PM Visits/Year</Label>
                                <Input
                                  type="number"
                                  min={0}
                                  max={12}
                                  className="h-8 text-xs"
                                  value={row.pmVisitsPerYear}
                                  onChange={(e) => updateCoverage(group.modelId, 'pmVisitsPerYear', parseInt(e.target.value) || 0)}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">SLA Response (hrs)</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  className="h-8 text-xs"
                                  value={row.slaHours}
                                  onChange={(e) => updateCoverage(group.modelId, 'slaHours', parseInt(e.target.value) || 48)}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2 text-xs cursor-pointer">
                                <Checkbox
                                  checked={row.includesParts}
                                  onCheckedChange={(v) => updateCoverage(group.modelId, 'includesParts', v === true)}
                                />
                                Includes Parts
                              </label>
                              <label className="flex items-center gap-2 text-xs cursor-pointer">
                                <Checkbox
                                  checked={row.includesLabor}
                                  onCheckedChange={(v) => updateCoverage(group.modelId, 'includesLabor', v === true)}
                                />
                                Includes Labor
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Review ── */}
          {step === 2 && (
            <div className="space-y-4 p-1">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium mb-3">Contract Summary</p>
                <dl className="divide-y divide-border text-sm">
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Number</dt>
                    <dd className="text-right font-mono font-medium">{contractNumber}</dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Client</dt>
                    <dd className="text-right font-medium">{selectedClient?.name}</dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="text-right">{type.replace(/_/g, ' ')}</dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Period</dt>
                    <dd className="text-right">{startDate} → {endDate}</dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Value</dt>
                    <dd className="text-right">
                      {totalValue ? `$${parseFloat(totalValue).toLocaleString()} ${currency}` : 'Not specified'}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Equipment models</dt>
                    <dd className="text-right">{coverage.length}</dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Total units covered</dt>
                    <dd className="text-right font-semibold">{totalUnits}</dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-2">
                {coverage.map((row) => (
                  <div key={row.equipmentModelId} className="rounded-lg border p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{row.modelName}</p>
                        <p className="text-xs text-muted-foreground">
                          {row.manufacturer} · {row.model}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {row.selectedUnitIds.length} unit{row.selectedUnitIds.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {row.coverageType.replace(/_/g, ' ')}
                      </span>
                      <span>·</span>
                      <span>{row.pmVisitsPerYear} PM/yr</span>
                      <span>·</span>
                      <span>SLA {row.slaHours}h</span>
                      {row.includesParts && <span className="text-success">· Parts ✓</span>}
                      {row.includesLabor && <span className="text-success">· Labor ✓</span>}
                    </div>
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-destructive whitespace-pre-line">{error}</p>}
            </div>
          )}
        </ScrollArea>

        <Separator />

        <DialogFooter className="shrink-0">
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || isPending}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {step < 2 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 0 ? !canStep1 : !canStep2}
                >
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
                  {isPending ? 'Saving...' : `Create Contract (${totalUnits} units)`}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}