'use client'

import * as React from 'react'
import { ArrowRight, CheckCircle2, FileText } from 'lucide-react'

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
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ticketTypeConfig, type Ticket } from '@/lib/ticket-data'

interface ConvertTicketDialogProps {
  ticket: Ticket
  trigger?: React.ReactNode
}

// Supervisor action: convert an approved ticket into a Service Order.
// The service-specific fields are inherited from the ticket so the supervisor
// only confirms scheduling and assignment.
export function ConvertTicketDialog({ ticket, trigger }: ConvertTicketDialogProps) {
  const [open, setOpen] = React.useState(false)
  const serviceType = ticketTypeConfig[ticket.type].serviceOrderType

  function handleConvert(event: React.FormEvent) {
    event.preventDefault()
    setOpen(false)
    toast.success('Converted to Service Order', {
      description: `${ticket.ticketNumber} is now a ${serviceType} service order.`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <ArrowRight className="mr-2 size-4" />
            Convert to Service Order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Convert to Service Order
          </DialogTitle>
          <DialogDescription>
            Create a service order from {ticket.ticketNumber}. Equipment and
            request details are carried over automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConvert} className="space-y-4">
          <Card className="bg-muted/30">
            <CardContent className="space-y-2 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Source Ticket</span>
                <span className="font-mono">{ticket.ticketNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Service Type</span>
                <Badge variant="outline">{serviceType}</Badge>
              </div>
              {ticket.equipmentName && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Equipment</span>
                  <span className="font-medium">{ticket.equipmentName}</span>
                </div>
              )}
              {ticket.hospital && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hospital</span>
                  <span className="font-medium">{ticket.hospital}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Priority</span>
                <span className="font-medium capitalize">{ticket.priority}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Assign Engineer</Label>
              <Select defaultValue={ticket.assignee ?? undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select engineer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled-date">Scheduled Date</Label>
              <Input id="scheduled-date" type="date" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <CheckCircle2 className="mr-2 size-4" />
              Create Service Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
