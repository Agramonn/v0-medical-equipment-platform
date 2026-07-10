'use client'

import * as React from 'react'
import {
  AlertTriangle,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EquipmentWithDetails, SparePartRecord } from '@/lib/types'
import {
  createSparePart,
  updateSparePart,
  deleteSparePart,
} from '@/lib/actions/equipment-model'

function stockState(part: SparePartRecord) {
  if (part.stock === 0)
    return { label: 'Out of stock', className: 'bg-destructive/10 text-destructive' }
  if (part.stock < part.reorderLevel)
    return { label: 'Low stock', className: 'bg-warning/10 text-warning' }
  return { label: 'In stock', className: 'bg-success/10 text-success' }
}

// ── Part Form Dialog ──────────────────────────────────────────────────────────

function PartFormDialog({
  open,
  onOpenChange,
  equipmentModelId,
  part,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  equipmentModelId: string
  part?: SparePartRecord
}) {
  const isEdit = !!part
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [partNumber, setPartNumber] = React.useState(part?.partNumber ?? '')
  const [description, setDescription] = React.useState(part?.description ?? '')
  const [manufacturer, setManufacturer] = React.useState(part?.manufacturer ?? '')
  const [supplier, setSupplier] = React.useState(part?.supplier ?? '')
  const [estimatedCost, setEstimatedCost] = React.useState(part?.estimatedCost?.toString() ?? '')
  const [stock, setStock] = React.useState(part?.stock.toString() ?? '0')
  const [reorderLevel, setReorderLevel] = React.useState(part?.reorderLevel.toString() ?? '1')

  React.useEffect(() => {
    if (part) {
      setPartNumber(part.partNumber)
      setDescription(part.description)
      setManufacturer(part.manufacturer)
      setSupplier(part.supplier ?? '')
      setEstimatedCost(part.estimatedCost?.toString() ?? '')
      setStock(part.stock.toString())
      setReorderLevel(part.reorderLevel.toString())
    } else {
      setPartNumber('')
      setDescription('')
      setManufacturer('')
      setSupplier('')
      setEstimatedCost('')
      setStock('0')
      setReorderLevel('1')
    }
    setError(null)
  }, [part, open])

  async function handleSubmit() {
    if (!partNumber || !description || !manufacturer) {
      setError('Part number, description and manufacturer are required')
      return
    }
    setError(null)
    setIsPending(true)
    try {
      const data = {
        partNumber,
        description,
        manufacturer,
        supplier: supplier || undefined,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
        stock: parseInt(stock) || 0,
        reorderLevel: parseInt(reorderLevel) || 1,
      }
      if (isEdit && part) {
        await updateSparePart(part.id, data)
      } else {
        await createSparePart({ equipmentModelId, ...data })
      }
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save part')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Spare Part' : 'Add Spare Part'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the spare part details.'
              : 'Add a compatible spare part to this equipment model.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Part Number *</Label>
              <Input
                placeholder="PHI-FL-100"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Manufacturer *</Label>
              <Input
                placeholder="Philips"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Input
              placeholder="Air Inlet Filter"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Supplier</Label>
            <Input
              placeholder="Biomedical Supply MX"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Est. Cost (USD)</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="45.00"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Reorder At</Label>
              <Input
                type="number"
                min={0}
                value={reorderLevel}
                onChange={(e) => setReorderLevel(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Part'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Main tab ──────────────────────────────────────────────────────────────────

export function PartsTab({
  equipment,
  isSupervisor,
}: {
  equipment: EquipmentWithDetails
  isSupervisor: boolean
}) {
  const [query, setQuery] = React.useState('')
  const [addOpen, setAddOpen] = React.useState(false)
  const [editPart, setEditPart] = React.useState<SparePartRecord | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const parts = equipment.equipmentModel.spareParts

  const filtered = parts.filter((p) => {
    const q = query.toLowerCase()
    return (
      p.description.toLowerCase().includes(q) ||
      p.partNumber.toLowerCase().includes(q) ||
      p.manufacturer.toLowerCase().includes(q)
    )
  })

  const lowStockCount = parts.filter((p) => p.stock < p.reorderLevel).length

  async function handleDelete() {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteSparePart(deleteId)
      setDeleteId(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      {/* Low stock alert */}
      {lowStockCount > 0 && (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="size-5 text-warning shrink-0" />
            <p className="text-sm">
              <span className="font-medium">{lowStockCount} part(s)</span> below reorder level.
              Consider restocking soon.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search + Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parts..."
            className="pl-9"
          />
        </div>
        {isSupervisor && (
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 size-4" />
            Add Part
          </Button>
        )}
      </div>

      {/* Empty state */}
      {parts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <Package className="mx-auto mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">No spare parts catalog</p>
          <p className="text-xs text-muted-foreground mt-1">
            Compatible parts for {equipment.equipmentModel.manufacturer}{' '}
            {equipment.equipmentModel.model} have not been configured yet.
          </p>
          {isSupervisor && (
            <Button size="sm" variant="outline" className="mt-4" onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 size-4" />
              Add First Part
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Reorder At</TableHead>
                  <TableHead className="text-right">Est. Cost</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  {isSupervisor && <TableHead className="w-20" />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((part) => {
                  const state = stockState(part)
                  return (
                    <TableRow key={part.id}>
                      <TableCell>
                        <div className="font-medium">{part.description}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {part.partNumber}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{part.manufacturer}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {part.stock}
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                        {part.reorderLevel}
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums">
                        {part.estimatedCost != null ? `$${part.estimatedCost.toFixed(2)}` : '—'}
                      </TableCell>
                      <TableCell className="text-sm">{part.supplier ?? '—'}</TableCell>
                      <TableCell>
                        <Badge className={cn('tabular-nums', state.className)}>
                          {state.label}
                        </Badge>
                      </TableCell>
                      {isSupervisor && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => setEditPart(part)}
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(part.id)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isSupervisor ? 8 : 7} className="py-8 text-center text-sm text-muted-foreground">
                      No parts match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((part) => {
              const state = stockState(part)
              return (
                <Card key={part.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium">{part.description}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {part.partNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Badge className={state.className}>{state.label}</Badge>
                        {isSupervisor && (
                          <>
                            <Button variant="ghost" size="icon" className="size-8" onClick={() => setEditPart(part)}>
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive"
                              onClick={() => setDeleteId(part.id)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Manufacturer</p>
                        <p>{part.manufacturer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Supplier</p>
                        <p>{part.supplier ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Stock / Reorder</p>
                        <p className="tabular-nums">{part.stock} / {part.reorderLevel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Est. Cost</p>
                        <p className="tabular-nums">
                          {part.estimatedCost != null ? `$${part.estimatedCost.toFixed(2)}` : '—'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* Add dialog */}
      <PartFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        equipmentModelId={equipment.equipmentModel.id}
      />

      {/* Edit dialog */}
      <PartFormDialog
        open={!!editPart}
        onOpenChange={(v) => { if (!v) setEditPart(null) }}
        equipmentModelId={equipment.equipmentModel.id}
        part={editPart ?? undefined}
      />

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this spare part?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the part from the catalog for all units of this model.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}