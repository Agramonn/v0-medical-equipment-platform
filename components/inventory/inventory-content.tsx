'use client'

import { EquipmentWithOrganization } from '@/lib/types'
import * as React from 'react'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Grid3X3,
  LayoutList,
  MoreHorizontal,
  Package,
  Plus,
  QrCode,
  Search,
  Settings2,
  SlidersHorizontal,
  Trash2,
  Upload,
  Wrench,
  XCircle,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { AddEquipmentDialog } from './add-equipment-dialog'
import { DeleteEquipmentButton } from './delete-equipment-button'
import { EditEquipmentDialog } from './edit-equipment-dialog'
import { QrCodeDialog } from './qr-code-dialog'


function getStatusBadge(status: string) {
  switch (status) {
    case 'OPERATIONAL':
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/20">
          <CheckCircle2 className="mr-1 size-3" />
          Operational
        </Badge>
      )
    case 'MAINTENANCE':
      return (
        <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
          <Wrench className="mr-1 size-3" />
          Maintenance
        </Badge>
      )
    case 'NEEDS_ATTENTION':
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
          <AlertTriangle className="mr-1 size-3" />
          Needs Attention
        </Badge>
      )
    case 'OUT_OF_SERVICE':
      return (
        <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
          <XCircle className="mr-1 size-3" />
          Out of Service
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getContractBadge(type: string) {
  switch (type) {
    case 'Full Service':
      return <Badge variant="default">{type}</Badge>
    case 'Preventive Only':
      return <Badge variant="secondary">{type}</Badge>
    case 'Parts Only':
      return <Badge variant="outline">{type}</Badge>
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}

function EquipmentDetailDialog({ equipment }: { equipment: EquipmentWithOrganization }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="size-4" />
          <span className="sr-only">View details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="size-5" />
            {equipment.name}
          </DialogTitle>
          <DialogDescription>
            {equipment.manufacturer} {equipment.model} • {equipment.serialNumber}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Equipment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0">
                    <dl className="divide-y divide-border">
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2.5">
                        <dt className="text-sm text-muted-foreground">Asset No.</dt>
                        <dd className="text-sm font-mono font-medium text-right">{equipment.assetNumber}</dd>
                      </div>
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2.5">
                        <dt className="text-sm text-muted-foreground">Manufacturer</dt>
                        <dd className="text-sm font-medium text-right">{equipment.manufacturer}</dd>
                      </div>
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2.5">
                        <dt className="text-sm text-muted-foreground">Model</dt>
                        <dd className="text-sm font-medium text-right">{equipment.model}</dd>
                      </div>
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2.5">
                        <dt className="text-sm text-muted-foreground">Serial No.</dt>
                        <dd className="text-sm font-mono font-medium text-right">{equipment.serialNumber}</dd>
                      </div>
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2.5">
                        <dt className="text-sm text-muted-foreground">Category</dt>
                        <dd className="text-sm font-medium text-right">{equipment.category}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Location & Contract
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0">
                    <dl className="divide-y divide-border">
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2.5">
                        <dt className="text-sm text-muted-foreground">Hospital</dt>
                        <dd className="text-sm font-medium text-right">{equipment.organization.name}</dd>
                      </div>
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2.5">
                        <dt className="text-sm text-muted-foreground">City</dt>
                        <dd className="text-sm font-medium text-right">
                          {equipment.organization.city}, {equipment.organization.state}
                        </dd>
                      </div>
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2.5">
                        <dt className="text-sm text-muted-foreground">Department</dt>
                        <dd className="text-sm font-medium text-right">{equipment.department}</dd>
                      </div>
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2.5">
                        <dt className="text-sm text-muted-foreground">Contract</dt>
                        <dd className="text-right">{getContractBadge(equipment.contractType ?? 'No Contract')}</dd>
                      </div>
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline py-2.5">
                        <dt className="text-sm text-muted-foreground">Status</dt>
                        <dd className="text-right">{getStatusBadge(equipment.status)}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Usage & Maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Hours Used
                      </p>
                      <p className="text-2xl font-semibold">{equipment.hoursUsed.toLocaleString()}</p>
                      <Progress value={(equipment.hoursUsed / equipment.maxHours) * 100} className="h-1.5" />
                      <p className="text-xs text-muted-foreground">
                        of {equipment.maxHours.toLocaleString()} hours
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Last Service
                      </p>
                      <p className="text-2xl font-semibold">
                        {equipment.lastServiceDate
                          ? equipment.lastServiceDate.toLocaleDateString('en-US')
                          : '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">Maintenance completed</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Next Service
                      </p>
                      <p className="text-2xl font-semibold text-primary">
                        {equipment.nextServiceDate
                          ? equipment.nextServiceDate.toLocaleDateString('en-US')
                          : '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">Scheduled</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">Need more details?</p>
                    <p className="text-xs text-muted-foreground">
                      History, manuals, checklist and AI chat in the full workspace
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`/equipment/${equipment.id}`}>
                      <Eye className="mr-2 size-4" />
                      Open Workspace
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export function InventoryContent({
  equipment,
  organizations,
}: {
  equipment: EquipmentWithOrganization[]
  organizations: { id: string; name: string }[]
}) {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])
  const [viewMode, setViewMode] = React.useState<'table' | 'cards'>('table')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [hospitalFilter, setHospitalFilter] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [editingEquipment, setEditingEquipment] = React.useState<EquipmentWithOrganization | null>(null)
  const [qrEquipment, setQrEquipment] = React.useState<EquipmentWithOrganization | null>(null)

  const hospitals = React.useMemo(() => {
    const unique = new Map<string, string>()
    equipment.forEach((eq) => unique.set(eq.organization.id, eq.organization.name))
    return Array.from(unique.entries())
  }, [equipment])

  const filteredData = equipment.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    if (hospitalFilter !== 'all' && item.organization.id !== hospitalFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        item.name.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.serialNumber.toLowerCase().includes(q) ||
        item.organization.name.toLowerCase().includes(q)
      )
    }
    return true
  })

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredData.map((item) => item.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const stats = {
    total: equipment.length,
    operational: equipment.filter((e) => e.status === 'OPERATIONAL').length,
    maintenance: equipment.filter((e) => e.status === 'MAINTENANCE').length,
    critical: equipment.filter((e) => e.status === 'NEEDS_ATTENTION').length,
    outOfService: equipment.filter((e) => e.status === 'OUT_OF_SERVICE').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Equipment Inventory</h1>
          <p className="text-muted-foreground">
            Manage and monitor all biomedical equipment across facilities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 size-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <AddEquipmentDialog organizations={organizations} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('all')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Package className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Equipment</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('OPERATIONAL')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <CheckCircle2 className="size-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.operational}</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('MAINTENANCE')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Wrench className="size-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.maintenance}</p>
                <p className="text-xs text-muted-foreground">In Maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('NEEDS_ATTENTION')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2">
                <AlertTriangle className="size-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.critical}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('OUT_OF_SERVICE')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <XCircle className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.outOfService}</p>
                <p className="text-xs text-muted-foreground">Out of Service</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search equipment..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="OPERATIONAL">Operational</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="NEEDS_ATTENTION">Critical</SelectItem>
                  <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                </SelectContent>
              </Select>
              <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hospitals</SelectItem>
                  {hospitals.map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('table')}
              >
                <LayoutList className="size-4" />
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('cards')}
              >
                <Grid3X3 className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Table/Cards */}
      {viewMode === 'table' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Last Service</TableHead>
                  <TableHead>Next Service</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((equipment) => (
                  <TableRow key={equipment.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(equipment.id)}
                        onCheckedChange={() => toggleSelect(equipment.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                          <Package className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                          <Link href={`/equipment/${equipment.id}`} className="font-medium hover:text-primary hover:underline">
                            {equipment.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {equipment.manufacturer} {equipment.model}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{equipment.organization.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {equipment.organization.city}, {equipment.organization.state}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(equipment.status)}</TableCell>
                    <TableCell>{getContractBadge(equipment.contractType ?? 'No Contract')}</TableCell>
                    <TableCell>
                      <p className="text-sm">{equipment.lastServiceDate?.toLocaleDateString('en-US') ?? '—'}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-primary">
                        {equipment.nextServiceDate?.toLocaleDateString('en-US') ?? '—'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <EquipmentDetailDialog equipment={equipment} />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/equipment/${equipment.id}`}>
                                <Eye className="mr-2 size-4" />
                                View Workspace
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 size-4" />
                              Create Service Order
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setQrEquipment(equipment)}>
                              <QrCode className="mr-2 size-4" />
                              Generate QR Code
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingEquipment(equipment)}>
                              <Settings2 className="mr-2 size-4" />
                              Edit Equipment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive p-0"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <DeleteEquipmentButton
                                equipmentId={equipment.id}
                                equipmentName={equipment.name}
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredData.map((equipment) => (
            <Card key={equipment.id} className="hover:bg-accent/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                    <Package className="size-6 text-muted-foreground" />
                  </div>
                  {getStatusBadge(equipment.status)}
                </div>
                <CardTitle className="text-base mt-3">
                  <Link href={`/equipment/${equipment.id}`} className="hover:text-primary hover:underline">
                    {equipment.name}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {equipment.manufacturer} {equipment.model}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hospital</span>
                  <span>{equipment.organization.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Department</span>
                  <span>{equipment.department || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contract</span>
                  {getContractBadge(equipment.contractType ?? 'No Contract')}
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next Service</span>
                  <span className="font-medium text-primary">
                    {equipment.nextServiceDate?.toLocaleDateString('en-US') ?? '—'}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/equipment/${equipment.id}`}>
                      <Eye className="mr-2 size-4" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="mr-2 size-4" />
                    Service Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {equipment.length} equipment
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
      {editingEquipment && (
        <EditEquipmentDialog
          equipment={editingEquipment}
          organizations={organizations}
          open={!!editingEquipment}
          onOpenChange={(open) => {
            if (!open) setEditingEquipment(null)
          }}
        />
      )}
      {qrEquipment && (
        <QrCodeDialog
          equipmentId={qrEquipment.id}
          equipmentName={qrEquipment.name}
          assetNumber={qrEquipment.assetNumber}
          open={!!qrEquipment}
          onOpenChange={(open) => {
            if (!open) setQrEquipment(null)
          }}
        />
      )}
    </div>
  )
}
