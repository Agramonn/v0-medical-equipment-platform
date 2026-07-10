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
  Download,
  Eye,
  FileText,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wrench,
  XCircle,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ContractWithRelations } from '@/app/contracts/page'
import { AddContractDialog } from './add-contracts-dialog'
import { ContractDetailSheet } from './contract-detail-sheet'
import { deleteContract } from '@/lib/actions/contracts'

type Organization = { id: string; name: string; city: string; state: string }
type EquipmentForContract = {
  id: string
  serialNumber: string
  assetNumber: string
  department: string
  organizationId: string
  equipmentModelId: string
  equipmentModel: {
    id: string
    name: string
    manufacturer: string
    model: string
    category: string
  }
}

// ── Badge helpers ─────────────────────────────────────────────────────────────

const typeLabels: Record<string, string> = {
  PUBLIC_BID: 'Public Bid',
  DIRECT_AWARD: 'Direct Award',
  LIMITED_TENDER: 'Limited Tender',
  LOAN_AGREEMENT: 'Loan Agreement',
  PRIVATE: 'Private',
}

const coverageLabels: Record<string, string> = {
  FULL_SERVICE: 'Full Service',
  PREVENTIVE_ONLY: 'PM Only',
  CORRECTIVE_ONLY: 'Corrective',
  LOAN_AGREEMENT: 'Comodato',
  WARRANTY: 'Warranty',
  PARTS_ONLY: 'Parts Only',
}

const statusConfig: Record<string, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  ACTIVE: { label: 'Active', className: 'bg-success/10 text-success', Icon: CheckCircle2 },
  EXPIRED: { label: 'Expired', className: 'bg-muted text-muted-foreground', Icon: XCircle },
  CANCELLED: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive', Icon: XCircle },
  DRAFT: { label: 'Draft', className: 'bg-warning/10 text-warning', Icon: AlertTriangle },
}

function daysUntil(date: Date | string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function StatusBadge({ status }: { status: string }) {
  const meta = statusConfig[status] ?? statusConfig.DRAFT
  return (
    <Badge className={meta.className}>
      <meta.Icon className="mr-1 size-3" />
      {meta.label}
    </Badge>
  )
}

function ExpiryLabel({ endDate, status }: { endDate: Date; status: string }) {
  const days = daysUntil(endDate)
  if (status !== 'ACTIVE') return null
  if (days < 0) return <span className="text-xs text-destructive">Expired</span>
  if (days <= 30) return <span className="text-xs font-medium text-destructive">{days}d left</span>
  if (days <= 90) return <span className="text-xs font-medium text-warning">{days}d left</span>
  return <span className="text-xs text-muted-foreground">{days}d left</span>
}

// ── Main component ────────────────────────────────────────────────────────────

export function ContractsContent({
  contracts,
  organizations,
  equipmentByOrg,
}: {
  contracts: ContractWithRelations[]
  organizations: Organization[]
  equipmentByOrg: EquipmentForContract[]
}) {
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [search, setSearch] = React.useState('')
  const [addOpen, setAddOpen] = React.useState(false)
  const [activeContract, setActiveContract] = React.useState<ContractWithRelations | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [contractToDelete, setContractToDelete] = React.useState<ContractWithRelations | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const filteredContracts = contracts.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        c.contractNumber.toLowerCase().includes(q) ||
        c.client.name.toLowerCase().includes(q)
      )
    }
    return true
  })

  // ── Stats calculados desde datos reales ──
  const totalValue = contracts.reduce((sum, c) => sum + (c.totalValue ?? 0), 0)
  const activeCount = contracts.filter((c) => c.status === 'ACTIVE').length
  const expiringSoon = contracts.filter((c) => {
    const days = daysUntil(c.endDate)
    return c.status === 'ACTIVE' && days >= 0 && days <= 90
  }).length

  // ── Coverage line items — todos los modelos cubiertos entre todos los contratos ──
  const allCoverage = contracts.flatMap((c) =>
    c.equipmentCoverage.map((cov) => ({
      ...cov,
      contractNumber: c.contractNumber,
      clientName: c.client.name,
    }))
  )

  // ── PM Plans — coverage con PM visits > 0 y contrato activo ──
  const pmPlans = contracts
    .filter((c) => c.status === 'ACTIVE')
    .flatMap((c) =>
      c.equipmentCoverage
        .filter((cov) => cov.pmVisitsPerYear > 0)
        .map((cov) => ({
          id: cov.id,
          contractNumber: c.contractNumber,
          clientName: c.client.name,
          modelName: cov.equipmentModel.name,
          manufacturer: cov.equipmentModel.manufacturer,
          coverageType: cov.coverageType,
          pmVisitsPerYear: cov.pmVisitsPerYear,
          slaHours: cov.slaHours,
          contractEndDate: c.endDate,
        }))
    )

  const dueSoon = expiringSoon > 0

  const stats = [
    {
      title: 'Total Contract Value',
      value: totalValue > 0 ? `$${(totalValue / 1000).toFixed(0)}K` : '—',
      Icon: DollarSign,
      bg: 'bg-success/10',
      text: 'text-success',
    },
    {
      title: 'Active Contracts',
      value: String(activeCount),
      Icon: FileText,
      bg: 'bg-muted',
      text: 'text-muted-foreground',
    },
    {
      title: 'Expiring Soon',
      value: String(expiringSoon),
      Icon: AlertTriangle,
      bg: 'bg-warning/10',
      text: 'text-warning',
    },
    {
      title: 'PM Plans',
      value: String(pmPlans.length),
      Icon: CalendarClock,
      bg: 'bg-primary/10',
      text: 'text-primary',
    },
  ]

  async function handleDelete() {
    if (!contractToDelete) return
    setIsDeleting(true)
    try {
      await deleteContract(contractToDelete.id)
      setContractToDelete(null)
    } catch (e) {
      console.error(e)
    } finally {
      setIsDeleting(false)
    }
  }

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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 size-4" />
            New Contract
          </Button>
        </div>
      </div>

      {/* Stats — layout vertical como el original */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={cn('rounded-lg p-2', stat.bg)}>
                  <stat.Icon className={cn('size-5', stat.text)} />
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
        ))}
      </div>

      <Tabs defaultValue="contracts" className="space-y-4">
        {/* Tabs + filtros en la misma fila — igual que el original */}
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
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Tab: Contracts ── */}
        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow
                      key={contract.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setActiveContract(contract)
                        setDetailOpen(true)
                      }}
                    >
                      <TableCell>
                        <span className="font-mono text-sm font-medium">
                          {contract.contractNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{contract.client.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {contract.client.city}, {contract.client.state}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {typeLabels[contract.type] ?? contract.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {contract.equipmentCoverage.length} model{contract.equipmentCoverage.length !== 1 ? 's' : ''}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{new Date(contract.startDate).toLocaleDateString('en-US')}</p>
                          <p className="text-xs text-muted-foreground">
                            → {new Date(contract.endDate).toLocaleDateString('en-US')}
                          </p>
                          <ExpiryLabel endDate={contract.endDate} status={contract.status} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {contract.totalValue
                            ? `$${contract.totalValue.toLocaleString()} ${contract.currency}`
                            : <span className="text-muted-foreground">—</span>}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={contract.status} />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setActiveContract(contract)
                            setDetailOpen(true)
                          }}
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredContracts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                        No contracts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            Showing {filteredContracts.length} of {contracts.length} contracts
          </p>
        </TabsContent>

        {/* ── Tab: Covered Equipment ── */}
        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Covered Equipment &amp; Obligations
              </CardTitle>
              <CardDescription>
                Each contract line item defines the maintenance obligations
                (PM frequency, SLA, parts/labor) for an equipment model.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment Model</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contract</TableHead>
                    <TableHead>Coverage Type</TableHead>
                    <TableHead>PM Visits/yr</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Parts</TableHead>
                    <TableHead>Labor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allCoverage.map((cov) => (
                    <TableRow key={cov.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wrench className="size-4 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{cov.equipmentModel.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {cov.equipmentModel.manufacturer} · {cov.equipmentModel.model}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{cov.clientName}</TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">{cov.contractNumber}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {coverageLabels[cov.coverageType] ?? cov.coverageType}
                        </Badge>
                      </TableCell>
                      <TableCell className="tabular-nums text-sm">
                        {cov.pmVisitsPerYear}/yr
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {cov.slaHours}h
                      </TableCell>
                      <TableCell>
                        {cov.includesParts ? (
                          <CheckCircle2 className="size-4 text-success" />
                        ) : (
                          <XCircle className="size-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        {cov.includesLabor ? (
                          <CheckCircle2 className="size-4 text-success" />
                        ) : (
                          <XCircle className="size-4 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {allCoverage.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                        No equipment coverage configured yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: PM Plans ── */}
        <TabsContent value="pm-plans" className="space-y-4">
          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardContent className="flex items-start gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Sparkles className="size-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Preventive maintenance originates here</p>
                <p className="text-muted-foreground">
                  PM Plans are derived from active contracts. Each covered equipment model
                  with PM visits &gt; 0 generates a plan. Automatic Service Order generation
                  is planned for a future release.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment Model</TableHead>
                    <TableHead>Coverage Type</TableHead>
                    <TableHead>Origin Contract</TableHead>
                    <TableHead>PM Visits/yr</TableHead>
                    <TableHead>SLA Response</TableHead>
                    <TableHead>Contract Ends</TableHead>
                    <TableHead>Generation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pmPlans.map((plan) => {
                    const days = daysUntil(plan.contractEndDate)
                    const expiringSoonPlan = days >= 0 && days <= 90
                    return (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{plan.modelName}</p>
                            <p className="text-xs text-muted-foreground">{plan.manufacturer}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              plan.coverageType === 'CORRECTIVE_ONLY'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-success/10 text-success'
                            }
                          >
                            {coverageLabels[plan.coverageType] ?? plan.coverageType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-mono text-xs">{plan.contractNumber}</p>
                            <p className="text-xs text-muted-foreground">{plan.clientName}</p>
                          </div>
                        </TableCell>
                        <TableCell className="tabular-nums text-sm">
                          {plan.pmVisitsPerYear}/yr
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {plan.slaHours}h
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{new Date(plan.contractEndDate).toLocaleDateString('en-US')}</p>
                            {expiringSoonPlan && (
                              <p className="text-xs text-warning">{days}d left</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-muted-foreground text-xs">
                            Manual
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {pmPlans.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                        No active PM plans. Create a contract with PM visits to generate plans.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* PM Plans due soon alert — igual que el original */}
      {dueSoon && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <ClipboardList className="mt-0.5 size-5 text-primary shrink-0" />
                <div>
                  <p className="font-medium">
                    {expiringSoon} contract{expiringSoon > 1 ? 's' : ''} expiring within 90 days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Review contracts before expiration to ensure service continuity.
                    Consider renewal or extension negotiations.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStatusFilter('ACTIVE')}>
                Review
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <AddContractDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        organizations={organizations}
        equipmentByOrg={equipmentByOrg}
      />

      <ContractDetailSheet
        contract={activeContract}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDelete={(c) => {
          setDetailOpen(false)
          setContractToDelete(c)
        }}
      />

      <AlertDialog
        open={!!contractToDelete}
        onOpenChange={(o) => { if (!o) setContractToDelete(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this contract?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete contract {contractToDelete?.contractNumber}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}