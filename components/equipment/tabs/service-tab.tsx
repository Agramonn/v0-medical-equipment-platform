'use client'

import * as React from 'react'
import {
  CalendarClock,
  ClipboardCheck,
  FileText,
  Gauge,
  History as HistoryIcon,
  Microscope,
  Plus,
  ShieldCheck,
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
import { CreateServiceOrderWizard } from '@/components/service-orders/create-service-order-wizard'
import {
  PriorityBadge,
  StatusBadge,
  TypeBadge,
} from '@/components/service-orders/service-order-badges'
import { EquipmentWithDetails, ServiceOrderWithRelations, EquipmentOption } from '@/lib/types'


type EngineerOption = { id: string; name: string }

type ServiceType = ServiceOrderWithRelations['type']

const serviceActions: { type: ServiceType; Icon: typeof Wrench; label: string }[] = [
  { type: 'PREVENTIVE_MAINTENANCE', Icon: ShieldCheck, label: 'Preventive' },
  { type: 'CORRECTIVE_MAINTENANCE', Icon: Wrench, label: 'Corrective' },
  { type: 'CALIBRATION', Icon: Gauge, label: 'Calibration' },
  { type: 'INSPECTION', Icon: Microscope, label: 'Inspection' },
]

const typeLabels: Record<ServiceType, string> = {
  PREVENTIVE_MAINTENANCE: 'Preventive Maintenance',
  CORRECTIVE_MAINTENANCE: 'Corrective Maintenance',
  CALIBRATION: 'Calibration',
  INSPECTION: 'Inspection',
  INSTALLATION: 'Installation',
}

function typeTimelineMeta(type: ServiceType) {
  switch (type) {
    case 'CORRECTIVE_MAINTENANCE':
      return { Icon: Wrench, className: 'bg-destructive/10 text-destructive' }
    case 'CALIBRATION':
      return { Icon: Gauge, className: 'bg-primary/10 text-primary' }
    case 'INSPECTION':
      return { Icon: Microscope, className: 'bg-warning/10 text-warning' }
    case 'INSTALLATION':
      return { Icon: Plus, className: 'bg-success/10 text-success' }
    default:
      return { Icon: ShieldCheck, className: 'bg-success/10 text-success' }
  }
}

const openStatuses: ServiceOrderWithRelations['status'][] = [
  'DRAFT',
  'ASSIGNED',
  'IN_PROGRESS',
  'PENDING_PARTS',
  'PENDING_CUSTOMER',
  'COMPLETED',
  'PENDING_SIGNATURE',
]

export function ServiceTab({
  equipment,
  serviceOrders,
  equipmentList,
  engineers,
  currentUserId,
}: {
  equipment: EquipmentWithDetails
  serviceOrders: ServiceOrderWithRelations[]
  equipmentList: EquipmentOption[]
  engineers: EngineerOption[]
  currentUserId: string
}) {
  const [wizardOpen, setWizardOpen] = React.useState(false)
  const [presetType, setPresetType] = React.useState<ServiceType | undefined>()

  const openOrders = serviceOrders.filter((o) => openStatuses.includes(o.status))

  const sortedByDate = [...serviceOrders].sort((a, b) => {
    const dateA = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0
    const dateB = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0
    return dateB - dateA
  })

  const lastService = serviceOrders
    .filter((o) => o.status === 'CLOSED' || o.status === 'COMPLETED')
    .sort((a, b) => {
      const dateA = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0
      const dateB = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0
      return dateB - dateA
    })[0]

  const counts = serviceOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.type] = (acc[o.type] ?? 0) + 1
    return acc
  }, {})

  function launchWizard(type: ServiceType) {
    setPresetType(type)
    setWizardOpen(true)
  }

  return (
    <div className="space-y-6 p-4">
      {/* Service Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Service Actions</CardTitle>
          <CardDescription>
            Create a service order for this equipment. Equipment details are
            auto-populated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {serviceActions.map(({ type, Icon, label }) => (
              <Button
                key={type}
                variant="outline"
                className="h-auto flex-col items-start gap-2 p-4 text-left"
                onClick={() => launchWizard(type)}
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </span>
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Create {label.toLowerCase()} order
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="size-4" />
              <span className="text-xs">Open Service Orders</span>
            </div>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {openOrders.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ClipboardCheck className="size-4" />
              <span className="text-xs">Last Service</span>
            </div>
            <p className="mt-1 text-lg font-semibold">
              {lastService?.scheduledAt
                ? new Date(lastService.scheduledAt).toLocaleDateString('en-US')
                : equipment.lastServiceDate?.toLocaleDateString('en-US') ?? '—'}
            </p>
            <p className="text-xs text-muted-foreground">
              {lastService ? typeLabels[lastService.type] : 'No record yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarClock className="size-4" />
              <span className="text-xs">Next Scheduled</span>
            </div>
            <p className="mt-1 text-lg font-semibold text-primary">
              {equipment.nextServiceDate?.toLocaleDateString('en-US') ?? '—'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <HistoryIcon className="size-4" />
              <span className="text-xs">Total Records</span>
            </div>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {serviceOrders.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Service orders list */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Service Orders</CardTitle>
            <CardDescription>
              All service records for {equipment.equipmentModel.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedByDate.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No service orders yet. Use a Service Action above to create one.
              </p>
            )}
            {sortedByDate.map((order) => (
              <div
                key={order.id}
                className="flex w-full items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium">
                      {order.orderNumber.slice(0, 8)}
                    </span>
                    <TypeBadge type={order.type} />
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {order.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {order.scheduledAt
                      ? new Date(order.scheduledAt).toLocaleDateString('en-US')
                      : 'Not scheduled'}{' '}
                    · {order.assignedTo?.name ?? 'Unassigned'}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <StatusBadge status={order.status} />
                  <PriorityBadge priority={order.priority} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary by type */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Service Summary</CardTitle>
            <CardDescription>Records by service type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.keys(typeLabels) as ServiceType[]).map((type) => {
              const meta = typeTimelineMeta(type)
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <span className={cn('rounded-md p-1.5', meta.className)}>
                      <meta.Icon className="size-3.5" />
                    </span>
                    {typeLabels[type]}
                  </span>
                  <Badge variant="secondary" className="tabular-nums">
                    {counts[type] ?? 0}
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <CreateServiceOrderWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        equipmentList={equipmentList}
        engineers={engineers}
        currentUserId={currentUserId}
        presetEquipmentId={equipment.id}
        presetType={presetType}
      />
    </div>
  )
}