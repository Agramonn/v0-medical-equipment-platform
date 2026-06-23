'use client'

import * as React from 'react'
import { Plus, Loader2, AlertCircle, Check, ChevronsUpDown } from 'lucide-react'

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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { createEquipment } from '@/lib/actions/equipment'

const CONTRACT_TYPES = ['Full Service', 'Preventive Only', 'Warranty', 'Parts Only']

type Organization = {
  id: string
  name: string
}

export function AddEquipmentDialog({ organizations }: { organizations: Organization[] }) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [hospitalSearch, setHospitalSearch] = React.useState('')
  const [contractSearch, setContractSearch] = React.useState('')
  const [hospitalOpen, setHospitalOpen] = React.useState(false)
  const [contractOpen, setContractOpen] = React.useState(false)
  const [selectedHospital, setSelectedHospital] = React.useState<string>('')
  const [selectedContract, setSelectedContract] = React.useState<string>('')

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
      const result = await createEquipment(formData)
      setOpen(false)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al crear el equipo'
      setError(message)
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <div className="relative">
              <Input
                id="organizationId"
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input id="department" name="department" placeholder="ICU" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractType">Contract Type</Label>
              <div className="relative">
                <Input
                  id="contractType"
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
            <Label htmlFor="location">Physical Location</Label>
            <Input id="location" name="location" placeholder="Building A, Floor 3" />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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