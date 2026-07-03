'use client'

import * as React from 'react'
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Plus,
  Search,
  Wrench,
  XCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { ContractWithRelations, EquipmentForContract } from '@/app/contracts/page'
import { AddContractDialog } from './add-contracts-dialog'
import { ContractDetailSheet } from './contract-detail-sheet'
import { deleteContract, updateContractStatus } from '@/lib/actions/contracts'

type Organization = { id: string; name: string; city: string; state: string }


const typeLabels: Record<string, string> = {
  PUBLIC_BID: 'Public Bid',
  DIRECT_AWARD: 'Direct Award',
  LIMITED_TENDER: 'Limited Tender',
  LOAN_AGREEMENT: 'Loan Agreement',
  PRIVATE: 'Private',
}

const statusConfig: Record<string, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  ACTIVE: { label: 'Active', className: 'bg-success/10 text-success', Icon: CheckCircle2 },
  EXPIRED: { label: 'Expired', className: 'bg-muted text-muted-foreground', Icon: XCircle },
  CANCELLED: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive', Icon: XCircle },
  DRAFT: { label: 'Draft', className: 'bg-warning/10 text-warning', Icon: AlertTriangle },
}

function daysUntil(date: Date) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function ContractStatusBadge({ status }: { status: string }) {
  const meta = statusConfig[status] ?? statusConfig.DRAFT
  return (
    <Badge className={meta.className}>
      <meta.Icon className="mr-1 size-3" />
      {meta.label}
    </Badge>
  )
}

function ExpiryBadge({ endDate }: { endDate: Date }) {
  const days = daysUntil(endDate)
  if (days < 0) return <span className="text-sm text-muted-foreground">Expired</span>
  if (days <= 30) return <span className="text-sm font-medium text-destructive">{days}d left</span>
  if (days <= 90) return <span className="text-sm font-medium text-warning">{days}d left</span>
  return <span className="text-sm text-muted-foreground">{days}d left</span>
}

export function ContractsContent({
  contracts,
  organizations,
  equipmentByOrg,
}: {
  contracts: ContractWithRelations[]
  organizations: Organization[]
  equipmentByOrg: EquipmentForContract[]
}) {
  const [query, setQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [addOpen, setAddOpen] = React.useState(false)
  const [activeContract, setActiveContract] = React.useState<ContractWithRelations | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [contractToDelete, setContractToDelete] = React.useState<ContractWithRelations | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const filtered = contracts.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (typeFilter !== 'all' && c.type !== typeFilter) return false
    if (query) {
      const q = query.toLowerCase()
      return (
        c.contractNumber.toLowerCase().includes(q) ||
        c.client.name.toLowerCase().includes(q)
      )
    }
    return true
  })

  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === 'ACTIVE').length,
    expiringSoon: contracts.filter((c) => {
      const days = daysUntil(c.endDate)
      return c.status === 'ACTIVE' && days >= 0 && days <= 90
    }).length,
    expired: contracts.filter((c) => c.status === 'EXPIRED' || daysUntil(c.endDate) < 0).length,
  }

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
          <h1 className="text-2xl font-semibold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground">
            Manage service contracts, warranties and coverage agreements
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="size-5 text-primary" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-semibold tracking-tight tabular-nums">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <CheckCircle2 className="size-5 text-success" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-semibold tracking-tight tabular-nums">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <CalendarClock className="size-5 text-warning" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-semibold tracking-tight tabular-nums">{stats.expiringSoon}</p>
                <p className="text-sm text-muted-foreground">Expiring in 90d</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <XCircle className="size-5 text-muted-foreground" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-semibold tracking-tight tabular-nums">{stats.expired}</p>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by number or client..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PUBLIC_BID">Public Bid</SelectItem>
                <SelectItem value="DIRECT_AWARD">Direct Award</SelectItem>
                <SelectItem value="LIMITED_TENDER">Limited Tender</SelectItem>
                <SelectItem value="LOAN_AGREEMENT">Loan Agreement</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract No.</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((contract) => (
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
                    <Badge variant="outline">
                      {typeLabels[contract.type] ?? contract.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {contract.equipmentCoverage.length} model{contract.equipmentCoverage.length !== 1 ? 's' : ''}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(contract.startDate).toLocaleDateString('en-US')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm">
                        {new Date(contract.endDate).toLocaleDateString('en-US')}
                      </p>
                      <ExpiryBadge endDate={contract.endDate} />
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
                    <ContractStatusBadge status={contract.status} />
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
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                    No contracts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {contracts.length} contracts
        </p>
      </div>

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