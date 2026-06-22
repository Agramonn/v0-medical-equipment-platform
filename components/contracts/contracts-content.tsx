'use client'

import * as React from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Eye,
  FileText,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
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
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  contracts,
  contractStatusConfig,
  coverageTypeConfig,
  pmPlans,
  daysUntil,
  isDueForGeneration,
  type Contract,
  type ContractStatus,
} from '@/lib/contract-data'

function ContractStatusBadge({ status }: { status: ContractStatus }) {
  const meta = contractStatusConfig[status]
  return <Badge className={meta.className}>{meta.label}</Badge>
}

function CoverageBadge({ type }: { type: Contract['coverageType'] }) {
  const meta = coverageTypeConfig[type]
  return (
    <Badge variant="outline" className={meta.className}>
      {meta.short}
    </Badge>
  )
}

const stats = [
  {
    title: 'Total Contract Value',
    value: `$${(contracts.reduce((s, c) => s + c.value, 0) / 1000).toFixed(0)}K`,
    icon: DollarSign,
    tone: 'success' as const,
  },
  {
    title: 'Active Contracts',
    value: String(contracts.filter((c) => c.status === 'active').length),
    icon: FileText,
    tone: 'neutral' as const,
  },
  {
    title: 'Expiring Soon',
    value: String(contracts.filter((c) => c.status === 'expiring-soon').length),
    icon: AlertTriangle,
    tone: 'warning' as const,
  },
  {
    title: 'PM Plans',
    value: String(pmPlans.length),
    icon: CalendarClock,
    tone: 'primary' as const,
  },
]

const toneClasses: Record<string, { bg: string; text: string }> = {
  success: { bg: 'bg-success/10', text: 'text-success' },
  warning: { bg: 'bg-warning/10', text: 'text-warning' },
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  neutral: { bg: 'bg-muted', text: 'text-muted-foreground' },
}

export function ContractsContent() {
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [search, setSearch] = React.useState('')

  const filteredContracts = contracts.filter((contract) => {
    if (statusFilter !== 'all' && contract.status !== statusFilter) return false
    if (
      search &&
      !contract.customerName.toLowerCase().includes(search.toLowerCase()) &&
      !contract.contractNumber.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  const allLineItems = contracts.flatMap((c) =>
    c.lineItems.map((li) => ({ ...li, customerName: c.customerName })),
  )

  const dueSoon = pmPlans.filter((p) => isDueForGeneration(p, 30))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Contracts &amp; Maintenance Planning
          </h1>
          <p className="text-muted-foreground">
            Contracts define maintenance obligations. Preventive maintenance
            originates here, not from service orders.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          New Contract
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const tone = toneClasses[stat.tone]
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className={cn('rounded-lg p-2', tone.bg)}>
                    <stat.icon className={cn('size-5', tone.text)} />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-semibold tracking-tight tabular-nums">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="contracts" className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="coverage">Covered Equipment</TabsTrigger>
            <TabsTrigger value="pm-plans">PM Plans</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contracts table */}
        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Coverage Type</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => {
                    const remaining = daysUntil(contract.endDate)
                    return (
                      <TableRow key={contract.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-muted p-2">
                              <FileText className="size-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{contract.contractNumber}</p>
                              <p className="text-xs text-muted-foreground">
                                {contract.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {contract.customerName}
                        </TableCell>
                        <TableCell>
                          <CoverageBadge type={contract.coverageType} />
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {contract.lineItems.length}
                        </TableCell>
                        <TableCell className="font-medium tabular-nums">
                          {contract.value > 0
                            ? `$${(contract.value / 1000).toFixed(0)}K`
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <ContractStatusBadge status={contract.status} />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="tabular-nums">{contract.endDate}</p>
                            {remaining > 0 ? (
                              <p
                                className={cn(
                                  'text-xs',
                                  remaining <= 90
                                    ? 'text-warning'
                                    : 'text-muted-foreground',
                                )}
                              >
                                {remaining} days left
                              </p>
                            ) : (
                              <p className="text-xs text-destructive">Expired</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="size-4" />
                            <span className="sr-only">View contract</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coverage (line items) */}
        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Covered Equipment &amp; Obligations
              </CardTitle>
              <CardDescription>
                Each contract line item defines the maintenance obligations
                (PM frequency, calibration, SLA) for a piece of equipment.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>PM Frequency</TableHead>
                    <TableHead>Calibration</TableHead>
                    <TableHead>Included Visits</TableHead>
                    <TableHead>Parts</TableHead>
                    <TableHead>SLA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allLineItems.map((li) => (
                    <TableRow key={li.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wrench className="size-4 text-muted-foreground" />
                          <span className="font-medium">{li.equipmentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{li.customerName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{li.pmFrequency}</Badge>
                      </TableCell>
                      <TableCell>
                        {li.calibrationFrequency === 'None' ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <Badge variant="outline">{li.calibrationFrequency}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {li.includedVisits}/yr
                      </TableCell>
                      <TableCell className="text-sm">{li.partsCoverage}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {li.sla}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PM Plans */}
        <TabsContent value="pm-plans" className="space-y-4">
          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardContent className="flex items-start gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Sparkles className="size-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Preventive maintenance originates here</p>
                <p className="text-muted-foreground">
                  PM Plans are derived from active contracts. They are architected
                  to automatically generate Service Orders when due — generation is
                  prepared but not yet enabled.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Plan Type</TableHead>
                    <TableHead>Origin Contract</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Last Service</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Upcoming</TableHead>
                    <TableHead>Generation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pmPlans.map((plan) => {
                    const remaining = daysUntil(plan.nextDueDate)
                    const due = isDueForGeneration(plan, 30)
                    return (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">
                          {plan.equipmentName}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              plan.planType === 'Calibration'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-success/10 text-success'
                            }
                          >
                            {plan.planType === 'Calibration'
                              ? 'Calibration'
                              : 'Preventive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-mono">{plan.contractNumber}</p>
                            <p className="text-xs text-muted-foreground">
                              {plan.customerName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{plan.frequency}</Badge>
                        </TableCell>
                        <TableCell className="text-sm tabular-nums text-muted-foreground">
                          {plan.lastServiceDate ?? 'No service yet'}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="tabular-nums">{plan.nextDueDate}</p>
                            <p
                              className={cn(
                                'text-xs',
                                remaining <= 14
                                  ? 'text-destructive'
                                  : remaining <= 30
                                    ? 'text-warning'
                                    : 'text-muted-foreground',
                              )}
                            >
                              {remaining > 0 ? `in ${remaining} days` : 'overdue'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {plan.upcomingPmCount}
                        </TableCell>
                        <TableCell>
                          {!plan.autoGenerateEnabled ? (
                            <Badge variant="outline" className="text-muted-foreground">
                              Manual
                            </Badge>
                          ) : due ? (
                            <Badge className="bg-primary/10 text-primary">
                              <CalendarClock className="mr-1 size-3" />
                              Due for SO
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-success">
                              <CheckCircle2 className="mr-1 size-3" />
                              Scheduled
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upcoming PM generation alert */}
      {dueSoon.length > 0 && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <ClipboardList className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {dueSoon.length} PM plan{dueSoon.length > 1 ? 's' : ''} due within
                    30 days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    These obligations will generate Service Orders once automatic
                    generation is enabled. Review the PM Plans tab to schedule.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Review Plans
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
