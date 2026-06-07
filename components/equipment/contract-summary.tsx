'use client'

import {
  CalendarClock,
  FileText,
  Gauge,
  ShieldCheck,
  ShieldX,
  Wrench,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  coverageTypeConfig,
  getActiveContractForEquipment,
  getPmPlansForEquipment,
  getWarrantyForEquipment,
  getWarrantyState,
  warrantyStateConfig,
  daysUntil,
} from '@/lib/contract-data'

function Row({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  )
}

function WarrantyLine({
  title,
  provider,
  endDate,
  details,
}: {
  title: string
  provider: string
  endDate: string
  details?: string
}) {
  const state = getWarrantyState(endDate)
  const meta = state ? warrantyStateConfig[state] : null
  const remaining = daysUntil(endDate)

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {state === 'expired' ? (
            <ShieldX className="size-4 text-destructive" />
          ) : (
            <ShieldCheck className="size-4 text-success" />
          )}
          <span className="text-sm font-medium">{title}</span>
        </div>
        {meta && <Badge className={meta.className}>{meta.label}</Badge>}
      </div>
      <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
        <p>{provider}</p>
        <p className="tabular-nums">
          Until {endDate}
          {remaining > 0 ? ` · ${remaining} days left` : ' · expired'}
        </p>
        {details && <p>{details}</p>}
      </div>
    </div>
  )
}

// Contract Summary widget for the Equipment Detail page. It surfaces the
// equipment's maintenance obligations: active contract, warranty status,
// PM frequency, next PM due and coverage details — all sourced from the
// contract data layer (the maintenance source of truth).
export function ContractSummary({ equipmentId }: { equipmentId: string }) {
  const coverage = getActiveContractForEquipment(equipmentId)
  const warranty = getWarrantyForEquipment(equipmentId)
  const plans = getPmPlansForEquipment(equipmentId)

  const nextPmPlan = plans
    .filter((p) => p.planType === 'Preventive Maintenance')
    .sort((a, b) => daysUntil(a.nextDueDate) - daysUntil(b.nextDueDate))[0]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileText className="size-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Contract Summary</CardTitle>
            <CardDescription>Maintenance coverage &amp; obligations</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {coverage ? (
          <>
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">
                    {coverage.contract.contractNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {coverage.contract.customerName}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={coverageTypeConfig[coverage.lineItem.coverageType].className}
                >
                  {coverageTypeConfig[coverage.lineItem.coverageType].short}
                </Badge>
              </div>
            </div>

            <div>
              <Row
                label="PM Frequency"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <Wrench className="size-3.5 text-muted-foreground" />
                    {coverage.lineItem.pmFrequency}
                  </span>
                }
              />
              <Separator />
              <Row
                label="Calibration"
                value={
                  coverage.lineItem.calibrationFrequency === 'None' ? (
                    <span className="text-muted-foreground">Not covered</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <Gauge className="size-3.5 text-muted-foreground" />
                      {coverage.lineItem.calibrationFrequency}
                    </span>
                  )
                }
              />
              <Separator />
              <Row
                label="Next PM Due"
                value={
                  nextPmPlan ? (
                    <span className="inline-flex items-center gap-1.5 text-primary">
                      <CalendarClock className="size-3.5" />
                      {nextPmPlan.nextDueDate}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )
                }
              />
              <Separator />
              <Row label="Included Visits" value={`${coverage.lineItem.includedVisits}/yr`} />
              <Separator />
              <Row label="Parts Coverage" value={coverage.lineItem.partsCoverage} />
              <Separator />
              <Row label="SLA" value={coverage.lineItem.sla} />
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed p-4 text-center">
            <p className="text-sm font-medium">No active contract</p>
            <p className="text-xs text-muted-foreground">
              This equipment is not covered by a service contract. Preventive
              maintenance is not scheduled.
            </p>
          </div>
        )}

        {/* Warranty status */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Warranty Status
          </p>
          {warranty?.manufacturer && (
            <WarrantyLine
              title="Manufacturer Warranty"
              provider={warranty.manufacturer.oemProvider}
              endDate={warranty.manufacturer.endDate}
            />
          )}
          {warranty?.company && (
            <WarrantyLine
              title="Company Warranty"
              provider="In-house coverage"
              endDate={warranty.company.endDate}
              details={warranty.company.coverageDetails}
            />
          )}
          {!warranty?.manufacturer && !warranty?.company && (
            <p className="text-sm text-muted-foreground">No warranty on record.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
