'use client'

import * as React from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  Inbox,
  Search,
  Ticket as TicketIcon,
  XCircle,
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
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  tickets as allTickets,
  ticketTypeConfig,
  type Ticket,
  type TicketStatus,
} from '@/lib/ticket-data'
import {
  TicketPriorityBadge,
  TicketStatusBadge,
  TicketTypeBadge,
} from '@/components/tickets/ticket-badges'
import { TicketDetailSheet } from '@/components/tickets/ticket-detail-sheet'
import { ConvertTicketDialog } from '@/components/tickets/convert-ticket-dialog'
import { CreateTicketDialog } from '@/components/tickets/create-ticket-dialog'

type QueueKey = 'all' | TicketStatus

const queues: { key: QueueKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'under-review', label: 'Under Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'converted', label: 'Converted' },
]

const summaryCards = [
  {
    key: 'new' as TicketStatus,
    label: 'New',
    icon: Inbox,
    className: 'bg-primary/10 text-primary',
  },
  {
    key: 'under-review' as TicketStatus,
    label: 'Under Review',
    icon: Clock,
    className: 'bg-warning/10 text-warning',
  },
  {
    key: 'approved' as TicketStatus,
    label: 'Approved',
    icon: CheckCircle2,
    className: 'bg-success/10 text-success',
  },
  {
    key: 'rejected' as TicketStatus,
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive',
  },
]

export function TicketManagementContent() {
  const [query, setQuery] = React.useState('')
  const [activeQueue, setActiveQueue] = React.useState<QueueKey>('all')

  const counts = React.useMemo(() => {
    return allTickets.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] ?? 0) + 1
        return acc
      },
      {} as Record<TicketStatus, number>,
    )
  }, [])

  const filtered = React.useMemo(() => {
    return allTickets.filter((t) => {
      const matchesQueue = activeQueue === 'all' || t.status === activeQueue
      const haystack = `${t.ticketNumber} ${t.title} ${t.equipmentName ?? ''} ${t.requester}`.toLowerCase()
      const matchesQuery = haystack.includes(query.toLowerCase())
      return matchesQueue && matchesQuery
    })
  }, [activeQueue, query])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-balance">
            <TicketIcon className="size-6 text-primary" />
            Ticket Management
          </h1>
          <p className="text-muted-foreground">
            Review service requests and convert approved tickets into service orders
          </p>
        </div>
        <CreateTicketDialog requesterRole="Hospital Staff" />
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card
            key={card.key}
            className="cursor-pointer transition-colors hover:border-primary/30"
            onClick={() => setActiveQueue(card.key)}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-3xl font-semibold tabular-nums">
                  {counts[card.key] ?? 0}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
              </div>
              <div className={cn('rounded-lg p-2', card.className)}>
                <card.icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Queue table */}
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-medium">Ticket Queues</CardTitle>
              <CardDescription>
                Organize tickets by their position in the review workflow
              </CardDescription>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            value={activeQueue}
            onValueChange={(v) => setActiveQueue(v as QueueKey)}
          >
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
              {queues.map((queue) => (
                <TabsTrigger key={queue.key} value={queue.key} className="gap-1.5">
                  {queue.label}
                  <Badge variant="secondary" className="ml-1 px-1.5 text-[10px]">
                    {queue.key === 'all'
                      ? allTickets.length
                      : counts[queue.key] ?? 0}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Equipment</TableHead>
                  <TableHead className="hidden lg:table-cell">Requester</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-mono text-xs text-muted-foreground">
                          {ticket.ticketNumber}
                        </p>
                        <p className="font-medium leading-tight">{ticket.title}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <TicketTypeBadge type={ticket.type} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {ticket.equipmentName ? (
                        <span className="text-sm">{ticket.equipmentName}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm">{ticket.requester}</span>
                    </TableCell>
                    <TableCell>
                      <TicketPriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell>
                      <TicketStatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {ticket.status === 'approved' && (
                          <ConvertTicketDialog
                            ticket={ticket}
                            trigger={
                              <Button variant="ghost" size="icon" title="Convert to Service Order">
                                <ArrowRight className="size-4 text-primary" />
                              </Button>
                            }
                          />
                        )}
                        <TicketDetailSheet ticket={ticket} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No tickets in this queue.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
