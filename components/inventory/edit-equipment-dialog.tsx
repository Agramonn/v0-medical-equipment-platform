'use client'

import * as React from 'react'
import { Loader2, AlertCircle, Check, ChevronsUpDown, Package } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { updateEquipment } from '@/lib/actions/equipment'
import { EquipmentWithOrganization } from '@/lib/types'

type Organization = { id: string; name: string }

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
  const [hospitalSearch, setHospitalSearch] = React.useState(equipment.organization.name)
  const [hospitalOpen, setHospitalOpen] = React.useState(false)
  const [selectedHospital, setSelectedHospital] = React.useState(equipment.organization.id)

  const filteredHospitals = organizations.filter((org) =>
    org.name.toLowerCase().includes(hospitalSearch.toLowerCase())
  )

  // Reset state when equipment changes
  React.useEffect(() => {
    setHospitalSearch(equipment.organization.name)
    setSelectedHospital(equipment.organization.id)
    setError(null)
  }, [equipment.id])

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Equipment Unit</DialogTitle>
          <DialogDescription>
            Update the physical details of this unit. Model information is shared across all units.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-5">

          {/* Model info — read only */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Equipment Model (shared — not editable here)
            </p>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Package className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{equipment.equipmentModel.name}</p>
                <p className="text-sm text-muted-foreground">
                  {equipment.equipmentModel.manufacturer} · {equipment.equipmentModel.model}
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {equipment.equipmentModel.category}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Unit-specific fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-serialNumber">Serial Number *</Label>
              <Input
                id="edit-serialNumber"
                name="serialNumber"
                defaultValue={equipment.serialNumber}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-assetNumber">Asset Number *</Label>
              <Input
                id="edit-assetNumber"
                name="assetNumber"
                defaultValue={equipment.assetNumber}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Hospital *</Label>
              <div className="relative">
                <Input
                  placeholder="Search hospital..."
                  value={hospitalSearch}
                  onChange={(e) => {
                    setHospitalSearch(e.target.value)
                    setHospitalOpen(true)
                  }}
                  onFocus={() => setHospitalOpen(true)}
                  className="pr-10"
                />
                <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                {hospitalOpen && filteredHospitals.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-background border border-input rounded-md shadow-md mt-1 max-h-48 overflow-y-auto">
                    {filteredHospitals.map((hospital) => (
                      <button
                        key={hospital.id}
                        type="button"
                        onClick={() => {
                          setSelectedHospital(hospital.id)
                          setHospitalSearch(hospital.name)
                          setHospitalOpen(false)
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 hover:bg-accent text-sm flex items-center justify-between',
                          selectedHospital === hospital.id && 'bg-accent'
                        )}
                      >
                        <span>{hospital.name}</span>
                        {selectedHospital === hospital.id && (
                          <Check className="size-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                <input type="hidden" name="organizationId" value={selectedHospital} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status *</Label>
              <Select name="status" defaultValue={equipment.status}>
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
              <Input
                id="edit-department"
                name="department"
                defaultValue={equipment.department}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contractType">Contract Type</Label>
              <Select name="contractType" defaultValue={equipment.contractType ?? ''}>
                <SelectTrigger id="edit-contractType">
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
            <Label htmlFor="edit-location">Physical Location</Label>
            <Input
              id="edit-location"
              name="location"
              defaultValue={equipment.location}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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