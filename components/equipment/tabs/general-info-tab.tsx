'use client'

import * as React from 'react'
import {
  Activity,
  Calendar,
  Clock,
  Download,
  Gauge,
  Lightbulb,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { aiRecommendations, type AiRecommendation } from '@/lib/equipment-data'
import { ContractSummary } from '@/components/equipment/contract-summary'
import { EquipmentWithDetails } from '@/lib/types'

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}

function activityIcon(summary: string) {
  const s = summary.toLowerCase()
  if (s.includes('calibrat')) {
    return { Icon: Gauge, className: 'bg-primary/10 text-primary' }
  }
  if (s.includes('preventive')) {
    return { Icon: ShieldCheck, className: 'bg-success/10 text-success' }
  }
  return { Icon: Wrench, className: 'bg-warning/10 text-warning' }
}

function severityBadge(severity: AiRecommendation['severity']) {
  switch (severity) {
    case 'high':
      return 'bg-destructive/10 text-destructive'
    case 'medium':
      return 'bg-warning/10 text-warning'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'OPERATIONAL':
      return { label: 'Operational', className: 'text-success' }
    case 'MAINTENANCE':
      return { label: 'In Maintenance', className: 'text-primary' }
    case 'NEEDS_ATTENTION':
      return { label: 'Needs Attention', className: 'text-warning' }
    case 'OUT_OF_SERVICE':
      return { label: 'Out of Service', className: 'text-destructive' }
    default:
      return { label: status, className: 'text-muted-foreground' }
  }
}

function QrDialog({ equipment }: { equipment: EquipmentWithDetails }) {
  const payload = `${equipment.id} | ${equipment.equipmentModel.name} | ${equipment.serialNumber}`
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="mr-2 size-4" />
          Generate QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Equipment QR Code</DialogTitle>
          <DialogDescription>
            Scan to open this equipment record on a mobile device.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="rounded-xl border bg-white p-4">
            <QRCodeSVG value={payload} size={196} level="M" />
          </div>
          <div className="text-center">
            <p className="font-medium">{equipment.equipmentModel.name}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {equipment.serialNumber}
            </p>
          </div>
          <Button className="w-full" variant="outline">
            <Download className="mr-2 size-4" />
            Download QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function GeneralInfoTab({ equipment }: { equipment: EquipmentWithDetails }) {
  const usagePercent = Math.round((equipment.hoursUsed / equipment.maxHours) * 100)
  const status = statusLabel(equipment.status)

  const nextServiceDays = equipment.nextServiceDate
    ? Math.ceil(
        (equipment.nextServiceDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null

  const recentActivity = equipment.serviceHistory.slice(0, 5)

  return (
    <div className="space-y-6 p-4">
      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="size-4" />
              <span className="text-xs">Status</span>
            </div>
            <p className={cn('mt-1 text-lg font-semibold', status.className)}>
              {status.label}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" />
              <span className="text-xs">Hours Used</span>
            </div>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {equipment.hoursUsed.toLocaleString()}
            </p>
            <Progress value={usagePercent} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4" />
              <span className="text-xs">Next Service</span>
            </div>
            <p className="mt-1 text-lg font-semibold text-primary tabular-nums">
              {nextServiceDays !== null ? `${nextServiceDays} days` : '—'}
            </p>
            <p className="text-xs text-muted-foreground">
              {equipment.nextServiceDate?.toLocaleDateString('en-US') ?? 'Not scheduled'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-4" />
              <span className="text-xs">Contract</span>
            </div>
            <p className="mt-1 text-lg font-semibold">
              {equipment.contractType ?? 'None'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* General information */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">General Information</CardTitle>
            <QrDialog equipment={equipment} />
          </CardHeader>
          <CardContent>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Equipment Name" value={equipment.equipmentModel.name} />
              <InfoField label="Category" value={equipment.equipmentModel.category} />
              <InfoField label="Manufacturer" value={equipment.equipmentModel.manufacturer} />
              <InfoField label="Model" value={equipment.equipmentModel.model} />
              <InfoField
                label="Serial Number"
                value={<span className="font-mono">{equipment.serialNumber}</span>}
              />
              <InfoField
                label="Asset Number"
                value={<span className="font-mono">{equipment.assetNumber}</span>}
              />
              <InfoField
                label="Location"
                value={
                  <span className="flex items-start gap-1">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    {equipment.location}
                  </span>
                }
              />
              <InfoField label="Department" value={equipment.department} />
              <InfoField
                label="Installation Date"
                value={equipment.installDate.toLocaleDateString('en-US')}
              />
              <InfoField
                label="Purchase Date"
                value={equipment.purchaseDate.toLocaleDateString('en-US')}
              />
              <InfoField
                label="Last Service"
                value={equipment.lastServiceDate?.toLocaleDateString('en-US') ?? '—'}
              />
              <InfoField
                label="Next Service"
                value={equipment.nextServiceDate?.toLocaleDateString('en-US') ?? '—'}
              />
            </div>

            <Separator className="my-5" />

            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Hospital" value={equipment.organization.name} />
              <InfoField
                label="City"
                value={`${equipment.organization.city}, ${equipment.organization.state}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent activity + contract summary */}
        <div className="space-y-6">
          <ContractSummary contractType={equipment.contractType} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Corrective, preventive & calibration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No service history recorded yet.
                </p>
              )}
              {recentActivity.map((item) => {
                const { Icon, className } = activityIcon(item.summary)
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className={cn('rounded-lg p-2', className)}>
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug">{item.summary}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.date.toLocaleDateString('en-US')} · {item.engineer.name}
                      </p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI recommendations — still mock, connected in Phase 4 (AI module) */}
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">AI Recommendations</CardTitle>
              <CardDescription>
                Generated from manuals and service history
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiRecommendations.map((rec) => (
            <div key={rec.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{rec.title}</p>
                    <Badge className={cn('text-[10px]', severityBadge(rec.severity))}>
                      {rec.severity} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.detail}</p>
                  <p className="text-xs text-muted-foreground/80">Source: {rec.source}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
