'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CalendarClock,
  ClipboardCheck,
  FileText,
  Gauge,
  History,
  ShieldCheck,
  Stethoscope,
  Ticket as TicketIcon,
  Wrench,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { equipmentData, recentActivity } from '@/lib/equipment-data'
import { getTicketsForEquipment } from '@/lib/ticket-data'
import { CreateServiceOrderFromEquipmentDialog } from '../create-service-order-from-equipment-dialog'
import { CreateTicketDialog } from '@/components/tickets/create-ticket-dialog'
import {
  TicketPriorityBadge,
  TicketStatusBadge,
} from '@/components/tickets/ticket-badges'

// Mock open service orders for this equipment (would be a DB query later).
const openServiceOrders = [
  {
    id: 'OS-2024-001',
    type: 'Corrective',
    status: 'In Progress',
    assignee: 'John Doe',
    scheduledDate: '2024-02-16',
  },
]

const serviceTimeline = [
  { type: 'Preventive', label: 'Preventive Maintenance', icon: ShieldCheck, count: 8 },
  { type: 'Corrective', label: 'Corrective Maintenance', icon: Wrench, count: 3 },
  { type: 'Calibration', label: 'Calibration', icon: Gauge, count: 5 },
  { type: 'Inspection', label: 'Inspection', icon: ClipboardCheck, count: 2 },
  { type: 'Installation', label: 'Installation', icon: FileText, count: 1 },
]

const serviceActions = [
  {
    type: 'Preventive' as const,
    label: 'Create Preventive Service Order',
    icon: ShieldCheck,
    className: 'text-success',
  },
  {
    type: 'Corrective' as const,
    label: 'Create Corrective Service Order',
    icon: Wrench,
    className: 'text-warning',
  },
  {
    type: 'Calibration' as const,
    label: 'Create Calibration Service Order',
    icon: Gauge,
    className: 'text-primary',
  },
  {
    type: 'Inspection' as const,
    label: 'Create Inspection Service Order',
    icon: ClipboardCheck,
    className: 'text-primary',
  },
]

const equipmentContext = {
  id: equipmentData.id,
  name: equipmentData.name,
  manufacturer: equipmentData.manufacturer,
  model: equipmentData.model,
  serialNumber: equipmentData.serialNumber,
  hospital: equipmentData.hospital,
  department: equipmentData.department,
}

export function ServiceActionsTab() {
  const relatedTickets = getTicketsForEquipment(equipmentData.id)
  const openTickets = relatedTickets.filter(
    (t) => t.status !== 'converted' && t.status !== 'rejected',
  )

  return (
    <div className="space-y-6 p-4">
      {/* Service Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="size-4 text-primary" />
            Service Actions
          </CardTitle>
          <CardDescription>
            Start a new service order or report an issue for this equipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceActions.map((action) => (
              <CreateServiceOrderFromEquipmentDialog
                key={action.type}
                type={action.type}
                trigger={
                  <Button
                    variant="outline"
                    className="h-auto justify-start gap-3 px-4 py-3 text-left"
                  >
                    <action.icon className={cn('size-5 shrink-0', action.className)} />
                    <span className="text-sm font-medium leading-tight text-pretty">
                      {action.label}
                    </span>
                  </Button>
                }
              />
            ))}

            {/* Report Issue -> creates a Corrective ticket linked to equipment */}
            <CreateTicketDialog
              equipment={equipmentContext}
              defaultType="corrective"
              requesterRole="Hospital Staff"
              trigger={
                <Button
                  variant="outline"
                  className="h-auto justify-start gap-3 border-destructive/40 px-4 py-3 text-left hover:bg-destructive/5"
                >
                  <AlertTriangle className="size-5 shrink-0 text-destructive" />
                  <span className="text-sm font-medium leading-tight text-pretty">
                    Report Issue
                  </span>
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Key metrics */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Service Overview</CardTitle>
            <CardDescription>Current service status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <span className="text-sm">Open Service Orders</span>
              </div>
              <span className="text-lg font-semibold tabular-nums">
                {openServiceOrders.length}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
              <div className="flex items-center gap-2">
                <TicketIcon className="size-4 text-primary" />
                <span className="text-sm">Related Tickets</span>
              </div>
              <span className="text-lg font-semibold tabular-nums">
                {openTickets.length}
              </span>
            </div>
            <Separator />
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Service Date</span>
                <span className="font-medium">{equipmentData.lastService}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Next Scheduled</span>
                <span className="font-medium text-primary">
                  {equipmentData.nextService}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Open service orders + recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Open Service Orders</CardTitle>
            <CardDescription>Active work on this equipment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {openServiceOrders.length > 0 ? (
              openServiceOrders.map((order) => (
                <Link
                  key={order.id}
                  href="/service-orders"
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-warning/10 p-2">
                      <Wrench className="size-4 text-warning" />
                    </div>
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {order.id}
                      </p>
                      <p className="text-sm font-medium">
                        {order.type} · {order.assignee}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{order.status}</Badge>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarClock className="size-3" />
                      {order.scheduledDate}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No open service orders.
              </p>
            )}

            <Separator />

            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                <History className="size-4 text-muted-foreground" />
                Recent Service Activity
              </p>
              <div className="space-y-3">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5 shrink-0 text-[10px]">
                      {item.type}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.date} · {item.engineer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TicketIcon className="size-4 text-primary" />
            Related Tickets
          </CardTitle>
          <CardDescription>
            Service requests linked to this equipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {relatedTickets.length > 0 ? (
            <div className="space-y-2">
              {relatedTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href="/tickets"
                  className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted-foreground">
                      {ticket.ticketNumber}
                    </p>
                    <p className="truncate text-sm font-medium">{ticket.title}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <TicketPriorityBadge priority={ticket.priority} />
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No tickets for this equipment.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Service timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Service Timeline</CardTitle>
          <CardDescription>Lifetime service activity by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {serviceTimeline.map((item) => (
              <div
                key={item.type}
                className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center"
              >
                <div className="rounded-lg bg-muted p-2">
                  <item.icon className="size-5 text-muted-foreground" />
                </div>
                <span className="text-2xl font-semibold tabular-nums">
                  {item.count}
                </span>
                <span className="text-xs leading-tight text-muted-foreground text-pretty">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
