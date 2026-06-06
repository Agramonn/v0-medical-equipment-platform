'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Paperclip,
  Ticket as TicketIcon,
  UserPlus,
  XCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ticketTypeConfig, type Ticket } from '@/lib/ticket-data'
import {
  TicketPriorityBadge,
  TicketStatusBadge,
} from './ticket-badges'
import { ConvertTicketDialog } from './convert-ticket-dialog'

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}

export function TicketDetailSheet({
  ticket,
  trigger,
}: {
  ticket: Ticket
  trigger?: React.ReactNode
}) {
  const canReview = ticket.status === 'new'
  const canDecide = ticket.status === 'under-review'
  const canConvert = ticket.status === 'approved'

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon">
            <Eye className="size-4" />
            <span className="sr-only">View ticket</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-[520px]">
        <SheetHeader className="space-y-1 border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2">
            <TicketIcon className="size-5" />
            {ticket.ticketNumber}
          </SheetTitle>
          <SheetDescription>{ticket.title}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 px-6 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
            </div>

            <Card>
              <CardContent className="grid grid-cols-2 gap-4 p-4">
                <Field label="Type" value={ticketTypeConfig[ticket.type].label} />
                <Field label="Requester" value={ticket.requester} />
                <Field label="Requester Role" value={ticket.requesterRole} />
                <Field label="Created" value={ticket.createdAt} />
                {ticket.equipmentName && (
                  <Field
                    label="Equipment"
                    value={
                      ticket.equipmentId ? (
                        <Link
                          href={`/equipment/${ticket.equipmentId}`}
                          className="text-primary hover:underline"
                        >
                          {ticket.equipmentName}
                        </Link>
                      ) : (
                        ticket.equipmentName
                      )
                    }
                  />
                )}
                {ticket.hospital && <Field label="Hospital" value={ticket.hospital} />}
                {ticket.department && (
                  <Field label="Department" value={ticket.department} />
                )}
                {ticket.assignee && <Field label="Assignee" value={ticket.assignee} />}
              </CardContent>
            </Card>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Description
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {ticket.description}
              </p>
            </div>

            {ticket.attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Attachments
                </p>
                <div className="space-y-2">
                  {ticket.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 rounded-lg border p-2 text-sm"
                    >
                      <Paperclip className="size-4 text-muted-foreground" />
                      <span className="flex-1 truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ticket.convertedOrderId && (
              <Card className="border-primary/30 bg-primary/[0.03]">
                <CardContent className="flex items-center justify-between p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />
                    <span>Converted to service order</span>
                  </div>
                  <Link
                    href="/service-orders"
                    className="font-mono text-primary hover:underline"
                  >
                    {ticket.convertedOrderId}
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Supervisor workflow actions */}
        {(canReview || canDecide || canConvert) && (
          <div className="space-y-3 border-t px-6 py-4">
            {canDecide && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Assign Engineer
                </p>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select engineer (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Separator />
            <div className="flex flex-wrap gap-2">
              {canReview && (
                <Button
                  className="flex-1"
                  onClick={() =>
                    toast.success('Ticket moved to Under Review', {
                      description: ticket.ticketNumber,
                    })
                  }
                >
                  <Eye className="mr-2 size-4" />
                  Start Review
                </Button>
              )}
              {canDecide && (
                <>
                  <Button
                    className="flex-1"
                    onClick={() =>
                      toast.success('Ticket approved', {
                        description: `${ticket.ticketNumber} is ready to convert.`,
                      })
                    }
                  >
                    <CheckCircle2 className="mr-2 size-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() =>
                      toast('Ticket rejected', {
                        description: ticket.ticketNumber,
                      })
                    }
                  >
                    <XCircle className="mr-2 size-4" />
                    Reject
                  </Button>
                </>
              )}
              {canConvert && (
                <ConvertTicketDialog
                  ticket={ticket}
                  trigger={
                    <Button className="flex-1">
                      <ArrowRight className="mr-2 size-4" />
                      Convert to Service Order
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
