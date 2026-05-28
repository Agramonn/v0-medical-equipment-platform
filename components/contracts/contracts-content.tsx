'use client'

import * as React from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Settings2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock contracts data
const contractsData = [
  {
    id: 'CTR-001',
    hospital: 'Central Hospital',
    type: 'Full Service',
    equipment: 342,
    coveredEquipment: 267,
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    value: 450000,
    status: 'active',
    slaCompliance: 98.5,
    servicesCompleted: 156,
    daysRemaining: 675,
  },
  {
    id: 'CTR-002',
    hospital: 'Regional Medical Center',
    type: 'Full Service',
    equipment: 567,
    coveredEquipment: 521,
    startDate: '2022-06-01',
    endDate: '2024-05-31',
    value: 680000,
    status: 'expiring',
    slaCompliance: 96.2,
    servicesCompleted: 289,
    daysRemaining: 93,
  },
  {
    id: 'CTR-003',
    hospital: 'City Clinic',
    type: 'Preventive Only',
    equipment: 189,
    coveredEquipment: 123,
    startDate: '2023-06-01',
    endDate: '2025-05-31',
    value: 180000,
    status: 'active',
    slaCompliance: 99.1,
    servicesCompleted: 67,
    daysRemaining: 459,
  },
  {
    id: 'CTR-004',
    hospital: 'Emergency Center',
    type: 'Parts Only',
    equipment: 275,
    coveredEquipment: 198,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    value: 95000,
    status: 'active',
    slaCompliance: 97.8,
    servicesCompleted: 34,
    daysRemaining: 308,
  },
  {
    id: 'CTR-005',
    hospital: 'Metro Health System',
    type: 'Full Service',
    equipment: 892,
    coveredEquipment: 756,
    startDate: '2023-03-01',
    endDate: '2024-02-29',
    value: 920000,
    status: 'expired',
    slaCompliance: 94.5,
    servicesCompleted: 423,
    daysRemaining: 0,
  },
]

const stats = [
  {
    title: 'Total Contract Value',
    value: '$2.32M',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Active Contracts',
    value: '4',
    change: '0',
    trend: 'neutral',
    icon: FileText,
  },
  {
    title: 'Expiring Soon',
    value: '1',
    change: 'In 93 days',
    trend: 'warning',
    icon: AlertTriangle,
  },
  {
    title: 'Avg SLA Compliance',
    value: '97.2%',
    change: '+1.3%',
    trend: 'up',
    icon: CheckCircle2,
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-success/10 text-success">
          Active
        </Badge>
      )
    case 'expiring':
      return (
        <Badge className="bg-warning/10 text-warning">
          Expiring Soon
        </Badge>
      )
    case 'expired':
      return (
        <Badge className="bg-destructive/10 text-destructive">
          Expired
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getTypeBadge(type: string) {
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

export function ContractsContent() {
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  const filteredContracts = contractsData.filter((contract) => {
    if (statusFilter !== 'all' && contract.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Contracts</h1>
          <p className="text-muted-foreground">
            Manage service contracts and SLA compliance
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          New Contract
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={cn(
                  'rounded-lg p-2',
                  stat.trend === 'up' && 'bg-success/10',
                  stat.trend === 'warning' && 'bg-warning/10',
                  stat.trend === 'neutral' && 'bg-muted'
                )}>
                  <stat.icon className={cn(
                    'size-5',
                    stat.trend === 'up' && 'text-success',
                    stat.trend === 'warning' && 'text-warning',
                    stat.trend === 'neutral' && 'text-muted-foreground'
                  )} />
                </div>
                {stat.trend !== 'neutral' && stat.trend !== 'warning' && (
                  <div className="flex items-center gap-1 text-sm">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="size-4 text-success" />
                    ) : (
                      <TrendingDown className="size-4 text-destructive" />
                    )}
                    <span className={stat.trend === 'up' ? 'text-success' : 'text-destructive'}>
                      {stat.change}
                    </span>
                  </div>
                )}
                {stat.trend === 'warning' && (
                  <span className="text-xs text-warning">{stat.change}</span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contracts Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="expiring">Expiring</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search contracts..." className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Building2 className="size-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{contract.hospital}</p>
                            <p className="text-xs text-muted-foreground">{contract.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(contract.type)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{contract.coveredEquipment}/{contract.equipment}</span>
                            <span className="text-muted-foreground">
                              {Math.round((contract.coveredEquipment / contract.equipment) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={(contract.coveredEquipment / contract.equipment) * 100} 
                            className="h-1.5" 
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className={cn(
                            'font-medium',
                            contract.slaCompliance >= 98 && 'text-success',
                            contract.slaCompliance >= 95 && contract.slaCompliance < 98 && 'text-warning',
                            contract.slaCompliance < 95 && 'text-destructive'
                          )}>
                            {contract.slaCompliance}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          ${(contract.value / 1000).toFixed(0)}K
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{contract.endDate}</p>
                          {contract.daysRemaining > 0 && (
                            <p className={cn(
                              'text-xs',
                              contract.daysRemaining <= 90 ? 'text-warning' : 'text-muted-foreground'
                            )}>
                              {contract.daysRemaining} days left
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 size-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 size-4" />
                              View Services
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="mr-2 size-4" />
                              Equipment List
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Settings2 className="mr-2 size-4" />
                              Edit Contract
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Active contracts view - same table with active filter applied
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Expiring contracts view - same table with expiring filter applied
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contract Renewal Alert */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <AlertTriangle className="size-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium">Contract Renewal Required</p>
                <p className="text-sm text-muted-foreground">
                  Regional Medical Center contract expires in 93 days. Schedule renewal meeting to discuss terms.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Schedule Meeting
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
