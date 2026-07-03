'use client'

import * as React from 'react'
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  FileText,
  Loader2,
  Trash2,
  XCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ContractWithRelations } from '@/app/contracts/page'
import { updateContractStatus } from '@/lib/actions/contracts'

function daysUntil(date: Date) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

const coverageLabels: Record<string, string> = {
  FULL_SERVICE: 'Full Service',
  PREVENTIVE_ONLY: 'Preventive Only',
  CORRECTIVE_ONLY: 'Corrective Only',
  LOAN_AGREEMENT: 'Loan Agreement',
  WARRANTY: 'Warranty',
  PARTS_ONLY: 'Parts Only',
}

const typeLabels: Record<string, string> = {
  PUBLIC_BID: 'Public Bid (Licitación)',
  DIRECT_AWARD: 'Direct Award (Adjudicación Directa)',
  LIMITED_TENDER: 'Limited Tender (Invitación Restringida)',
  LOAN_AGREEMENT: 'Loan Agreement (Comodato)',
  PRIVATE: 'Private Contract',
}

export function ContractDetailSheet({
  contract,
  open,
  onOpenChange,
  onDelete,
}: {
  contract: ContractWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (contract: ContractWithRelations) => void
}) {
  const [isPending, setIsPending] = React.useState(false)

  if (!contract) return null

  const days = daysUntil(contract.endDate)
  const isExpired = days < 0

  async function handleStatusChange(newStatus: string) {
    setIsPending(true)
    try {
      await updateContractStatus(contract!.id, newStatus)
      onOpenChange(false)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-xl">
        <SheetHeader className="shrink-0 border-b p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            <span className="font-mono">{contract.contractNumber}</span>
          </SheetTitle>
          <SheetDescription>
            {typeLabels[contract.type] ?? contract.type} · {contract.client.name}
          </SheetDescription>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge className={
              contract.status === 'ACTIVE' ? 'bg-success/10 text-success' :
              contract.status === 'EXPIRED' ? 'bg-muted text-muted-foreground' :
              contract.status === 'CANCELLED' ? 'bg-destructive/10 text-destructive' :
              'bg-warning/10 text-warning'
            }>
              {contract.status}
            </Badge>
            {contract.totalValue && (
              <Badge variant="outline">
                ${contract.totalValue.toLocaleString()} {contract.currency}
              </Badge>
            )}
            {!isExpired && days <= 90 && (
              <Badge className="bg-warning/10 text-warning">
                <CalendarClock className="mr-1 size-3" />
                {days}d remaining
              </Badge>
            )}
            {isExpired && (
              <Badge className="bg-destructive/10 text-destructive">
                <XCircle className="mr-1 size-3" />
                Expired
              </Badge>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-5 p-6">
            {/* Contract details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Contract Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="divide-y divide-border text-sm">
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Client</dt>
                    <dd className="text-right font-medium">{contract.client.name}</dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="text-right">
                      {contract.client.city}, {contract.client.state}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Start Date</dt>
                    <dd className="text-right">
                      {new Date(contract.startDate).toLocaleDateString('en-US')}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">End Date</dt>
                    <dd className="text-right font-medium">
                      {new Date(contract.endDate).toLocaleDateString('en-US')}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 py-2">
                    <dt className="text-muted-foreground">Value</dt>
                    <dd className="text-right">
                      {contract.totalValue
                        ? `$${contract.totalValue.toLocaleString()} ${contract.currency}`
                        : 'Not specified (Comodato or warranty)'}
                    </dd>
                  </div>
                  {contract.notes && (
                    <div className="py-2">
                      <dt className="text-muted-foreground mb-1">Notes</dt>
                      <dd className="text-sm">{contract.notes}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Equipment coverage */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Equipment Coverage ({contract.equipmentCoverage.length} model{contract.equipmentCoverage.length !== 1 ? 's' : ''})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contract.equipmentCoverage.map((cov) => (
                  <div key={cov.id} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{cov.equipmentModel.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cov.equipmentModel.manufacturer} · {cov.equipmentModel.model}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {coverageLabels[cov.coverageType] ?? cov.coverageType}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>{cov.pmVisitsPerYear} PM visits/year</span>
                      <span>SLA: {cov.slaHours}h response</span>
                      {cov.includesParts && <span className="text-success">✓ Parts included</span>}
                      {cov.includesLabor && <span className="text-success">✓ Labor included</span>}
                    </div>
                    {cov.notes && (
                      <p className="text-xs text-muted-foreground">{cov.notes}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="shrink-0 border-t bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Select
              value={contract.status}
              onValueChange={handleStatusChange}
              disabled={isPending}
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {isPending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          </div>
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => onDelete(contract)}
          >
            <Trash2 className="mr-2 size-4" />
            Delete Contract
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}