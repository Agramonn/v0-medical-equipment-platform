'use client'

import * as React from 'react'
import { Settings2, Loader2 } from 'lucide-react'

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateEquipment } from '@/lib/actions/equipment'
import { EquipmentWithOrganization } from '@/lib/types'

type Organization = {
  id: string
  name: string
}

export function EditEquipmentDialog({
  equipment,
  organizations,
  open,
  onOpenChange,
}: {
  equipment: EquipmentWithOrganization
  organizations: Organization[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setIsPending(true)
    try {
      await updateEquipment(equipment.id, formData)
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update equipment')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>
            Update the details for {equipment.name}.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Equipment Name *</Label>
              <Input id="edit-name" name="name" defaultValue={equipment.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Input id="edit-category" name="category" defaultValue={equipment.category} required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-manufacturer">Manufacturer *</Label>
              <Input id="edit-manufacturer" name="manufacturer" defaultValue={equipment.manufacturer} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-model">Model *</Label>
              <Input id="edit-model" name="model" defaultValue={equipment.model} required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-serialNumber">Serial Number *</Label>
              <Input id="edit-serialNumber" name="serialNumber" defaultValue={equipment.serialNumber} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-assetNumber">Asset Number *</Label>
              <Input id="edit-assetNumber" name="assetNumber" defaultValue={equipment.assetNumber} required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-organizationId">Hospital *</Label>
              <Select name="organizationId" defaultValue={equipment.organization.id} required>
                <SelectTrigger id="edit-organizationId">
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
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status *</Label>
              <Select name="status" defaultValue={equipment.status} required>
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPERATIONAL">Operational</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="NEEDS_ATTENTION">Needs Attention</SelectItem>
                  <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department *</Label>
              <Input id="edit-department" name="department" defaultValue={equipment.department} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contractType">Contract Type</Label>
              <Input id="edit-contractType" name="contractType" defaultValue={equipment.contractType ?? ''} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-location">Physical Location</Label>
            <Input id="edit-location" name="location" defaultValue={equipment.location} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}