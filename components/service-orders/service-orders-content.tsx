'use client'

import * as React from 'react'
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileSignature,
  FileText,
  Filter,
  ImagePlus,
  MoreHorizontal,
  Package,
  Plus,
  Printer,
  Search,
  Settings2,
  SlidersHorizontal,
  Trash2,
  User,
  Wrench,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'

// Mock service order data
const serviceOrders = [
  {
    id: 'OS-2024-001',
    equipment: 'Ventilator V-2847',
    equipmentId: 'EQ-001',
    hospital: 'Central Hospital',
    area: 'ICU',
    type: 'Corrective',
    priority: 'high',
    status: 'in-progress',
    assignee: 'John Doe',
    createdAt: '2024-02-15',
    scheduledDate: '2024-02-16',
    description: 'Oxygen sensor calibration error E-101',
  },
  {
    id: 'OS-2024-002',
    equipment: 'MRI Scanner M-1204',
    equipmentId: 'EQ-002',
    hospital: 'Regional Medical Center',
    area: 'Radiology',
    type: 'Preventive',
    priority: 'medium',
    status: 'pending',
    assignee: 'Jane Smith',
    createdAt: '2024-02-14',
    scheduledDate: '2024-02-18',
    description: 'Quarterly preventive maintenance',
  },
  {
    id: 'OS-2024-003',
    equipment: 'Defibrillator D-0892',
    equipmentId: 'EQ-004',
    hospital: 'Emergency Center',
    area: 'Emergency',
    type: 'Corrective',
    priority: 'critical',
    status: 'pending',
    assignee: 'Mike Johnson',
    createdAt: '2024-02-15',
    scheduledDate: '2024-02-15',
    description: 'Battery not charging - urgent repair needed',
  },
  {
    id: 'OS-2024-004',
    equipment: 'CT Scanner CT-4521',
    equipmentId: 'EQ-005',
    hospital: 'Central Hospital',
    area: 'Radiology',
    type: 'Preventive',
    priority: 'low',
    status: 'completed',
    assignee: 'John Doe',
    createdAt: '2024-02-10',
    scheduledDate: '2024-02-12',
    description: 'Annual calibration and certification',
  },
  {
    id: 'OS-2024-005',
    equipment: 'Anesthesia Machine A-2134',
    equipmentId: 'EQ-006',
    hospital: 'Regional Medical Center',
    area: 'Surgery',
    type: 'Corrective',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Jane Smith',
    createdAt: '2024-02-13',
    scheduledDate: '2024-02-14',
    description: 'Flow sensor replacement',
  },
  {
    id: 'OS-2024-006',
    equipment: 'Patient Monitor PM-8976',
    equipmentId: 'EQ-007',
    hospital: 'City Clinic',
    area: 'ICU',
    type: 'Corrective',
    priority: 'medium',
    status: 'closed',
    assignee: 'Mike Johnson',
    createdAt: '2024-02-08',
    scheduledDate: '2024-02-09',
    description: 'Display malfunction - LCD replacement',
  },
  {
    id: 'OS-2024-007',
    equipment: 'Infusion Pump IP-3421',
    equipmentId: 'EQ-008',
    hospital: 'Emergency Center',
    area: 'Emergency',
    type: 'Preventive',
    priority: 'low',
    status: 'completed',
    assignee: 'John Doe',
    createdAt: '2024-02-11',
    scheduledDate: '2024-02-13',
    description: 'Safety check and calibration',
  },
  {
    id: 'OS-2024-008',
    equipment: 'X-Ray Machine X-1567',
    equipmentId: 'EQ-009',
    hospital: 'Central Hospital',
    area: 'Radiology',
    type: 'Preventive',
    priority: 'medium',
    status: 'billed',
    assignee: 'Jane Smith',
    createdAt: '2024-02-05',
    scheduledDate: '2024-02-07',
    description: 'Tube alignment and quality assurance',
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return (
        <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
          <Clock className="mr-1 size-3" />
          Pending
        </Badge>
      )
    case 'in-progress':
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          <Wrench className="mr-1 size-3" />
          In Progress
        </Badge>
      )
    case 'completed':
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/20">
          <CheckCircle2 className="mr-1 size-3" />
          Completed
        </Badge>
      )
    case 'closed':
      return (
        <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
          <CheckCircle2 className="mr-1 size-3" />
          Closed
        </Badge>
      )
    case 'billed':
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/20">
          <FileText className="mr-1 size-3" />
          Billed
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>
    case 'high':
      return <Badge className="bg-warning text-warning-foreground">High</Badge>
    case 'medium':
      return <Badge variant="secondary">Medium</Badge>
    case 'low':
      return <Badge variant="outline">Low</Badge>
    default:
      return <Badge variant="outline">{priority}</Badge>
  }
}

function getTypeBadge(type: string) {
  switch (type) {
    case 'Corrective':
      return (
        <Badge variant="outline" className="border-destructive/50 text-destructive">
          Corrective
        </Badge>
      )
    case 'Preventive':
      return (
        <Badge variant="outline" className="border-primary/50 text-primary">
          Preventive
        </Badge>
      )
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}

function CreateServiceOrderDialog() {
  const [step, setStep] = React.useState(1)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" />
          Create Service Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Service Order</DialogTitle>
          <DialogDescription>
            Generate a new service order for equipment maintenance or repair
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between px-4 py-2">
          {['Equipment', 'Details', 'Activities', 'Review'].map((label, index) => (
            <div key={label} className="flex items-center">
              <div className={cn(
                'flex size-8 items-center justify-center rounded-full text-sm font-medium',
                step > index + 1 ? 'bg-primary text-primary-foreground' :
                step === index + 1 ? 'bg-primary text-primary-foreground' :
                'bg-muted text-muted-foreground'
              )}>
                {step > index + 1 ? <CheckCircle2 className="size-4" /> : index + 1}
              </div>
              <span className={cn(
                'ml-2 text-sm',
                step === index + 1 ? 'font-medium' : 'text-muted-foreground'
              )}>
                {label}
              </span>
              {index < 3 && (
                <ChevronRight className="mx-4 size-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
        
        <ScrollArea className="max-h-[50vh] pr-4">
          {step === 1 && (
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <Label>Select Equipment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eq-001">Ventilator V-2847 - Central Hospital</SelectItem>
                    <SelectItem value="eq-002">MRI Scanner M-1204 - Regional Medical Center</SelectItem>
                    <SelectItem value="eq-003">Ultrasound U-3421 - City Clinic</SelectItem>
                    <SelectItem value="eq-004">Defibrillator D-0892 - Emergency Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Equipment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brand/Model</span>
                    <span>Philips Trilogy Evo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Serial Number</span>
                    <span className="font-mono">SN-2847-PHL-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span>Central Hospital - ICU</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract</span>
                    <Badge variant="default">Full Service</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corrective">Corrective</SelectItem>
                      <SelectItem value="preventive">Preventive</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="calibration">Calibration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Assigned Engineer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Scheduled Date</Label>
                  <Input type="date" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Issue Description</Label>
                <Textarea 
                  placeholder="Describe the issue or service required..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <Label>Activities Performed</Label>
                <Textarea 
                  placeholder="Describe the activities performed during service..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Diagnosis</Label>
                <Textarea 
                  placeholder="Enter technical diagnosis..."
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Technical Verdict</Label>
                <Textarea 
                  placeholder="Enter technical verdict and recommendations..."
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Parts Used</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Part number" className="flex-1" />
                    <Input placeholder="Quantity" className="w-24" type="number" />
                    <Button variant="outline" size="icon">
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Photo Evidence</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <ImagePlus className="mx-auto size-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop images or click to upload
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Browse Files
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 p-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Service Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Number</span>
                      <span className="font-mono font-medium">OS-2024-009</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Equipment</span>
                      <span>Ventilator V-2847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hospital</span>
                      <span>Central Hospital</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Type</span>
                      <span>Corrective</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority</span>
                      <Badge className="bg-warning text-warning-foreground">High</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assigned To</span>
                      <span>John Doe</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <Label>Digital Signature</Label>
                <div className="border rounded-lg p-8 text-center bg-muted/30">
                  <FileSignature className="mx-auto size-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to sign digitally
                  </p>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {step < 4 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Continue
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              ) : (
                <>
                  <Button variant="outline">
                    <Printer className="mr-2 size-4" />
                    Preview PDF
                  </Button>
                  <Button>
                    <CheckCircle2 className="mr-2 size-4" />
                    Create Order
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ServiceOrderDetail({ order }: { order: typeof serviceOrders[0] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            {order.id}
          </SheetTitle>
          <SheetDescription>
            Service order details and timeline
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-6 py-4">
            {/* Status & Priority */}
            <div className="flex items-center gap-2">
              {getStatusBadge(order.status)}
              {getPriorityBadge(order.priority)}
              {getTypeBadge(order.type)}
            </div>

            {/* Equipment Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Equipment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{order.equipment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hospital</span>
                  <span>{order.hospital}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Area</span>
                  <span>{order.area}</span>
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned To</span>
                  <span className="font-medium">{order.assignee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{order.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="font-medium text-primary">{order.scheduledDate}</span>
                </div>
                <Separator />
                <div>
                  <span className="text-muted-foreground">Description</span>
                  <p className="mt-1">{order.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Order created', by: 'System', time: '10:00 AM', date: order.createdAt },
                    { action: 'Assigned to engineer', by: order.assignee, time: '10:05 AM', date: order.createdAt },
                    { action: 'Service started', by: order.assignee, time: '09:00 AM', date: order.scheduledDate },
                  ].map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="size-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.by} • {event.date} at {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button className="w-full">
                <Wrench className="mr-2 size-4" />
                Update Service Status
              </Button>
              <Button variant="outline" className="w-full">
                <Printer className="mr-2 size-4" />
                Generate PDF Report
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export function ServiceOrdersContent() {
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')

  const filteredOrders = serviceOrders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false
    if (typeFilter !== 'all' && order.type !== typeFilter) return false
    return true
  })

  const stats = {
    total: serviceOrders.length,
    pending: serviceOrders.filter((o) => o.status === 'pending').length,
    inProgress: serviceOrders.filter((o) => o.status === 'in-progress').length,
    completed: serviceOrders.filter((o) => o.status === 'completed' || o.status === 'closed').length,
    billed: serviceOrders.filter((o) => o.status === 'billed').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Service Orders</h1>
          <p className="text-muted-foreground">
            Manage maintenance and repair service orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <CreateServiceOrderDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('all')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('pending')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Clock className="size-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('in-progress')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Wrench className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('completed')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <CheckCircle2 className="size-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('billed')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <FileText className="size-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.billed}</p>
                <p className="text-xs text-muted-foreground">Billed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search orders..." className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="billed">Billed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Corrective">Corrective</SelectItem>
                  <SelectItem value="Preventive">Preventive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <span className="font-mono font-medium">{order.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        <Package className="size-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{order.equipment}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{order.hospital}</p>
                      <p className="text-xs text-muted-foreground">{order.area}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(order.type)}</TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                        <User className="size-3 text-primary" />
                      </div>
                      <span className="text-sm">{order.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-primary">{order.scheduledDate}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ServiceOrderDetail order={order} />
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
                            <Settings2 className="mr-2 size-4" />
                            Edit Order
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 size-4" />
                            Print PDF
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {serviceOrders.length} orders
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
