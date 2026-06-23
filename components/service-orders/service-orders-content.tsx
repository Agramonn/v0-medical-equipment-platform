'use client'

import * as React from 'react'
import {
  CheckCircle2,
  Download,
  Eye,
  FileSignature,
  FileText,
  MoreHorizontal,
  Package,
  PauseCircle,
  Plus,
  Printer,
  Search,
  Settings2,
  Trash2,
  User,
  UserCog,
  Wrench,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ServiceOrderWithRelations } from '@/lib/types'
import { CreateServiceOrderWizard } from './create-service-order-wizard'
import { PriorityBadge, StatusBadge, TypeBadge } from './service-order-badges'

type EquipmentOption = {
  id: string
  name: string
  manufacturer: string
  model: string
  serialNumber: string
  assetNumber: string
  department: string
  organizationId: string
  organization: { name: string }
}

type EngineerOption = { id: string; name: string }

const statusFilters = [
  { value: 'all', label: 'All Status' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'PENDING_PARTS', label: 'Pending Parts' },
  { value: 'PENDING_CUSTOMER', label: 'Pending Customer' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PENDING_SIGNATURE', label: 'Pending Signature' },
  { value: 'CLOSED', label: 'Closed' },
]

interface StatCard {
  label: string
  count: number
  Icon: typeof FileText
  className: string
  filter: string
}

export function ServiceOrdersContent({
  orders,
  equipmentList,
  engineers,
  currentUserId,
}: {
  orders: ServiceOrderWithRelations[]
  equipmentList: EquipmentOption[]
  engineers: EngineerOption[]
  currentUserId: string
}) {
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  const [query, setQuery] = React.useState('')
  const [wizardOpen, setWizardOpen] = React.useState(false)

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false
    if (typeFilter !== 'all' && order.type !== typeFilter) return false
    if (
      query &&
      !`${order.orderNumber} ${order.equipment.name} ${order.organization.name}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
      return false
    return true
  })

  const stats: StatCard[] = [
    {
      label: 'Total Orders',
      count: orders.length,
      Icon: FileText,
      className: 'bg-primary/10 text-primary',
      filter: 'all',
    },
    {
      label: 'Assigned',
      count: orders.filter((o) => o.status === 'ASSIGNED').length,
      Icon: UserCog,
      className: 'bg-secondary text-secondary-foreground',
      filter: 'ASSIGNED',
    },
    {
      label: 'In Progress',
      count: orders.filter((o) => o.status === 'IN_PROGRESS').length,
      Icon: Wrench,
      className: 'bg-primary/10 text-primary',
      filter: 'IN_PROGRESS',
    },
    {
      label: 'Blocked',
      count: orders.filter(
        (o) => o.status === 'PENDING_PARTS' || o.status === 'PENDING_CUSTOMER'
      ).length,
      Icon: PauseCircle,
      className: 'bg-warning/10 text-warning',
      filter: 'PENDING_PARTS',
    },
    {
      label: 'Awaiting Review',
      count: orders.filter((o) => o.status === 'COMPLETED').length,
      Icon: CheckCircle2,
      className: 'bg-success/10 text-success',
      filter: 'COMPLETED',
    },
    {
      label: 'Pending Signature',
      count: orders.filter((o) => o.status === 'PENDING_SIGNATURE').length,
      Icon: FileSignature,
      className: 'bg-primary/10 text-primary',
      filter: 'PENDING_SIGNATURE',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Service Orders
          </h1>
          <p className="text-muted-foreground">
            Official service records for maintenance, repairs, calibrations and
            inspections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <Button onClick={() => setWizardOpen(true)}>
            <Plus className="mr-2 size-4" />
            Create Service Order
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => setStatusFilter(stat.filter)}
          >
            <CardContent className="p-4">
              <div className={`mb-2 inline-flex rounded-lg p-2 ${stat.className}`}>
                <stat.Icon className="size-5" />
              </div>
              <p className="text-2xl font-semibold">{stat.count}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by order, equipment, hospital..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[170px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PREVENTIVE_MAINTENANCE">Preventive Maintenance</SelectItem>
                <SelectItem value="CORRECTIVE_MAINTENANCE">Corrective Maintenance</SelectItem>
                <SelectItem value="CALIBRATION">Calibration</SelectItem>
                <SelectItem value="INSPECTION">Inspection</SelectItem>
                <SelectItem value="INSTALLATION">Installation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead className="hidden md:table-cell">Hospital</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden lg:table-cell">Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Engineer</TableHead>
                <TableHead className="hidden sm:table-cell">Scheduled</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <span className="font-mono text-xs font-medium">
                      {order.orderNumber.slice(0, 8)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        <Package className="size-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{order.equipment.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <p className="text-sm">{order.organization.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.equipment.department}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TypeBadge type={order.type} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <PriorityBadge priority={order.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {order.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                          <User className="size-3 text-primary" />
                        </div>
                        <span className="text-sm">{order.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm font-medium text-primary">
                      {order.scheduledAt?.toLocaleDateString('en-US') ?? '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="size-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Supervisor Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 size-4" />
                            View Record
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCog className="mr-2 size-4" />
                            {order.assignedTo ? 'Reassign' : 'Assign'} Engineer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings2 className="mr-2 size-4" />
                            Edit Order
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 size-4" />
                            Generate PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 size-4" />
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                    No service orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      <CreateServiceOrderWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        equipmentList={equipmentList}
        engineers={engineers}
        currentUserId={currentUserId}
      />
    </div>
  )
}
