'use client'

import * as React from 'react'
import { Settings2, Loader2, AlertCircle, Check, ChevronsUpDown } from 'lucide-react'

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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { updateEquipment } from '@/lib/actions/equipment'
import { EquipmentWithOrganization } from '@/lib/types'

const CONTRACT_TYPES = ['Full Service', 'Preventive Only', 'Warranty', 'Parts Only']

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
  const [hospitalSearch, setHospitalSearch] = React.useState(equipment.organization.name)
  const [contractSearch, setContractSearch] = React.useState(equipment.contractType ?? '')
  const [hospitalOpen, setHospitalOpen] = React.useState(false)
  const [contractOpen, setContractOpen] = React.useState(false)
  const [selectedHospital, setSelectedHospital] = React.useState<string>(equipment.organization.id)
  const [selectedContract, setSelectedContract] = React.useState<string>(equipment.contractType ?? '')

  const filteredHospitals = organizations.filter((org) =>
    org.name.toLowerCase().includes(hospitalSearch.toLowerCase())
  )

  const filteredContracts = CONTRACT_TYPES.filter((type) =>
    type.toLowerCase().includes(contractSearch.toLowerCase())
  )

  async function handleSubmit(formData: FormData) {
    setError(null)
    setIsPending(true)
    try {
      await updateEquipment(equipment.id, formData)
      onOpenChange(false)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al actualizar el equipo'
      setError(message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <div className="relative">
                <Input
                  id="edit-organizationId"
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
                  <div className="absolute top-full left-0 right-0 z-50 bg-background border border-input rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
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
                <input type="hidden" name="organizationId" value={selectedHospital} required />
              </div>
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
              <div className="relative">
                <Input
                  id="edit-contractType"
                  name="contractType"
                  placeholder="Full Service, Warranty, etc..."
                  value={contractSearch}
                  onChange={(e) => {
                    setContractSearch(e.target.value)
                    setSelectedContract(e.target.value)
                    setContractOpen(true)
                  }}
                  onFocus={() => setContractOpen(true)}
                  className="pr-10"
                />
                <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                {contractOpen && contractSearch && filteredContracts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-background border border-input rounded-md shadow-md mt-1 max-h-40 overflow-y-auto">
                    {filteredContracts.map((contract) => (
                      <button
                        key={contract}
                        type="button"
                        onClick={() => {
                          setContractSearch(contract)
                          setSelectedContract(contract)
                          setContractOpen(false)
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 hover:bg-accent text-sm',
                          selectedContract === contract && 'bg-accent'
                        )}
                      >
                        {contract}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-location">Physical Location</Label>
            <Input id="edit-location" name="location" defaultValue={equipment.location} />
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