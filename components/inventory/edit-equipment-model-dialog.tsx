'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'

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
import { EquipmentModel } from '@/lib/types'
import { updateEquipmentModel } from '@/lib/actions/equipment'

export function EditEquipmentModelDialog({
  model,
  open,
  onOpenChange,
}: {
  model: EquipmentModel | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [name, setName] = React.useState('')
  const [manufacturer, setManufacturer] = React.useState('')
  const [modelStr, setModelStr] = React.useState('')
  const [category, setCategory] = React.useState('')

  React.useEffect(() => {
    if (model) {
      setName(model.name)
      setManufacturer(model.manufacturer)
      setModelStr(model.model)
      setCategory(model.category)
      setError(null)
    }
  }, [model])

  async function handleSubmit() {
    if (!model || !name || !manufacturer || !modelStr || !category) {
      setError('All fields are required')
      return
    }
    setError(null)
    setIsPending(true)
    try {
      await updateEquipmentModel(model.id, { name, manufacturer, model: modelStr, category })
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update model')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Equipment Model</DialogTitle>
          <DialogDescription>
            Changes apply to all units of this model.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Equipment Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anesthesia Machine"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Manufacturer *</Label>
              <Input
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="Penlon"
              />
            </div>
            <div className="space-y-2">
              <Label>Model *</Label>
              <Input
                value={modelStr}
                onChange={(e) => setModelStr(e.target.value)}
                placeholder="Prima 320 Advance"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category *</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Anesthesia"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}