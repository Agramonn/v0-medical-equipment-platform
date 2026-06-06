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
  Package,
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
import {
  equipmentData,
  recentActivity,
  aiRecommendations,
  type RecentActivity,
  type AiRecommendation,
} from '@/lib/equipment-data'

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

function activityIcon(type: RecentActivity['type']) {
  switch (type) {
    case 'Corrective':
      return { Icon: Wrench, className: 'bg-warning/10 text-warning' }
    case 'Calibration':
      return { Icon: Gauge, className: 'bg-primary/10 text-primary' }
    default:
      return { Icon: ShieldCheck, className: 'bg-success/10 text-success' }
  }
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

function QrDialog() {
  const payload = `${equipmentData.id} | ${equipmentData.name} | ${equipmentData.serialNumber}`
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
            <p className="font-medium">{equipmentData.name}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {equipmentData.serialNumber}
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

export function GeneralInfoTab() {
  const usagePercent = Math.round(
    (equipmentData.hoursUsed / equipmentData.maxHours) * 100,
  )
  const nextServiceDays = 48

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
            <p className="mt-1 text-lg font-semibold text-success">Operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" />
              <span className="text-xs">Hours Used</span>
            </div>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {equipmentData.hoursUsed.toLocaleString()}
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
              {nextServiceDays} days
            </p>
            <p className="text-xs text-muted-foreground">{equipmentData.nextService}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-4" />
              <span className="text-xs">Warranty</span>
            </div>
            <p className="mt-1 text-lg font-semibold">Active</p>
            <p className="text-xs text-muted-foreground">
              until {equipmentData.warranty.expiresOn}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* General information */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">General Information</CardTitle>
            <QrDialog />
          </CardHeader>
          <CardContent>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Equipment Name" value={equipmentData.name} />
              <InfoField label="Category" value={equipmentData.category} />
              <InfoField label="Manufacturer" value={equipmentData.manufacturer} />
              <InfoField label="Model" value={equipmentData.model} />
              <InfoField
                label="Serial Number"
                value={<span className="font-mono">{equipmentData.serialNumber}</span>}
              />
              <InfoField
                label="Asset Number"
                value={<span className="font-mono">{equipmentData.assetNumber}</span>}
              />
              <InfoField
                label="Location"
                value={
                  <span className="flex items-start gap-1">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    {equipmentData.location}
                  </span>
                }
              />
              <InfoField label="Department" value={equipmentData.department} />
              <InfoField label="Installation Date" value={equipmentData.installationDate} />
              <InfoField label="Purchase Date" value={equipmentData.purchaseDate} />
              <InfoField label="Last Service" value={equipmentData.lastService} />
              <InfoField label="Next Service" value={equipmentData.nextService} />
            </div>

            <Separator className="my-5" />

            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Warranty Provider" value={equipmentData.warranty.provider} />
              <InfoField label="Warranty Type" value={equipmentData.warranty.type} />
              <InfoField label="Warranty Expires" value={equipmentData.warranty.expiresOn} />
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Corrective, preventive & calibration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((item) => {
              const { Icon, className } = activityIcon(item.type)
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div className={cn('rounded-lg p-2', className)}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium leading-snug">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.date} · {item.engineer}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* AI recommendations */}
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
            <div
              key={rec.id}
              className="rounded-lg border bg-card p-4"
            >
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
