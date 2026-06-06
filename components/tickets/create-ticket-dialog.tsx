'use client'

import * as React from 'react'
import { ImagePlus, Plus, Ticket as TicketIcon } from 'lucide-react'

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
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  ticketTypeConfig,
  type TicketType,
  type RequesterRole,
} from '@/lib/ticket-data'

interface PrefilledEquipment {
  id: string
  name: string
  manufacturer?: string
  model?: string
  serialNumber?: string
  hospital?: string
  department?: string
}

interface CreateTicketDialogProps {
  // When provided, the ticket is pre-linked to this equipment and the
  // equipment selector is locked. Used by the Equipment "Report Issue"
  // action and by Field Engineers creating tickets from the field.
  equipment?: PrefilledEquipment
  defaultType?: TicketType
  // The role of the person creating the ticket — controls default requester role.
  requesterRole?: RequesterRole
  trigger?: React.ReactNode
}

export function CreateTicketDialog({
  equipment,
  defaultType = 'corrective',
  requesterRole = 'Hospital Staff',
  trigger,
}: CreateTicketDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [type, setType] = React.useState<TicketType>(defaultType)

  React.useEffect(() => {
    if (open) setType(defaultType)
  }, [open, defaultType])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setOpen(false)
    toast.success('Ticket created', {
      description: equipment
        ? `A ${ticketTypeConfig[type].label} ticket was submitted for ${equipment.name}.`
        : `A ${ticketTypeConfig[type].label} ticket was submitted for review.`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="mr-2 size-4" />
            Create Ticket
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TicketIcon className="size-5" />
            Create Ticket
          </DialogTitle>
          <DialogDescription>
            A ticket is a service request reviewed before a service order is
            created.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Equipment context */}
          {equipment ? (
            <Card className="bg-muted/30">
              <CardContent className="grid gap-2 p-4 text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-2 sm:flex-col sm:justify-start">
                  <span className="text-muted-foreground">Equipment</span>
                  <span className="font-medium">{equipment.name}</span>
                </div>
                {equipment.serialNumber && (
                  <div className="flex justify-between gap-2 sm:flex-col sm:justify-start">
                    <span className="text-muted-foreground">Serial Number</span>
                    <span className="font-mono">{equipment.serialNumber}</span>
                  </div>
                )}
                {equipment.hospital && (
                  <div className="flex justify-between gap-2 sm:flex-col sm:justify-start">
                    <span className="text-muted-foreground">Hospital</span>
                    <span className="font-medium">{equipment.hospital}</span>
                  </div>
                )}
                {equipment.department && (
                  <div className="flex justify-between gap-2 sm:flex-col sm:justify-start">
                    <span className="text-muted-foreground">Department</span>
                    <span className="font-medium">{equipment.department}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              <Label>Related Equipment (optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Link equipment or leave blank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EQ-001">Ventilator V-2847 - Central Hospital</SelectItem>
                  <SelectItem value="EQ-004">Defibrillator D-0892 - Emergency Center</SelectItem>
                  <SelectItem value="EQ-005">CT Scanner CT-4521 - Central Hospital</SelectItem>
                  <SelectItem value="EQ-006">Anesthesia Machine A-2134 - Regional Medical Center</SelectItem>
                  <SelectItem value="EQ-008">Infusion Pump IP-3421 - Emergency Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="ticket-title">Title</Label>
            <Input id="ticket-title" placeholder="Short summary of the request" required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Ticket Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as TicketType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ticketTypeConfig) as TicketType[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {ticketTypeConfig[key].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ticket-requester">Requester</Label>
              <Input id="ticket-requester" placeholder="Name of requester" required />
            </div>
            <div className="space-y-2">
              <Label>Requester Role</Label>
              <Select defaultValue={requesterRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hospital Staff">Hospital Staff</SelectItem>
                  <SelectItem value="Field Engineer">Field Engineer</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Technical Support">Technical Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket-description">Description</Label>
            <Textarea
              id="ticket-description"
              placeholder="Describe the failure, request, or issue in detail..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="rounded-lg border-2 border-dashed p-6 text-center">
              <ImagePlus className="mx-auto mb-2 size-7 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop photos or documents, or click to upload
              </p>
              <Button type="button" variant="outline" size="sm" className="mt-2">
                Browse Files
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="mr-2 size-4" />
              Submit Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
