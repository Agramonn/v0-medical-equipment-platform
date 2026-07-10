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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { ServiceOrderWithRelations, EquipmentOption, ChecklistTemplate } from '@/lib/types'
import { CreateServiceOrderWizard } from './create-service-order-wizard'
import { PriorityBadge, StatusBadge, TypeBadge } from './service-order-badges'
import { ServiceOrderDetailSheet } from './service-order-detail-sheet'
import { assignOrderToEngineer, cancelServiceOrder } from '@/lib/actions/service-orders'


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

const ITEMS_PER_PAGE = 10

export function ServiceOrdersContent({
  orders,
  equipmentList,
  engineers,
  currentUserId,
  allTemplates,
}: {
  orders: ServiceOrderWithRelations[]
  equipmentList: EquipmentOption[]
  engineers: EngineerOption[]
  currentUserId: string
  allTemplates: ChecklistTemplate[]
}) {
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  const [query, setQuery] = React.useState('')
  const [wizardOpen, setWizardOpen] = React.useState(false)
  const [activeOrder, setActiveOrder] = React.useState<ServiceOrderWithRelations | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false)
  const [selectedOrderForAssign, setSelectedOrderForAssign] = React.useState<ServiceOrderWithRelations | null>(null)
  const [selectedEngineer, setSelectedEngineer] = React.useState<string>('')
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  const [orderToCancel, setOrderToCancel] = React.useState<ServiceOrderWithRelations | null>(null)
  const [isCancelling, setIsCancelling] = React.useState(false)
  const [templates, setTemplates] = React.useState<ChecklistTemplate[]>(
    allTemplates ?? []
  )

  // Al abrir el detail sheet, encuentra el template del modelo del equipo de esa orden:
  function getTemplateForOrder(order: ServiceOrderWithRelations): ChecklistTemplate | null {
    return (
      templates.find(
        (t) =>
          t.serviceType === order.type &&
          // Match by equipmentModelId — necesitas aggregarlo en la query
          true
      ) ?? null
    )
  }

  function openDetail(order: ServiceOrderWithRelations) {
    setActiveOrder(order)
    setDetailOpen(true)
  }

  function openAssignDialog(order: ServiceOrderWithRelations) {
    setSelectedOrderForAssign(order)
    setSelectedEngineer(order.assignedTo?.id ?? '')
    setAssignDialogOpen(true)
  }

  async function handleAssignEngineer() {
    if (!selectedOrderForAssign || !selectedEngineer) return
    try {
      await assignOrderToEngineer(selectedOrderForAssign.id, selectedEngineer)
      setAssignDialogOpen(false)
      setSelectedOrderForAssign(null)
    } catch (e) {
      console.error('Failed to assign engineer:', e)
    }
  }

  function openCancelDialog(order: ServiceOrderWithRelations) {
    setOrderToCancel(order)
    setCancelDialogOpen(true)
  }

  async function handleConfirmCancel() {
    if (!orderToCancel) return
    setIsCancelling(true)
    try {
      await cancelServiceOrder(orderToCancel.id)
      setCancelDialogOpen(false)
      setOrderToCancel(null)
    } catch (e) {
      console.error('Failed to cancel order:', e)
    } finally {
      setIsCancelling(false)
    }
  }

  async function handleGeneratePDF(order: ServiceOrderWithRelations) {
    try {
      const response = await fetch(`/api/service-orders/${order.id}/pdf`, {
        method: 'GET',
      })
      if (!response.ok) throw new Error('Failed to generate PDF')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${order.orderNumber}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Failed to generate PDF:', e)
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false
    if (typeFilter !== 'all' && order.type !== typeFilter) return false
    if (
      query &&
      !`${order.orderNumber} ${order.equipment.equipmentModel.name} ${order.organization.name}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
      return false
    return true
  })

  React.useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, typeFilter, query])

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
              {paginatedOrders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer" onClick={() => openDetail(order)}>
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
                      <span className="font-medium">{order.equipment.equipmentModel.name}</span>
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
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openDetail(order)}>
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
                          <DropdownMenuItem onClick={() => openDetail(order)}>
                            <Eye className="mr-2 size-4" />
                            View Record
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAssignDialog(order)}>
                            <UserCog className="mr-2 size-4" />
                            {order.assignedTo ? 'Reassign' : 'Assign'} Engineer
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <Settings2 className="mr-2 size-4" />
                            Edit Order
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <Printer className="mr-2 size-4" />
                            Generate PDF (coming soon)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openCancelDialog(order)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedOrders.length === 0 && (
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
          Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
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
      <ServiceOrderDetailSheet
        order={activeOrder}
        template={activeOrder ? getTemplateForOrder(activeOrder) : null}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        currentUserId={currentUserId}
        engineers={engineers}
      />

      {/* Assign Engineer Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedOrderForAssign?.assignedTo ? 'Reassign' : 'Assign'} Engineer
            </DialogTitle>
            <DialogDescription>
              Select an engineer for order {selectedOrderForAssign?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="engineer-select">Engineer</Label>
              <Select value={selectedEngineer} onValueChange={setSelectedEngineer}>
                <SelectTrigger id="engineer-select">
                  <SelectValue placeholder="Select engineer..." />
                </SelectTrigger>
                <SelectContent>
                  {engineers.map((eng) => (
                    <SelectItem key={eng.id} value={eng.id}>
                      {eng.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignEngineer} disabled={!selectedEngineer}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this service order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will close order {orderToCancel?.orderNumber.slice(0, 8)} for{' '}
              {orderToCancel?.equipment.equipmentModel.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
