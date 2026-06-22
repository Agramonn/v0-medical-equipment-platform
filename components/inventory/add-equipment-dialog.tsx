'use client'

import * as React from 'react'
import { Plus, Loader2 } from 'lucide-react'

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
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createEquipment } from '@/lib/actions/equipment'

type Organization = {
  id: string
  name: string
}

export function AddEquipmentDialog({ organizations }: { organizations: Organization[] }) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setIsPending(true)
    try {
      await createEquipment(formData)
      setOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create equipment')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
          <DialogDescription>
            Register a new biomedical equipment in the inventory.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name *</Label>
              <Input id="name" name="name" placeholder="Ventilator V-3001" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input id="category" name="category" placeholder="Respiratory Therapy" required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input id="manufacturer" name="manufacturer" placeholder="Philips" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input id="model" name="model" placeholder="Trilogy Evo" required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number *</Label>
              <Input id="serialNumber" name="serialNumber" placeholder="SN-3001-PHL-001" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetNumber">Asset Number *</Label>
              <Input id="assetNumber" name="assetNumber" placeholder="AST-100500" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationId">Hospital *</Label>
            <Select name="organizationId" required>
              <SelectTrigger id="organizationId">
                <SelectValue placeholder="Select a hospital" />
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
              <Label htmlFor="department">Department *</Label>
              <Input id="department" name="department" placeholder="ICU" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractType">Contract Type</Label>
              <Input id="contractType" name="contractType" placeholder="Full Service" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Physical Location</Label>
            <Input id="location" name="location" placeholder="Building A, Floor 3" />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isPending ? 'Saving...' : 'Save Equipment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}