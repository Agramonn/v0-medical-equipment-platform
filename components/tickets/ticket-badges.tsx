import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  ticketStatusConfig,
  ticketPriorityConfig,
  ticketTypeConfig,
  type TicketStatus,
  type TicketPriority,
  type TicketType,
} from '@/lib/ticket-data'

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const config = ticketStatusConfig[status]
  return <Badge className={cn('font-normal', config.className)}>{config.label}</Badge>
}

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  const config = ticketPriorityConfig[priority]
  return <Badge className={cn('font-normal', config.className)}>{config.label}</Badge>
}

export function TicketTypeBadge({ type }: { type: TicketType }) {
  return (
    <Badge variant="outline" className="font-normal">
      {ticketTypeConfig[type].shortLabel}
    </Badge>
  )
}
