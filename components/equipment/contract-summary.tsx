'use client'

import { CalendarClock, CheckCircle2, FileText, ShieldCheck, XCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ContractCoverage } from '@/lib/types'

const coverageLabels: Record<string, string> = {
  FULL_SERVICE: 'Full Service',
  PREVENTIVE_ONLY: 'Preventive Only',
  CORRECTIVE_ONLY: 'Corrective Only',
  LOAN_AGREEMENT: 'Loan Agreement',
  WARRANTY: 'Warranty',
  PARTS_ONLY: 'Parts Only',
}

const typeLabels: Record<string, string> = {
  PUBLIC_BID: 'Public Bid',
  DIRECT_AWARD: 'Direct Award',
  LIMITED_TENDER: 'Limited Tender',
  LOAN_AGREEMENT: 'Loan Agreement (Comodato)',
  PRIVATE: 'Private',
}

function daysUntil(date: Date | string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export function ContractSummary({ coverage }: { coverage: ContractCoverage[] }) {
  const activeContracts = coverage.filter((c) => c.status === 'ACTIVE')

  if (coverage.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-muted p-2">
              <FileText className="size-4 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Contract Coverage</CardTitle>
              <CardDescription>Maintenance &amp; service obligations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed p-4 text-center">
            <p className="text-sm text-muted-foreground">
              This equipment model has no active contract coverage.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileText className="size-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Contract Coverage</CardTitle>
            <CardDescription>
              {activeContracts.length} active · {coverage.length} total
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {coverage.map((cov) => {
          const days = daysUntil(cov.endDate)
          const isActive = cov.status === 'ACTIVE'
          return (
            <div key={cov.id} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-mono text-muted-foreground">
                    {cov.contractNumber}
                  </p>
                  <p className="text-sm font-medium">{cov.contract.client.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {typeLabels[cov.type] ?? cov.type}
                  </p>
                </div>
                <Badge className={isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}>
                  {isActive ? 'Active' : cov.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">
                  {coverageLabels[cov.coverageType] ?? cov.coverageType}
                </Badge>
                <span className="text-muted-foreground">
                  {cov.pmVisitsPerYear} PM/yr · SLA {cov.slaHours}h
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {cov.includesParts && (
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle2 className="size-3" /> Parts
                  </span>
                )}
                {cov.includesLabor && (
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle2 className="size-3" /> Labor
                  </span>
                )}
                <span className={`ml-auto flex items-center gap-1 ${days <= 30 ? 'text-destructive' : days <= 90 ? 'text-warning' : ''}`}>
                  <CalendarClock className="size-3" />
                  {days > 0 ? `${days}d left` : 'Expired'}
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}