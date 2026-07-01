'use client'

import * as React from 'react'
import {
  Plus,
  Loader2,
  Search,
  CheckCircle2,
  ChevronRight,
  Trash2,
  Package,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { createEquipmentWithUnits } from '@/lib/actions/equipment'
import { EquipmentModel } from '@/lib/types'

type Organization = { id: string; name: string }
type UnitInput = { serialNumber: string; assetNumber: string }

const STEPS = ['Model', 'Units', 'Location'] as const

export function AddEquipmentDialog({
  organizations,
  equipmentModels,
}: {
  organizations: Organization[]
  equipmentModels: EquipmentModel[]
}) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Step 1 — Model
  const [modelMode, setModelMode] = React.useState<'existing' | 'new'>('existing')
  const [modelQuery, setModelQuery] = React.useState('')
  const [selectedModelId, setSelectedModelId] = React.useState('')
  const [newModelName, setNewModelName] = React.useState('')
  const [newManufacturer, setNewManufacturer] = React.useState('')
  const [newModel, setNewModel] = React.useState('')
  const [newCategory, setNewCategory] = React.useState('')

  // Step 2 — Units
  const [units, setUnits] = React.useState<UnitInput[]>([
    { serialNumber: '', assetNumber: '' },
  ])

  // Step 3 — Location
  const [organizationId, setOrganizationId] = React.useState('')
  const [department, setDepartment] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [contractType, setContractType] = React.useState('')

  const filteredModels = React.useMemo(() => {
    if (!modelQuery) return equipmentModels
    const q = modelQuery.toLowerCase()
    return equipmentModels.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q) ||
        m.model.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    )
  }, [modelQuery, equipmentModels])

  const selectedModel = equipmentModels.find((m) => m.id === selectedModelId)

  function reset() {
    setStep(0)
    setModelMode('existing')
    setModelQuery('')
    setSelectedModelId('')
    setNewModelName('')
    setNewManufacturer('')
    setNewModel('')
    setNewCategory('')
    setUnits([{ serialNumber: '', assetNumber: '' }])
    setOrganizationId('')
    setDepartment('')
    setLocation('')
    setContractType('')
    setError(null)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    setOpen(next)
  }

  function addUnit() {
    setUnits((prev) => [...prev, { serialNumber: '', assetNumber: '' }])
  }

  function removeUnit(index: number) {
    setUnits((prev) => prev.filter((_, i) => i !== index))
  }

  function updateUnit(index: number, field: keyof UnitInput, value: string) {
    setUnits((prev) =>
      prev.map((u, i) => (i === index ? { ...u, [field]: value } : u))
    )
  }

  const canContinueStep1 =
    modelMode === 'existing'
      ? !!selectedModelId
      : !!newModelName && !!newManufacturer && !!newModel && !!newCategory

  const canContinueStep2 = units.every(
    (u) => u.serialNumber.trim() && u.assetNumber.trim()
  )

  const canContinueStep3 = !!organizationId && !!department

  const canContinue =
    (step === 0 && canContinueStep1) ||
    (step === 1 && canContinueStep2) ||
    (step === 2 && canContinueStep3)

  async function handleCreate() {
    setError(null)
    setIsPending(true)
    try {
      await createEquipmentWithUnits({
        equipmentModelId: modelMode === 'existing' ? selectedModelId : undefined,
        modelName: modelMode === 'new' ? newModelName : undefined,
        manufacturer: modelMode === 'new' ? newManufacturer : undefined,
        model: modelMode === 'new' ? newModel : undefined,
        category: modelMode === 'new' ? newCategory : undefined,
        organizationId,
        department,
        location,
        contractType,
        units,
      })
      handleOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create equipment')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[85vh] max-w-2xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Equipment</DialogTitle>
          <DialogDescription>
            Select an existing model or create a new one, then register one or more units.
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-y-2 px-1">
          {STEPS.map((label, index) => {
            const active = step === index
            const complete = step > index
            return (
              <div key={label} className="flex items-center">
                <div
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full text-xs font-medium',
                    active || complete
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {complete ? <CheckCircle2 className="size-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    'ml-2 text-sm',
                    active ? 'font-medium' : 'text-muted-foreground'
                  )}
                >
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

        <ScrollArea className="min-h-0 flex-1 overflow-auto -mr-2 pr-4">

          {/* ── Step 1: Model ── */}
          {step === 0 && (
            <div className="space-y-4 p-1">
              {/* Toggle existing / new */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={modelMode === 'existing' ? 'default' : 'outline'}
                  onClick={() => setModelMode('existing')}
                >
                  Select Existing Model
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={modelMode === 'new' ? 'default' : 'outline'}
                  onClick={() => setModelMode('new')}
                >
                  <Plus className="mr-1 size-3" />
                  Create New Model
                </Button>
              </div>

              {modelMode === 'existing' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, manufacturer, model or category..."
                      className="pl-9"
                      value={modelQuery}
                      onChange={(e) => setModelQuery(e.target.value)}
                    />
                  </div>
                  <div className="max-h-[280px] space-y-1 overflow-y-auto rounded-lg border p-1">
                    {filteredModels.length === 0 && (
                      <p className="p-3 text-center text-sm text-muted-foreground">
                        No models found. Try creating a new one.
                      </p>
                    )}
                    {filteredModels.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedModelId(m.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent',
                          selectedModelId === m.id && 'bg-accent ring-1 ring-primary'
                        )}
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Package className="size-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {m.manufacturer} · {m.model}
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {m.category}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {modelMode === 'new' && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Equipment Name *</Label>
                      <Input
                        placeholder="e.g. Anesthesia Machine"
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Input
                        placeholder="e.g. Anesthesia"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Manufacturer *</Label>
                      <Input
                        placeholder="e.g. Penlon"
                        value={newManufacturer}
                        onChange={(e) => setNewManufacturer(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Model *</Label>
                      <Input
                        placeholder="e.g. Prima 320 Advance"
                        value={newModel}
                        onChange={(e) => setNewModel(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Units ── */}
          {step === 1 && (
            <div className="space-y-4 p-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {selectedModel?.name ?? `${newModelName} (new)`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedModel
                      ? `${selectedModel.manufacturer} · ${selectedModel.model}`
                      : `${newManufacturer} · ${newModel}`}
                  </p>
                </div>
                <Badge variant="secondary">{units.length} unit{units.length !== 1 ? 's' : ''}</Badge>
              </div>

              <div className="-y-space3">
                {units.map((unit, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium">Unit {index + 1}</p>
                      {units.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive hover:text-destructive"
                          onClick={() => removeUnit(index)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Serial Number *</Label>
                        <Input
                          placeholder="SN-XXXX-MFG-001"
                          value={unit.serialNumber}
                          onChange={(e) => updateUnit(index, 'serialNumber', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Asset Number *</Label>
                        <Input
                          placeholder="AST-100XXX"
                          value={unit.assetNumber}
                          onChange={(e) => updateUnit(index, 'assetNumber', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addUnit}
              >
                <Plus className="mr-2 size-4" />
                Add Another Unit
              </Button>

              <p className="text-xs text-muted-foreground">
                All units will share the same hospital, department, and contract. You can edit individual units later from the inventory.
              </p>
            </div>
          )}

          {/* ── Step 3: Location & Summary ── */}
          {step === 2 && (
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label>Hospital *</Label>
                <Select value={organizationId} onValueChange={setOrganizationId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Input
                    placeholder="ICU"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contract Type</Label>
                  <Select value={contractType} onValueChange={setContractType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Service">Full Service</SelectItem>
                      <SelectItem value="Preventive Only">Preventive Only</SelectItem>
                      <SelectItem value="Parts Only">Parts Only</SelectItem>
                      <SelectItem value="Warranty">Warranty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Physical Location</Label>
                <Input
                  placeholder="Building A, Floor 3"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Summary */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <p className="text-sm font-medium">Summary</p>
                <dl className="divide-y divide-border text-sm">
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Model</dt>
                    <dd className="text-right font-medium">
                      {selectedModel?.name ?? newModelName}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Manufacturer</dt>
                    <dd className="text-right font-medium">
                      {selectedModel?.manufacturer ?? newManufacturer}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Units</dt>
                    <dd className="text-right font-medium">{units.length}</dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Hospital</dt>
                    <dd className="text-right font-medium">
                      {organizations.find((o) => o.id === organizationId)?.name ?? '—'}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Department</dt>
                    <dd className="text-right font-medium">{department || '—'}</dd>
                  </div>
                </dl>
              </div>

              {error && (
                <p className="whitespace-pre-line text-sm text-destructive">{error}</p>
              )}
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
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
                  Continue
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              ) : (
                <Button onClick={handleCreate} disabled={!canContinueStep3 || isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 size-4" />
                  )}
                  {isPending
                    ? 'Saving...'
                    : `Save ${units.length} Unit${units.length !== 1 ? 's' : ''}`}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}