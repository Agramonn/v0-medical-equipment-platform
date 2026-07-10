'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Save,
  Settings2,
  Trash2,
  Wrench,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  EquipmentWithDetails,
  ServiceOrderWithRelations,
  ChecklistTemplate,
  ChecklistTemplateItem,
  ChecklistResponse,
} from '@/lib/types'
import { EngineerOrderSheet } from '@/components/service-orders/engineer-order-sheet'
import { SupervisorOrderEditDialog } from '@/components/service-orders/supervisor-order-edit-dialog'
import {
  createChecklistTemplate,
  updateChecklistTemplateItem,
  addChecklistTemplateItem,
  deleteChecklistTemplateItem,
  deleteChecklistTemplate,
} from '@/lib/actions/checklist-templates'

// ── Constants ─────────────────────────────────────────────────────────────────

const SERVICE_TYPE_OPTIONS = [
  { value: 'PREVENTIVE_MAINTENANCE', label: 'Preventive Maintenance' },
  { value: 'CORRECTIVE_MAINTENANCE', label: 'Corrective Maintenance' },
  { value: 'CALIBRATION', label: 'Calibration' },
  { value: 'INSPECTION', label: 'Inspection' },
  { value: 'INSTALLATION', label: 'Installation' },
]

const typeLabels: Record<string, string> = Object.fromEntries(
  SERVICE_TYPE_OPTIONS.map((o) => [o.value, o.label])
)

const openStatuses = ['DRAFT', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_PARTS']

// ── New item form (blank) ─────────────────────────────────────────────────────

type DraftItem = {
  section: string
  description: string
  expectedValue: string
  unit: string
  isCritical: boolean
  requiresEvidence: boolean
}

const blankDraftItem = (): DraftItem => ({
  section: '',
  description: '',
  expectedValue: '',
  unit: '',
  isCritical: false,
  requiresEvidence: false,
})

// ── Inline item row ───────────────────────────────────────────────────────────

function TemplateItemRow({
  item,
  onSave,
  onDelete,
}: {
  item: ChecklistTemplateItem
  onSave: (id: string, data: Partial<ChecklistTemplateItem>) => Promise<void>
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [draft, setDraft] = React.useState({
    section: item.section,
    description: item.description,
    expectedValue: item.expectedValue ?? '',
    unit: item.unit ?? '',
    isCritical: item.isCritical,
    requiresEvidence: item.requiresEvidence,
  })

  async function handleSave() {
    setIsSaving(true)
    try {
      await onSave(item.id, {
        ...draft,
        expectedValue: draft.expectedValue || undefined,
        unit: draft.unit || undefined,
      })
      setEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="flex items-start gap-3 rounded-md border bg-card px-3 py-2.5 group">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {item.isCritical && (
              <AlertTriangle className="size-3 shrink-0 text-warning" />
            )}
            <p className="text-sm">{item.description}</p>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{item.section}</span>
            {item.expectedValue && (
              <span>
                Expected: {item.expectedValue}
                {item.unit && ` ${item.unit}`}
              </span>
            )}
            {item.requiresEvidence && (
              <Badge variant="outline" className="text-[10px]">
                Evidence
              </Badge>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setEditing(true)}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border bg-muted/30 p-3 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Section</Label>
          <Input
            className="h-7 text-xs"
            value={draft.section}
            onChange={(e) => setDraft((d) => ({ ...d, section: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs">Description</Label>
          <Textarea
            className="min-h-[60px] text-xs"
            value={draft.description}
            onChange={(e) =>
              setDraft((d) => ({ ...d, description: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Expected Value</Label>
          <Input
            className="h-7 text-xs"
            placeholder="e.g. < 300"
            value={draft.expectedValue}
            onChange={(e) =>
              setDraft((d) => ({ ...d, expectedValue: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Unit</Label>
          <Input
            className="h-7 text-xs"
            placeholder="e.g. μA, V, cmH2O"
            value={draft.unit}
            onChange={(e) => setDraft((d) => ({ ...d, unit: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-xs">
          <Checkbox
            checked={draft.isCritical}
            onCheckedChange={(v) =>
              setDraft((d) => ({ ...d, isCritical: v === true }))
            }
          />
          Critical item
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs">
          <Checkbox
            checked={draft.requiresEvidence}
            onCheckedChange={(v) =>
              setDraft((d) => ({ ...d, requiresEvidence: v === true }))
            }
          />
          Requires evidence
        </label>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving || !draft.description || !draft.section}
        >
          {isSaving && <Loader2 className="mr-2 size-3.5 animate-spin" />}
          <Save className="mr-1 size-3.5" />
          Save
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditing(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

// ── Template editor (inline) ──────────────────────────────────────────────────

function TemplateEditor({
  template,
  onClose,
}: {
  template: ChecklistTemplate
  onClose: () => void
}) {
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [newItem, setNewItem] = React.useState<DraftItem>(blankDraftItem())
  const [isAdding, setIsAdding] = React.useState(false)
  const [deleteItemId, setDeleteItemId] = React.useState<string | null>(null)
  const [isDeletingItem, setIsDeletingItem] = React.useState(false)
  const [deleteTemplateConfirm, setDeleteTemplateConfirm] = React.useState(false)
  const [isDeletingTemplate, setIsDeletingTemplate] = React.useState(false)

  // Group items by section
  const sections = Array.from(new Set(template.items.map((i) => i.section)))

  async function handleSaveItem(
    id: string,
    data: Partial<ChecklistTemplateItem>
  ) {
    await updateChecklistTemplateItem(id, {
      section: data.section ?? '',
      description: data.description ?? '',
      expectedValue: data.expectedValue ?? undefined,
      unit: data.unit ?? undefined,
      isCritical: data.isCritical ?? false,
      requiresEvidence: data.requiresEvidence ?? false,
    })
  }

  async function handleAddItem() {
    if (!newItem.section || !newItem.description) return
    setIsAdding(true)
    try {
      await addChecklistTemplateItem(template.id, {
        ...newItem,
        expectedValue: newItem.expectedValue || undefined,
        unit: newItem.unit || undefined,
      })
      setNewItem(blankDraftItem())
      setShowAddForm(false)
    } finally {
      setIsAdding(false)
    }
  }

  async function handleDeleteItem() {
    if (!deleteItemId) return
    setIsDeletingItem(true)
    try {
      await deleteChecklistTemplateItem(deleteItemId)
      setDeleteItemId(null)
    } finally {
      setIsDeletingItem(false)
    }
  }

  async function handleDeleteTemplate() {
    setIsDeletingTemplate(true)
    try {
      await deleteChecklistTemplate(template.id)
      setDeleteTemplateConfirm(false)
      onClose()
    } finally {
      setIsDeletingTemplate(false)
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        {/* Template header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="font-medium text-sm">{template.name}</p>
            <p className="text-xs text-muted-foreground">
              {typeLabels[template.serviceType] ?? template.serviceType} ·{' '}
              {template.items.length} items · v{template.version}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteTemplateConfirm(true)}
            >
              <Trash2 className="mr-1 size-3.5" />
              Delete Template
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Items grouped by section */}
          {sections.map((section) => (
            <Collapsible key={section} defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground">
                <ChevronDown className="size-3.5" />
                {section} ({template.items.filter((i) => i.section === section).length})
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-2">
                {template.items
                  .filter((i) => i.section === section)
                  .map((item) => (
                    <TemplateItemRow
                      key={item.id}
                      item={item}
                      onSave={handleSaveItem}
                      onDelete={(id) => setDeleteItemId(id)}
                    />
                  ))}
              </CollapsibleContent>
            </Collapsible>
          ))}

          {/* Add item form */}
          {showAddForm ? (
            <div className="rounded-md border bg-muted/30 p-3 space-y-3">
              <p className="text-xs font-medium">New Item</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Section *</Label>
                  <Input
                    className="h-7 text-xs"
                    placeholder="e.g. Safety & Preparation"
                    value={newItem.section}
                    onChange={(e) =>
                      setNewItem((d) => ({ ...d, section: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs">Description *</Label>
                  <Textarea
                    className="min-h-[60px] text-xs"
                    placeholder="What the engineer must check or do..."
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem((d) => ({ ...d, description: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Expected Value</Label>
                  <Input
                    className="h-7 text-xs"
                    placeholder="e.g. < 300"
                    value={newItem.expectedValue}
                    onChange={(e) =>
                      setNewItem((d) => ({ ...d, expectedValue: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Unit</Label>
                  <Input
                    className="h-7 text-xs"
                    placeholder="e.g. μA"
                    value={newItem.unit}
                    onChange={(e) =>
                      setNewItem((d) => ({ ...d, unit: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-xs">
                  <Checkbox
                    checked={newItem.isCritical}
                    onCheckedChange={(v) =>
                      setNewItem((d) => ({ ...d, isCritical: v === true }))
                    }
                  />
                  Critical
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-xs">
                  <Checkbox
                    checked={newItem.requiresEvidence}
                    onCheckedChange={(v) =>
                      setNewItem((d) => ({ ...d, requiresEvidence: v === true }))
                    }
                  />
                  Requires evidence
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddItem}
                  disabled={isAdding || !newItem.description || !newItem.section}
                >
                  {isAdding && <Loader2 className="mr-2 size-3.5 animate-spin" />}
                  Add Item
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewItem(blankDraftItem())
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="mr-2 size-4" />
              Add Item
            </Button>
          )}
        </div>
      </div>

      {/* Delete item confirm */}
      <AlertDialog
        open={!!deleteItemId}
        onOpenChange={(v) => { if (!v) setDeleteItemId(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this checklist item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the item from the template. Existing completed
              checklists will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingItem}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
              disabled={isDeletingItem}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeletingItem ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete template confirm */}
      <AlertDialog
        open={deleteTemplateConfirm}
        onOpenChange={setDeleteTemplateConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entire template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the template and all its items. Existing completed
              checklists linked to service orders will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingTemplate}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              disabled={isDeletingTemplate}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeletingTemplate ? 'Deleting...' : 'Delete Template'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ── Create template wizard ────────────────────────────────────────────────────

const WIZARD_STEPS = ['Basic Info', 'Add Items', 'Review'] as const

function CreateTemplateWizard({
  open,
  onOpenChange,
  equipmentModelId,
  existingTypes,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  equipmentModelId: string
  existingTypes: string[]
}) {
  const [step, setStep] = React.useState(0)
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [name, setName] = React.useState('')
  const [serviceType, setServiceType] = React.useState('')
  const [estimatedMinutes, setEstimatedMinutes] = React.useState('60')
  const [items, setItems] = React.useState<DraftItem[]>([])
  const [newItem, setNewItem] = React.useState<DraftItem>(blankDraftItem())

  function reset() {
    setStep(0)
    setName('')
    setServiceType('')
    setEstimatedMinutes('60')
    setItems([])
    setNewItem(blankDraftItem())
    setError(null)
  }

  function handleClose(v: boolean) {
    if (!v) reset()
    onOpenChange(v)
  }

  function addItem() {
    if (!newItem.section || !newItem.description) return
    setItems((prev) => [...prev, { ...newItem }])
    setNewItem(blankDraftItem())
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleCreate() {
    if (!name || !serviceType || items.length === 0) {
      setError('Name, type and at least one item are required')
      return
    }
    setError(null)
    setIsPending(true)
    try {
      await createChecklistTemplate({
        equipmentModelId,
        name,
        serviceType,
        estimatedMinutes: parseInt(estimatedMinutes) || 60,
        items: items.map((item, index) => ({ ...item, order: index + 1 })),
      })
      handleClose(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create template')
    } finally {
      setIsPending(false)
    }
  }

  const availableTypes = SERVICE_TYPE_OPTIONS.filter(
    (o) => !existingTypes.includes(o.value)
  )

  const canStep1 = !!name && !!serviceType
  const canStep2 = items.length > 0

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex h-[85vh] max-w-2xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Checklist Template</DialogTitle>
          <DialogDescription>
            Define the checklist items for this equipment model and service type.
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center px-1">
          {WIZARD_STEPS.map((label, index) => {
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
                  {complete ? <Check className="size-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    'ml-2 text-sm',
                    active ? 'font-medium' : 'text-muted-foreground'
                  )}
                >
                  {label}
                </span>
                {index < WIZARD_STEPS.length - 1 && (
                  <ChevronRight className="mx-3 size-4 text-muted-foreground" />
                )}
              </div>
            )
          })}
        </div>

        <Separator />

        <ScrollArea className="-mr-2 min-h-0 flex-1 pr-4">
          {/* Step 1 — Basic Info */}
          {step === 0 && (
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label>Template Name *</Label>
                <Input
                  placeholder="Trilogy Evo — Preventive Maintenance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Service Type *</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTypes.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableTypes.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    All service types already have a template for this model.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Estimated Duration (minutes)</Label>
                <Input
                  type="number"
                  min={15}
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(e.target.value)}
                  className="max-w-[140px]"
                />
              </div>
            </div>
          )}

          {/* Step 2 — Add Items */}
          {step === 1 && (
            <div className="space-y-4 p-1">
              {/* New item form */}
              <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
                <p className="text-xs font-medium">Add Item</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Section *</Label>
                    <Input
                      className="h-7 text-xs"
                      placeholder="e.g. Safety & Preparation"
                      value={newItem.section}
                      onChange={(e) =>
                        setNewItem((d) => ({ ...d, section: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs">Description *</Label>
                    <Textarea
                      className="min-h-[60px] text-xs"
                      placeholder="What the engineer must check..."
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem((d) => ({ ...d, description: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Expected Value</Label>
                    <Input
                      className="h-7 text-xs"
                      placeholder="< 300"
                      value={newItem.expectedValue}
                      onChange={(e) =>
                        setNewItem((d) => ({ ...d, expectedValue: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Unit</Label>
                    <Input
                      className="h-7 text-xs"
                      placeholder="μA"
                      value={newItem.unit}
                      onChange={(e) =>
                        setNewItem((d) => ({ ...d, unit: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <Checkbox
                      checked={newItem.isCritical}
                      onCheckedChange={(v) =>
                        setNewItem((d) => ({ ...d, isCritical: v === true }))
                      }
                    />
                    Critical
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <Checkbox
                      checked={newItem.requiresEvidence}
                      onCheckedChange={(v) =>
                        setNewItem((d) => ({ ...d, requiresEvidence: v === true }))
                      }
                    />
                    Requires evidence
                  </label>
                </div>
                <Button
                  size="sm"
                  onClick={addItem}
                  disabled={!newItem.description || !newItem.section}
                >
                  <Plus className="mr-2 size-3.5" />
                  Add to List
                </Button>
              </div>

              {/* Items added so far */}
              {items.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {items.length} item{items.length !== 1 ? 's' : ''} added
                  </p>
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-md border bg-card px-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {item.isCritical && (
                            <AlertTriangle className="size-3 text-warning" />
                          )}
                          <p className="text-sm">{item.description}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.section}
                          {item.expectedValue &&
                            ` · ${item.expectedValue}${item.unit ? ` ${item.unit}` : ''}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 text-destructive hover:text-destructive"
                        onClick={() => removeItem(index)}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {items.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Add at least one item to continue.
                </p>
              )}
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 2 && (
            <div className="space-y-4 p-1">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium mb-3">Template Summary</p>
                <dl className="divide-y divide-border text-sm">
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="text-right font-medium">{name}</dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="text-right">
                      {typeLabels[serviceType] ?? serviceType}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd className="text-right">{estimatedMinutes} min</dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Total items</dt>
                    <dd className="text-right font-semibold">{items.length}</dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Critical items</dt>
                    <dd className="text-right">
                      {items.filter((i) => i.isCritical).length}
                    </dd>
                  </div>
                </dl>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
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
                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                {isPending ? 'Creating...' : 'Create Template'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Checklist summary card ────────────────────────────────────────────────────

function ChecklistSummaryCard({
  order,
  template,
  onEngineerOpen,
  onSupervisorEdit,
  isEngineer,
}: {
  order: ServiceOrderWithRelations
  template: ChecklistTemplate | null
  onEngineerOpen: () => void
  onSupervisorEdit: () => void
  isEngineer: boolean
}) {
  const checklist = order.checklist as ChecklistResponse | null
  const canEngineerEdit = isEngineer && ['ASSIGNED', 'IN_PROGRESS'].includes(order.status)
  const isComplete = !!checklist?.completedAt

  const total = template?.items.length ?? 0
  const completed = checklist?.items.filter((i) => i.status !== 'pending').length ?? 0
  const passed = checklist?.items.filter((i) => i.status === 'pass').length ?? 0
  const failed = checklist?.items.filter((i) => i.status === 'fail').length ?? 0
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium">
              {typeLabels[order.type] ?? order.type}
            </CardTitle>
            <CardDescription>
              OS {order.orderNumber.slice(0, 10)} ·{' '}
              {order.scheduledAt
                ? new Date(order.scheduledAt).toLocaleDateString('en-US')
                : 'Not scheduled'}
            </CardDescription>
          </div>
          <Badge
            className={cn(
              order.status === 'IN_PROGRESS' && 'bg-primary/10 text-primary',
              order.status === 'ASSIGNED' && 'bg-secondary text-secondary-foreground',
              order.status === 'COMPLETED' && 'bg-success/10 text-success',
              order.status === 'CLOSED' && 'bg-foreground/10 text-foreground',
              order.status === 'PENDING_CUSTOMER' && 'bg-warning/10 text-warning',
              order.status === 'PENDING_SIGNATURE' && 'bg-primary/10 text-primary',
              (order.status === 'DRAFT' || order.status === 'PENDING_PARTS') &&
                'bg-muted text-muted-foreground'
            )}
          >
            {order.status.replace(/_/g, ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {template && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{completed}/{total} items</span>
              {completed > 0 && (
                <span className="flex items-center gap-2">
                  <span className="text-success">{passed} pass</span>
                  <span className="text-destructive">{failed} fail</span>
                </span>
              )}
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {order.assignedTo && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Wrench className="size-3" />
              {order.assignedTo.name}
            </span>
          )}
          {order.laborHours && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" />
              {order.laborHours}h
            </span>
          )}
          {isComplete && (
            <Badge variant="outline" className="border-success/30 text-[10px] text-success">
              <Check className="mr-1 size-2.5" />
              Checklist done
            </Badge>
          )}
          {failed > 0 && (
            <Badge variant="outline" className="border-destructive/30 text-[10px] text-destructive">
              <AlertTriangle className="mr-1 size-2.5" />
              {failed} failed
            </Badge>
          )}
        </div>

        {/* Engineer CTA */}
        {canEngineerEdit && (
          <Button size="sm" className="w-full" onClick={onEngineerOpen}>
            <ClipboardList className="mr-2 size-4" />
            {completed > 0 ? 'Continue Checklist' : 'Start Checklist'}
          </Button>
        )}

        {/* Supervisor CTA */}
        {!isEngineer && openStatuses.includes(order.status) && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onSupervisorEdit}
          >
            <Settings2 className="mr-2 size-4" />
            Edit Order
          </Button>
        )}

        {order.status === 'DRAFT' && isEngineer && (
          <p className="text-center text-xs text-muted-foreground">
            Waiting for supervisor to assign this order.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ── Main tab ──────────────────────────────────────────────────────────────────

export function ChecklistTab({
  equipment,
  serviceOrders,
  templates,
  isSupervisor,
  engineers,
}: {
  equipment: EquipmentWithDetails
  serviceOrders: ServiceOrderWithRelations[]
  templates: ChecklistTemplate[]
  isSupervisor: boolean
  engineers: { id: string; name: string }[]
}) {
  const [activeOrder, setActiveOrder] = React.useState<ServiceOrderWithRelations | null>(null)
  const [engineerSheetOpen, setEngineerSheetOpen] = React.useState(false)
  const [editOrderOpen, setEditOrderOpen] = React.useState(false)
  const [editingTemplate, setEditingTemplate] = React.useState<ChecklistTemplate | null>(null)
  const [createWizardOpen, setCreateWizardOpen] = React.useState(false)

  const isEngineer = !isSupervisor

  const activeServiceOrders = serviceOrders.filter((o) =>
    openStatuses.includes(o.status)
  )
  const completedWithChecklist = serviceOrders.filter(
    (o) =>
      ['COMPLETED', 'PENDING_SIGNATURE', 'CLOSED'].includes(o.status) &&
      o.checklist !== null
  )

  function getTemplate(order: ServiceOrderWithRelations): ChecklistTemplate | null {
    return templates.find((t) => t.serviceType === order.type) ?? null
  }

  const existingTypes = templates.map((t) => t.serviceType)

  return (
    <div className="space-y-6 p-4">
      {/* Supervisor: template management */}
      {isSupervisor && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Checklist Templates ({templates.length})
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCreateWizardOpen(true)}
              disabled={existingTypes.length >= SERVICE_TYPE_OPTIONS.length}
            >
              <Plus className="mr-2 size-4" />
              New Template
            </Button>
          </div>

          {templates.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <ClipboardList className="mx-auto mb-3 size-8 text-muted-foreground/50" />
                <p className="text-sm font-medium">No templates configured</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create a checklist template for this equipment model to enable
                  structured maintenance records.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => setCreateWizardOpen(true)}
                >
                  <Plus className="mr-2 size-4" />
                  Create First Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {editingTemplate ? (
                <TemplateEditor
                  template={editingTemplate}
                  onClose={() => setEditingTemplate(null)}
                />
              ) : (
                <div className="space-y-2">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer transition-colors hover:border-primary/50"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium text-sm">{template.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {typeLabels[template.serviceType] ?? template.serviceType} ·{' '}
                            {template.items.length} items ·{' '}
                            {template.estimatedMinutes} min · v{template.version}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Pencil className="mr-1 size-3.5" />
                          Edit
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          <Separator />
        </div>
      )}

      {/* Active orders */}
      {serviceOrders.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <ClipboardList className="mx-auto mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">No service orders for this equipment</p>
          <p className="text-xs text-muted-foreground mt-1">
            Checklists are linked to Service Orders. Create a service order from
            the Service tab to start a checklist.
          </p>
        </div>
      ) : (
        <>
          {isEngineer && activeServiceOrders.length > 0 && (
            <Card className="border-primary/20 bg-primary/[0.03]">
              <CardContent className="flex items-start gap-3 p-4">
                <ClipboardList className="mt-0.5 size-4 text-primary shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">
                    {activeServiceOrders.length} active order
                    {activeServiceOrders.length !== 1 ? 's' : ''} for this equipment
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tap an order to open and complete its checklist. Progress
                    saves automatically and works offline.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeServiceOrders.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Active Orders
              </h3>
              {activeServiceOrders.map((order) => (
                <ChecklistSummaryCard
                  key={order.id}
                  order={order}
                  template={getTemplate(order)}
                  isEngineer={isEngineer}
                  onEngineerOpen={() => {
                    setActiveOrder(order)
                    setEngineerSheetOpen(true)
                  }}
                  onSupervisorEdit={() => {
                    setActiveOrder(order)
                    setEditOrderOpen(true)
                  }}
                />
              ))}
            </div>
          )}

          {/* Completed history */}
          {completedWithChecklist.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Checklist History
              </h3>
              {completedWithChecklist.map((order) => {
                const checklist = order.checklist as ChecklistResponse
                const passed = checklist.items.filter((i) => i.status === 'pass').length
                const failed = checklist.items.filter((i) => i.status === 'fail').length
                const total = checklist.items.length
                return (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">
                            {typeLabels[order.type] ?? order.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {checklist.completedAt
                              ? new Date(checklist.completedAt).toLocaleDateString('en-US')
                              : '—'}{' '}
                            · {order.assignedTo?.name ?? 'Unknown'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {failed === 0 ? (
                            <Badge className="bg-success/10 text-success">
                              <CheckCircle2 className="mr-1 size-3" />
                              All pass
                            </Badge>
                          ) : (
                            <Badge className="bg-warning/10 text-warning">
                              <AlertTriangle className="mr-1 size-3" />
                              {failed} failed
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {passed}/{total}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Engineer checklist sheet */}
      {isEngineer && (
        <EngineerOrderSheet
          order={activeOrder}
          template={activeOrder ? getTemplate(activeOrder) : null}
          open={engineerSheetOpen}
          onOpenChange={(v) => {
            setEngineerSheetOpen(v)
            if (!v) setActiveOrder(null)
          }}
        />
      )}

      {/* Supervisor edit order dialog */}
      {isSupervisor && (
        <SupervisorOrderEditDialog
          order={activeOrder}
          open={editOrderOpen}
          onOpenChange={(v) => {
            setEditOrderOpen(v)
            if (!v) setActiveOrder(null)
          }}
          engineers={engineers}
        />
      )}

      {/* Create template wizard */}
      <CreateTemplateWizard
        open={createWizardOpen}
        onOpenChange={setCreateWizardOpen}
        equipmentModelId={equipment.equipmentModel.id}
        existingTypes={existingTypes}
      />
    </div>
  )
}