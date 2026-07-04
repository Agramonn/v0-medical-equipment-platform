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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createOrganization } from '@/lib/actions/organizations'

export function AddOrganizationDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [name, setName] = React.useState('')
  const [type, setType] = React.useState('PRIVATE_HOSPITAL')
  const [address, setAddress] = React.useState('')
  const [city, setCity] = React.useState('')
  const [state, setState] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [website, setWebsite] = React.useState('')
  const [notes, setNotes] = React.useState('')

  function reset() {
    setName('')
    setType('PRIVATE_HOSPITAL')
    setAddress('')
    setCity('')
    setState('')
    setPhone('')
    setEmail('')
    setWebsite('')
    setNotes('')
    setError(null)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  async function handleSubmit() {
    if (!name || !city || !state) {
      setError('Name, city and state are required')
      return
    }
    setError(null)
    setIsPending(true)
    try {
      await createOrganization({ name, type, address, city, state, phone, email, website, notes })
      handleOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create organization')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Organization</DialogTitle>
          <DialogDescription>
            Register a new hospital, clinic or distributor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Organization Name *</Label>
              <Input
                placeholder="Hospital General de México"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IMSS">IMSS</SelectItem>
                  <SelectItem value="ISSSTE">ISSSTE</SelectItem>
                  <SelectItem value="SEDENA">SEDENA</SelectItem>
                  <SelectItem value="PEMEX">PEMEX</SelectItem>
                  <SelectItem value="STATE_HOSPITAL">State Hospital</SelectItem>
                  <SelectItem value="PRIVATE_HOSPITAL">Private Hospital</SelectItem>
                  <SelectItem value="CLINIC">Clinic</SelectItem>
                  <SelectItem value="LABORATORY">Laboratory</SelectItem>
                  <SelectItem value="DISTRIBUTOR">Distributor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              placeholder="Av. Principal 123, Col. Centro"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>City *</Label>
              <Input
                placeholder="Ciudad de México"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>State *</Label>
              <Input
                placeholder="CDMX"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                placeholder="55 1234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="contacto@hospital.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Website</Label>
            <Input
              placeholder="www.hospital.gob.mx"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isPending ? 'Saving...' : 'Save Organization'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}