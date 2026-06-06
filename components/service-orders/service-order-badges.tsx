import { Badge } from '@/components/ui/badge'
import {
  serviceOrderStatusConfig,
  serviceTypeConfig,
  type ServiceOrderStatus,
  type ServiceType,
  type ServicePriority,
} from '@/lib/service-order-data'
import { cn } from '@/lib/utils'

export function StatusBadge({
  status,
  className,
}: {
  status: ServiceOrderStatus
  className?: string
}) {
  const meta = serviceOrderStatusConfig[status]
  return <Badge className={cn(meta.className, className)}>{meta.label}</Badge>
}

export function TypeBadge({
  type,
  className,
}: {
  type: ServiceType
  className?: string
}) {
  const meta = serviceTypeConfig[type]
  return (
    <Badge variant="outline" className={cn(meta.className, className)}>
      {meta.short}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: ServicePriority }) {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>
    case 'high':
      return <Badge className="bg-warning text-warning-foreground">High</Badge>
    case 'medium':
      return <Badge variant="secondary">Medium</Badge>
    default:
      return <Badge variant="outline">Low</Badge>
  }
}
