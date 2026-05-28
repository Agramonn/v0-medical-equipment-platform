'use client'

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

// Mock equipment data
const equipmentData = [
  {
    id: 'EQ-001',
    name: 'Ventilator V-2847',
    brand: 'Philips',
    model: 'Trilogy Evo',
    serialNumber: 'SN-2847-PHL-001',
    hospital: 'Central Hospital',
    area: 'ICU',
    contractType: 'Full Service',
    status: 'operational',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    hoursUsed: 8432,
    installDate: '2022-03-10',
  },
  {
    id: 'EQ-002',
    name: 'MRI Scanner M-1204',
    brand: 'Siemens',
    model: 'MAGNETOM Vida',
    serialNumber: 'SN-1204-SIE-002',
    hospital: 'Regional Medical Center',
    area: 'Radiology',
    contractType: 'Preventive Only',
    status: 'maintenance',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-05-01',
    hoursUsed: 12567,
    installDate: '2021-06-22',
  },
  {
    id: 'EQ-003',
    name: 'Ultrasound U-3421',
    brand: 'GE Healthcare',
    model: 'LOGIQ E10',
    serialNumber: 'SN-3421-GEH-003',
    hospital: 'City Clinic',
    area: 'Cardiology',
    contractType: 'Full Service',
    status: 'operational',
    lastMaintenance: '2024-01-28',
    nextMaintenance: '2024-04-28',
    hoursUsed: 5621,
    installDate: '2023-01-15',
  },
  {
    id: 'EQ-004',
    name: 'Defibrillator D-0892',
    brand: 'Zoll',
    model: 'R Series',
    serialNumber: 'SN-0892-ZOL-004',
    hospital: 'Emergency Center',
    area: 'Emergency',
    contractType: 'Parts Only',
    status: 'critical',
    lastMaintenance: '2023-12-10',
    nextMaintenance: '2024-03-10',
    hoursUsed: 3245,
    installDate: '2022-08-05',
  },
  {
    id: 'EQ-005',
    name: 'CT Scanner CT-4521',
    brand: 'Canon Medical',
    model: 'Aquilion ONE',
    serialNumber: 'SN-4521-CAN-005',
    hospital: 'Central Hospital',
    area: 'Radiology',
    contractType: 'Full Service',
    status: 'operational',
    lastMaintenance: '2024-02-10',
    nextMaintenance: '2024-05-10',
    hoursUsed: 9876,
    installDate: '2020-11-30',
  },
  {
    id: 'EQ-006',
    name: 'Anesthesia Machine A-2134',
    brand: 'Dräger',
    model: 'Perseus A500',
    serialNumber: 'SN-2134-DRA-006',
    hospital: 'Regional Medical Center',
    area: 'Surgery',
    contractType: 'Full Service',
    status: 'operational',
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-04-20',
    hoursUsed: 7234,
    installDate: '2021-09-18',
  },
  {
    id: 'EQ-007',
    name: 'Patient Monitor PM-8976',
    brand: 'Mindray',
    model: 'BeneVision N22',
    serialNumber: 'SN-8976-MIN-007',
    hospital: 'City Clinic',
    area: 'ICU',
    contractType: 'Preventive Only',
    status: 'out-of-service',
    lastMaintenance: '2023-11-25',
    nextMaintenance: '2024-02-25',
    hoursUsed: 4521,
    installDate: '2022-05-12',
  },
  {
    id: 'EQ-008',
    name: 'Infusion Pump IP-3421',
    brand: 'B. Braun',
    model: 'Infusomat Space',
    serialNumber: 'SN-3421-BBR-008',
    hospital: 'Emergency Center',
    area: 'Emergency',
    contractType: 'Parts Only',
    status: 'operational',
    lastMaintenance: '2024-02-05',
    nextMaintenance: '2024-05-05',
    hoursUsed: 2134,
    installDate: '2023-04-22',
  },
  {
    id: 'EQ-009',
    name: 'X-Ray Machine X-1567',
    brand: 'Fujifilm',
    model: 'FDR D-EVO II',
    serialNumber: 'SN-1567-FUJ-009',
    hospital: 'Central Hospital',
    area: 'Radiology',
    contractType: 'Full Service',
    status: 'maintenance',
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-04-05',
    hoursUsed: 6789,
    installDate: '2021-02-28',
  },
  {
    id: 'EQ-010',
    name: 'ECG Machine ECG-5632',
    brand: 'Nihon Kohden',
    model: 'ECG-2550',
    serialNumber: 'SN-5632-NIK-010',
    hospital: 'Regional Medical Center',
    area: 'Cardiology',
    contractType: 'Preventive Only',
    status: 'operational',
    lastMaintenance: '2024-02-12',
    nextMaintenance: '2024-05-12',
    hoursUsed: 3456,
    installDate: '2022-10-08',
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'operational':
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/20">
          <CheckCircle2 className="mr-1 size-3" />
          Operational
        </Badge>
      )
    case 'maintenance':
      return (
        <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
          <Wrench className="mr-1 size-3" />
          Maintenance
        </Badge>
      )
    case 'critical':
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
          <AlertTriangle className="mr-1 size-3" />
          Critical
        </Badge>
      )
    case 'out-of-service':
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

function EquipmentDetailDialog({ equipment }: { equipment: typeof equipmentData[0] }) {
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
            {equipment.brand} {equipment.model} • {equipment.serialNumber}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="manuals">Manuals</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="parts">Parts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6 pt-4">
              <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Equipment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Equipment ID</span>
                      <span className="text-sm font-medium">{equipment.id}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Brand</span>
                      <span className="text-sm font-medium">{equipment.brand}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Model</span>
                      <span className="text-sm font-medium">{equipment.model}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Serial Number</span>
                      <span className="text-sm font-mono">{equipment.serialNumber}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Installation Date</span>
                      <span className="text-sm font-medium">{equipment.installDate}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Location & Contract</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Hospital</span>
                      <span className="text-sm font-medium">{equipment.hospital}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Area</span>
                      <span className="text-sm font-medium">{equipment.area}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Contract Type</span>
                      {getContractBadge(equipment.contractType)}
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      {getStatusBadge(equipment.status)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Usage & Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Hours Used</p>
                      <p className="text-2xl font-semibold">{equipment.hoursUsed.toLocaleString()}</p>
                      <Progress value={(equipment.hoursUsed / 15000) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">of 15,000 hours service interval</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Last Maintenance</p>
                      <p className="text-2xl font-semibold">{equipment.lastMaintenance}</p>
                      <p className="text-xs text-muted-foreground">Preventive service completed</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Next Maintenance</p>
                      <p className="text-2xl font-semibold text-primary">{equipment.nextMaintenance}</p>
                      <p className="text-xs text-muted-foreground">Scheduled preventive</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Service History</CardTitle>
                  <CardDescription>Complete maintenance and repair timeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { date: '2024-02-10', type: 'Preventive', desc: 'Quarterly maintenance completed', engineer: 'John Doe' },
                      { date: '2024-01-05', type: 'Corrective', desc: 'Sensor calibration issue resolved', engineer: 'Jane Smith' },
                      { date: '2023-11-15', type: 'Preventive', desc: 'Annual inspection completed', engineer: 'Mike Johnson' },
                      { date: '2023-09-22', type: 'Corrective', desc: 'Power supply replacement', engineer: 'John Doe' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                          <Wrench className="size-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{item.type} Service</p>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                          <p className="text-xs text-muted-foreground">By {item.engineer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manuals" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Technical Documentation</CardTitle>
                  <CardDescription>Manuals, guides, and reference materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'User Manual', size: '12.4 MB', type: 'PDF' },
                      { name: 'Service Manual', size: '28.7 MB', type: 'PDF' },
                      { name: 'Calibration Guide', size: '4.2 MB', type: 'PDF' },
                      { name: 'Parts Catalog', size: '8.9 MB', type: 'PDF' },
                      { name: 'Quick Reference Card', size: '1.1 MB', type: 'PDF' },
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                            <FileText className="size-5 text-destructive" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="troubleshooting" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Common Issues & Solutions</CardTitle>
                  <CardDescription>Troubleshooting guides for known problems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { code: 'E-101', issue: 'Sensor calibration error', solution: 'Run automatic calibration sequence' },
                      { code: 'E-205', issue: 'Power fluctuation detected', solution: 'Check power supply connections' },
                      { code: 'E-312', issue: 'Communication timeout', solution: 'Restart network interface module' },
                      { code: 'W-089', issue: 'Battery low warning', solution: 'Replace backup battery within 30 days' },
                    ].map((item, index) => (
                      <div key={index} className="rounded-lg border p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">{item.code}</Badge>
                          <span className="text-sm font-medium">{item.issue}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Solution:</strong> {item.solution}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Maintenance Schedule</CardTitle>
                  <CardDescription>Preventive maintenance tasks and intervals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { task: 'Visual inspection', interval: 'Daily', lastDone: 'Today', nextDue: 'Tomorrow' },
                      { task: 'Functional test', interval: 'Weekly', lastDone: '3 days ago', nextDue: 'In 4 days' },
                      { task: 'Calibration check', interval: 'Monthly', lastDone: '2 weeks ago', nextDue: 'In 2 weeks' },
                      { task: 'Full preventive service', interval: 'Quarterly', lastDone: '6 weeks ago', nextDue: 'In 6 weeks' },
                      { task: 'Annual certification', interval: 'Yearly', lastDone: '8 months ago', nextDue: 'In 4 months' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">{item.task}</p>
                          <p className="text-xs text-muted-foreground">Every {item.interval.toLowerCase()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Last: {item.lastDone}</p>
                          <p className="text-sm font-medium text-primary">Next: {item.nextDue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parts" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Spare Parts & Accessories</CardTitle>
                  <CardDescription>Compatible parts and stock availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Oxygen Sensor', partNo: 'PHI-OS-2847', stock: 5, status: 'In Stock' },
                      { name: 'Power Supply Unit', partNo: 'PHI-PSU-100', stock: 2, status: 'Low Stock' },
                      { name: 'Display Module', partNo: 'PHI-DM-500', stock: 0, status: 'Out of Stock' },
                      { name: 'Filter Assembly', partNo: 'PHI-FA-300', stock: 12, status: 'In Stock' },
                      { name: 'Battery Pack', partNo: 'PHI-BP-200', stock: 3, status: 'In Stock' },
                    ].map((part, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="text-sm font-medium">{part.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{part.partNo}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={part.stock === 0 ? 'destructive' : part.stock < 3 ? 'secondary' : 'outline'}
                          >
                            {part.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{part.stock} units</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export function InventoryContent() {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])
  const [viewMode, setViewMode] = React.useState<'table' | 'cards'>('table')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [hospitalFilter, setHospitalFilter] = React.useState<string>('all')

  const filteredData = equipmentData.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    if (hospitalFilter !== 'all' && item.hospital !== hospitalFilter) return false
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
    total: equipmentData.length,
    operational: equipmentData.filter((e) => e.status === 'operational').length,
    maintenance: equipmentData.filter((e) => e.status === 'maintenance').length,
    critical: equipmentData.filter((e) => e.status === 'critical').length,
    outOfService: equipmentData.filter((e) => e.status === 'out-of-service').length,
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
          <Button size="sm">
            <Plus className="mr-2 size-4" />
            Add Equipment
          </Button>
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
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('operational')}>
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
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('maintenance')}>
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
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('critical')}>
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
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('out-of-service')}>
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
                <Input placeholder="Search equipment..." className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="out-of-service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
              <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hospitals</SelectItem>
                  <SelectItem value="Central Hospital">Central Hospital</SelectItem>
                  <SelectItem value="Regional Medical Center">Regional Medical Center</SelectItem>
                  <SelectItem value="City Clinic">City Clinic</SelectItem>
                  <SelectItem value="Emergency Center">Emergency Center</SelectItem>
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
                          <p className="font-medium">{equipment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {equipment.brand} {equipment.model}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{equipment.hospital}</p>
                        <p className="text-xs text-muted-foreground">{equipment.area}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(equipment.status)}</TableCell>
                    <TableCell>{getContractBadge(equipment.contractType)}</TableCell>
                    <TableCell>
                      <p className="text-sm">{equipment.lastMaintenance}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-primary">{equipment.nextMaintenance}</p>
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 size-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 size-4" />
                              Create Service Order
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <QrCode className="mr-2 size-4" />
                              Generate QR Code
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings2 className="mr-2 size-4" />
                              Edit Equipment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 size-4" />
                              Delete
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
                <CardTitle className="text-base mt-3">{equipment.name}</CardTitle>
                <CardDescription>
                  {equipment.brand} {equipment.model}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span>{equipment.hospital}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Area</span>
                  <span>{equipment.area}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contract</span>
                  {getContractBadge(equipment.contractType)}
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next Service</span>
                  <span className="font-medium text-primary">{equipment.nextMaintenance}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <EquipmentDetailDialog equipment={equipment} />
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
          Showing {filteredData.length} of {equipmentData.length} equipment
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
    </div>
  )
}
