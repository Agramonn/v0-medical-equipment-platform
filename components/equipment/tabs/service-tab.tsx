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
import { equipmentData } from '@/lib/equipment-data'
import {
  getServiceOrdersForEquipment,
  openStatuses,
  serviceTypeConfig,
  type EquipmentSnapshot,
  type ServiceOrder,
  type ServiceType,
} from '@/lib/service-order-data'
import { CreateServiceOrderWizard } from '@/components/service-orders/create-service-order-wizard'
import { ServiceOrderDetailSheet } from '@/components/service-orders/service-order-detail-sheet'
import {
  PriorityBadge,
  StatusBadge,
  TypeBadge,
} from '@/components/service-orders/service-order-badges'

// Equipment snapshot derived from the equipment record. A Service Order
// created from here auto-populates all of these fields.
const equipmentSnapshot: EquipmentSnapshot = {
  equipmentId: equipmentData.id,
  name: equipmentData.name,
  manufacturer: equipmentData.manufacturer,
  model: equipmentData.model,
  serialNumber: equipmentData.serialNumber,
  assetNumber: equipmentData.assetNumber,
  hospital: equipmentData.hospital,
  department: equipmentData.department,
  contract: equipmentData.contractType,
}

const serviceActions: { type: ServiceType; Icon: typeof Wrench; label: string }[] = [
  { type: 'Preventive Maintenance', Icon: ShieldCheck, label: 'Preventive' },
  { type: 'Corrective Maintenance', Icon: Wrench, label: 'Corrective' },
  { type: 'Calibration', Icon: Gauge, label: 'Calibration' },
  { type: 'Inspection', Icon: Microscope, label: 'Inspection' },
]

function typeTimelineMeta(type: ServiceType) {
  switch (type) {
    case 'Corrective Maintenance':
      return { Icon: Wrench, className: 'bg-destructive/10 text-destructive' }
    case 'Calibration':
      return { Icon: Gauge, className: 'bg-primary/10 text-primary' }
    case 'Inspection':
      return { Icon: Microscope, className: 'bg-warning/10 text-warning' }
    case 'Installation':
      return { Icon: Plus, className: 'bg-success/10 text-success' }
    default:
      return { Icon: ShieldCheck, className: 'bg-success/10 text-success' }
  }
}

export function ServiceTab() {
  const orders = getServiceOrdersForEquipment(equipmentData.id)

  const [wizardOpen, setWizardOpen] = React.useState(false)
  const [presetType, setPresetType] = React.useState<ServiceType | undefined>()
  const [activeOrder, setActiveOrder] = React.useState<ServiceOrder | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)

  const openOrders = orders.filter((o) => openStatuses.includes(o.status))

  const sortedByDate = [...orders].sort(
    (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime(),
  )

  // Service Overview metrics
  const lastService = orders
    .filter((o) => o.status === 'closed' || o.status === 'completed')
    .sort(
      (a, b) =>
        new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime(),
    )[0]

  const counts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.type] = (acc[o.type] ?? 0) + 1
    return acc
  }, {})

  function launchWizard(type: ServiceType) {
    setPresetType(type)
    setWizardOpen(true)
  }

  function openDetail(order: ServiceOrder) {
    setActiveOrder(order)
    setDetailOpen(true)
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
              {lastService?.scheduledDate ?? equipmentData.lastService}
            </p>
            <p className="text-xs text-muted-foreground">
              {lastService ? lastService.type : 'Preventive Maintenance'}
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
              {equipmentData.nextService}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <HistoryIcon className="size-4" />
              <span className="text-xs">Total Records</span>
            </div>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{orders.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Open service orders list */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Service Orders</CardTitle>
            <CardDescription>
              All service records for {equipmentData.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedByDate.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No service orders yet. Use a Service Action above to create one.
              </p>
            )}
            {sortedByDate.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => openDetail(order)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent/50"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">{order.id}</span>
                    <TypeBadge type={order.type} />
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {order.scope.objectives || order.type}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {order.scheduledDate} ·{' '}
                    {order.assignedEngineer ?? 'Unassigned'}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <StatusBadge status={order.status} />
                  <PriorityBadge priority={order.priority} />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Service Summary by type */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Service Summary</CardTitle>
            <CardDescription>Records by service type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.keys(serviceTypeConfig) as ServiceType[]).map((type) => {
              const meta = typeTimelineMeta(type)
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <span className={cn('rounded-md p-1.5', meta.className)}>
                      <meta.Icon className="size-3.5" />
                    </span>
                    {type}
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

      {/* Service Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Service Timeline</CardTitle>
          <CardDescription>
            Preventive, corrective, calibration, inspection and installation history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-4 pl-2">
            <div
              className="absolute bottom-4 left-[1.4rem] top-4 w-px bg-border"
              aria-hidden="true"
            />
            {sortedByDate.map((order) => {
              const meta = typeTimelineMeta(order.type)
              return (
                <div key={order.id} className="relative flex gap-4">
                  <div
                    className={cn(
                      'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ring-4 ring-background',
                      meta.className,
                    )}
                  >
                    <meta.Icon className="size-4" />
                  </div>
                  <button
                    type="button"
                    onClick={() => openDetail(order)}
                    className="flex-1 rounded-lg border p-3 text-left transition-colors hover:bg-accent/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{order.type}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {order.id}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.scope.objectives || 'Scheduled service'}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.scheduledDate} · {order.assignedEngineer ?? 'Unassigned'}
                    </p>
                  </button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <CreateServiceOrderWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        presetEquipment={equipmentSnapshot}
        presetType={presetType}
      />
      <ServiceOrderDetailSheet
        order={activeOrder}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
