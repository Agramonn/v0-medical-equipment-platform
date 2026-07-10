'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { ServiceOrderWithRelations } from '@/lib/types'
import { updateServiceOrderFields } from '@/lib/actions/checklist-templates'

export function SupervisorOrderEditDialog({
  order,
  open,
  onOpenChange,
  engineers,
}: {
  order: ServiceOrderWithRelations | null
  open: boolean
  onOpenChange: (v: boolean) => void
  engineers: { id: string; name: string }[]
}) {
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [title, setTitle] = React.useState('')
  const [priority, setPriority] = React.useState('MEDIUM')
  const [assignedToId, setAssignedToId] = React.useState('')
  const [scheduledAt, setScheduledAt] = React.useState('')
  const [estimatedHours, setEstimatedHours] = React.useState('')
  const [description, setDescription] = React.useState('')

  React.useEffect(() => {
    if (order) {
      setTitle(order.title)
      setPriority(order.priority)
      setAssignedToId(order.assignedTo?.id ?? 'unassigned')
      setScheduledAt(
        order.scheduledAt
          ? new Date(order.scheduledAt).toISOString().split('T')[0]
          : ''
      )
      setEstimatedHours(order.estimatedHours?.toString() ?? '')
      setDescription(order.description ?? '')
      setError(null)
    }
  }, [order?.id])

  if (!order) return null

  async function handleSubmit() {
    if (!title) {
      setError('Title is required')
      return
    }
    setError(null)
    setIsPending(true)
    try {
      await updateServiceOrderFields(order!.id, {
        title,
        priority,
        assignedToId: assignedToId === 'unassigned' ? undefined : assignedToId,
        scheduledAt: scheduledAt || undefined,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
        description: description || undefined,
      })
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update order')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Service Order</DialogTitle>
          <DialogDescription>
            {order.orderNumber.slice(0, 12)} · {order.equipment.equipmentModel.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assigned Engineer</Label>
              <Select value={assignedToId} onValueChange={setAssignedToId}>
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {engineers.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Scheduled Date</Label>
              <Input
                type="date"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Estimated Hours</Label>
              <Input
                type="number"
                min={0}
                step={0.5}
                placeholder="e.g. 2.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Additional details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
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