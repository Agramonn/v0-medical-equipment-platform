'use client'

import * as React from 'react'
import { Loader2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createManualHistoryRecord } from '@/lib/actions/service-history'
import type { EquipmentOption } from '@/app/history/page'

const TYPE_OPTIONS = [
  { value: 'PREVENTIVE_MAINTENANCE', label: 'Preventive' },
  { value: 'CORRECTIVE_MAINTENANCE', label: 'Corrective' },
  { value: 'CALIBRATION', label: 'Calibration' },
  { value: 'INSPECTION', label: 'Inspection' },
  { value: 'INSTALLATION', label: 'Installation' },
]

export function AddHistoryDialog({
  engineers,
  equipmentOptions,
}: {
  engineers: { id: string; name: string }[]
  equipmentOptions: EquipmentOption[]
}) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [equipmentId, setEquipmentId] = React.useState('')
  const [engineerId, setEngineerId] = React.useState('')
  const [type, setType] = React.useState('PREVENTIVE_MAINTENANCE')

  const today = new Date().toISOString().slice(0, 10)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    formData.set('equipmentId', equipmentId)
    formData.set('engineerId', engineerId)
    formData.set('type', type)

    try {
      await createManualHistoryRecord(formData)
      setOpen(false)
      // Reset controlled fields for the next entry
      setEquipmentId('')
      setEngineerId('')
      setType('PREVENTIVE_MAINTENANCE')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save record')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Add Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Add Service History Record</DialogTitle>
          <DialogDescription>
            Log a service performed outside the platform (legacy or external work).
            Records generated from closed service orders appear automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="equipmentId">Equipment</Label>
              <Select value={equipmentId} onValueChange={setEquipmentId}>
                <SelectTrigger id="equipmentId">
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentOptions.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id}>
                      {eq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="engineerId">Engineer</Label>
              <Select value={engineerId} onValueChange={setEngineerId}>
                <SelectTrigger id="engineerId">
                  <SelectValue placeholder="Select engineer" />
                </SelectTrigger>
                <SelectContent>
                  {engineers.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Service Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Service Date</Label>
              <Input id="date" name="date" type="date" defaultValue={today} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary / Diagnosis</Label>
            <Input
              id="summary"
              name="summary"
              placeholder="e.g. Replaced oxygen sensor and recalibrated"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="findings">Findings & Observations</Label>
            <Textarea
              id="findings"
              name="findings"
              rows={2}
              placeholder="What was observed during the service"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail">Additional Detail</Label>
            <Textarea
              id="detail"
              name="detail"
              rows={2}
              placeholder="Root cause, corrective actions, recommendations..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="partsReplaced">Parts Replaced</Label>
              <Input
                id="partsReplaced"
                name="partsReplaced"
                placeholder="Comma separated"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple parts with commas.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceTime">Service Time (hours)</Label>
              <Input
                id="serviceTime"
                name="serviceTime"
                type="number"
                step="0.5"
                min="0"
                placeholder="e.g. 1.5"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isPending ? 'Saving...' : 'Save Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
