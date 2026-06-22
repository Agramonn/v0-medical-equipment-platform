import { Badge } from '@/components/ui/badge'
<<<<<<< HEAD
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
=======
import { cn } from '@/lib/utils'
import { ServiceOrderWithRelations } from '@/lib/types'

type Status = ServiceOrderWithRelations['status']
type Type = ServiceOrderWithRelations['type']
type Priority = ServiceOrderWithRelations['priority']

const statusConfig: Record<Status, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  ASSIGNED: { label: 'Assigned', className: 'bg-secondary text-secondary-foreground' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-primary/10 text-primary' },
  PENDING_PARTS: { label: 'Pending Parts', className: 'bg-warning/10 text-warning' },
  PENDING_CUSTOMER: { label: 'Pending Customer', className: 'bg-warning/10 text-warning' },
  COMPLETED: { label: 'Completed', className: 'bg-success/10 text-success' },
  PENDING_SIGNATURE: { label: 'Pending Signature', className: 'bg-primary/10 text-primary' },
  CLOSED: { label: 'Closed', className: 'bg-foreground/10 text-foreground' },
}

const typeConfig: Record<Type, { short: string; className: string }> = {
  PREVENTIVE_MAINTENANCE: { short: 'PM', className: 'border-primary/50 text-primary' },
  CORRECTIVE_MAINTENANCE: { short: 'CM', className: 'border-destructive/50 text-destructive' },
  CALIBRATION: { short: 'CAL', className: 'border-secondary-foreground/40 text-secondary-foreground' },
  INSPECTION: { short: 'INS', className: 'border-warning/50 text-warning' },
  INSTALLATION: { short: 'INST', className: 'border-success/50 text-success' },
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const meta = statusConfig[status]
  return <Badge className={cn(meta.className, className)}>{meta.label}</Badge>
}

export function TypeBadge({ type, className }: { type: Type; className?: string }) {
  const meta = typeConfig[type]
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
  return (
    <Badge variant="outline" className={cn(meta.className, className)}>
      {meta.short}
    </Badge>
  )
}

<<<<<<< HEAD
export function PriorityBadge({ priority }: { priority: ServicePriority }) {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>
    case 'high':
      return <Badge className="bg-warning text-warning-foreground">High</Badge>
    case 'medium':
=======
export function PriorityBadge({ priority }: { priority: Priority }) {
  switch (priority) {
    case 'CRITICAL':
      return <Badge variant="destructive">Critical</Badge>
    case 'HIGH':
      return <Badge className="bg-warning text-warning-foreground">High</Badge>
    case 'MEDIUM':
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
      return <Badge variant="secondary">Medium</Badge>
    default:
      return <Badge variant="outline">Low</Badge>
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
