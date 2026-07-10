'use client'

import * as React from 'react'
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Gauge,
  History,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
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
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ServiceHistoryWithRelations } from '@/app/history/page'

// ── Helpers ──────────────────────────────────────────────────────────────────

type HistoryType = ServiceHistoryWithRelations['type']

const typeLabels: Record<HistoryType, string> = {
  PREVENTIVE_MAINTENANCE: 'Preventive',
  CORRECTIVE_MAINTENANCE: 'Corrective',
  CALIBRATION: 'Calibration',
  INSPECTION: 'Inspection',
  INSTALLATION: 'Installation',
}

function typeMeta(type: HistoryType) {
  switch (type) {
    case 'CORRECTIVE_MAINTENANCE':
      return { Icon: Wrench, iconClass: 'text-warning', bgClass: 'bg-warning/10', badgeVariant: 'secondary' as const }
    case 'CALIBRATION':
      return { Icon: Gauge, iconClass: 'text-primary', bgClass: 'bg-primary/10', badgeVariant: 'outline' as const }
    case 'INSPECTION':
      return { Icon: AlertTriangle, iconClass: 'text-warning', bgClass: 'bg-warning/10', badgeVariant: 'secondary' as const }
    case 'INSTALLATION':
      return { Icon: Package, iconClass: 'text-success', bgClass: 'bg-success/10', badgeVariant: 'outline' as const }
    default:
      return { Icon: ShieldCheck, iconClass: 'text-primary', bgClass: 'bg-primary/10', badgeVariant: 'outline' as const }
  }
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

// ── HistoryDetailCard ─────────────────────────────────────────────────────────

function HistoryDetailCard({ record }: { record: ServiceHistoryWithRelations }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const meta = typeMeta(record.type)
  const label = typeLabels[record.type]
  const equipmentName = record.equipment.equipmentModel.name
  const serialNumber = record.equipment.serialNumber
  const organization = record.equipment.organization.name

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-4">
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={cn('rounded-lg p-2', meta.bgClass)}>
                  <meta.Icon className={cn('size-5', meta.iconClass)} />
                </div>
                <div>
                  <CardTitle className="text-base flex flex-wrap items-center gap-2">
                    {equipmentName}
                    <span className="font-mono text-xs font-normal text-muted-foreground">
                      {serialNumber}
                    </span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {record.date.toLocaleDateString('en-US')} · {label} · {organization}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={meta.badgeVariant}>{label}</Badge>
                <ChevronDown className={cn(
                  'size-4 text-muted-foreground transition-transform',
                  isOpen && 'rotate-180'
                )} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              {/* Diagnosis / Summary */}
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Summary / Diagnosis
                </p>
                <p className="text-sm">{record.summary}</p>
                {record.detail && (
                  <p className="text-sm text-muted-foreground">{record.detail}</p>
                )}
              </div>

              {/* Findings */}
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Findings & Observations
                </p>
                {record.findings ? (
                  <p className="text-sm">{record.findings}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No findings recorded.</p>
                )}
              </div>
            </div>

            {/* Parts replaced */}
            {record.partsReplaced.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Parts Replaced
                </p>
                <div className="flex flex-wrap gap-2">
                  {record.partsReplaced.map((part, i) => (
                    <Badge key={i} variant="secondary" className="font-normal">
                      {part}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5" />
                  {record.engineer.name}
                </span>
                {record.serviceTime !== null && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {record.serviceTime}h
                  </span>
                )}
                {record.serviceOrder && (
                  <span className="flex items-center gap-1.5 font-mono text-xs">
                    OS: {record.serviceOrder.orderNumber.slice(0, 8)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Package className="size-3.5" />
                {record.equipment.department}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ── HistoryContent ────────────────────────────────────────────────────────────

export function HistoryContent({
  history,
  engineers,
}: {
  history: ServiceHistoryWithRelations[]
  engineers: { id: string; name: string }[]
}) {
  const [search, setSearch] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [engineerFilter, setEngineerFilter] = React.useState('all')
  const [equipmentFilter, setEquipmentFilter] = React.useState('all')

  // Equipos únicos para el filtro
  const uniqueEquipment = React.useMemo(() => {
    const map = new Map<string, string>()
    history.forEach((r) => {
      map.set(r.equipment.id, r.equipment.equipmentModel.name)
    })
    return Array.from(map.entries())
  }, [history])

  const filtered = history.filter((record) => {
    if (typeFilter !== 'all' && record.type !== typeFilter) return false
    if (engineerFilter !== 'all' && record.engineer.id !== engineerFilter) return false
    if (equipmentFilter !== 'all' && record.equipment.id !== equipmentFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        record.equipment.equipmentModel.name.toLowerCase().includes(q) ||
        record.summary.toLowerCase().includes(q) ||
        record.engineer.name.toLowerCase().includes(q) ||
        (record.findings ?? '').toLowerCase().includes(q) ||
        record.equipment.serialNumber.toLowerCase().includes(q)
      )
    }
    return true
  })

  // ── Stats ──
  const stats = {
    total: history.length,
    corrective: history.filter((r) => r.type === 'CORRECTIVE_MAINTENANCE').length,
    preventive: history.filter((r) => r.type === 'PREVENTIVE_MAINTENANCE').length,
    calibration: history.filter((r) => r.type === 'CALIBRATION').length,
  }

  const avgServiceTime = React.useMemo(() => {
    const withTime = history.filter((r) => r.serviceTime !== null)
    if (withTime.length === 0) return 0
    const total = withTime.reduce((sum, r) => sum + (r.serviceTime ?? 0), 0)
    return (total / withTime.length).toFixed(1)
  }, [history])

  // ── Recurring Issues — equipos con 2+ registros correctivos ──
  const recurringIssues = React.useMemo(() => {
    const correctiveByEquipment = new Map<
      string,
      { name: string; serial: string; records: ServiceHistoryWithRelations[] }
    >()
    history
      .filter((r) => r.type === 'CORRECTIVE_MAINTENANCE')
      .forEach((r) => {
        const key = r.equipment.id
        const existing = correctiveByEquipment.get(key)
        if (existing) {
          existing.records.push(r)
        } else {
          correctiveByEquipment.set(key, {
            name: r.equipment.equipmentModel.name,
            serial: r.equipment.serialNumber,
            records: [r],
          })
        }
      })
    return Array.from(correctiveByEquipment.values())
      .filter((e) => e.records.length >= 2)
      .sort((a, b) => b.records.length - a.records.length)
  }, [history])

  // ── Analytics — stats por ingeniero ──
  const engineerAnalytics = React.useMemo(() => {
    const map = new Map<
      string,
      { name: string; count: number; totalTime: number; withTime: number }
    >()
    history.forEach((r) => {
      const key = r.engineer.id
      const existing = map.get(key)
      if (existing) {
        existing.count++
        if (r.serviceTime !== null) {
          existing.totalTime += r.serviceTime
          existing.withTime++
        }
      } else {
        map.set(key, {
          name: r.engineer.name,
          count: 1,
          totalTime: r.serviceTime ?? 0,
          withTime: r.serviceTime !== null ? 1 : 0,
        })
      }
    })
    return Array.from(map.values())
      .map((e) => ({
        name: e.name,
        services: e.count,
        avgTime: e.withTime > 0 ? (e.totalTime / e.withTime).toFixed(1) : '—',
      }))
      .sort((a, b) => b.services - a.services)
  }, [history])

  // ── Service type distribution ──
  const distribution = React.useMemo(() => {
    if (history.length === 0) return []
    const counts: Record<string, number> = {}
    history.forEach((r) => { counts[r.type] = (counts[r.type] ?? 0) + 1 })
    return Object.entries(counts)
      .map(([type, count]) => ({
        type,
        label: typeLabels[type as HistoryType] ?? type,
        count,
        pct: Math.round((count / history.length) * 100),
      }))
      .sort((a, b) => b.count - a.count)
  }, [history])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Technical History
          </h1>
          <p className="text-muted-foreground">
            Complete service records and technical analysis across all equipment.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 size-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <History className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Wrench className="size-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{stats.corrective}</p>
                <p className="text-xs text-muted-foreground">Corrective</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <ShieldCheck className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{stats.preventive}</p>
                <p className="text-xs text-muted-foreground">Preventive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <Clock className="size-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{avgServiceTime}h</p>
                <p className="text-xs text-muted-foreground">Avg Service Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">
            Timeline ({history.length})
          </TabsTrigger>
          <TabsTrigger value="recurring">
            Recurring Issues
            {recurringIssues.length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {recurringIssues.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ── Tab: Timeline ── */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by equipment, engineer, findings..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="PREVENTIVE_MAINTENANCE">Preventive</SelectItem>
                    <SelectItem value="CORRECTIVE_MAINTENANCE">Corrective</SelectItem>
                    <SelectItem value="CALIBRATION">Calibration</SelectItem>
                    <SelectItem value="INSPECTION">Inspection</SelectItem>
                    <SelectItem value="INSTALLATION">Installation</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={engineerFilter} onValueChange={setEngineerFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Engineer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Engineers</SelectItem>
                    {engineers.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Equipment</SelectItem>
                    {uniqueEquipment.map(([id, name]) => (
                      <SelectItem key={id} value={id}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <History className="mx-auto mb-3 size-8 text-muted-foreground" />
              <p className="text-sm font-medium">No records found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {search || typeFilter !== 'all' || engineerFilter !== 'all' || equipmentFilter !== 'all'
                  ? 'Try adjusting your filters.'
                  : 'Service history will appear here once engineers submit reports.'}
              </p>
            </div>
          ) : (
            <div>
              <p className="mb-3 text-sm text-muted-foreground">
                Showing {filtered.length} of {history.length} records
              </p>
              {filtered.map((record) => (
                <HistoryDetailCard key={record.id} record={record} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Tab: Recurring Issues ── */}
        <TabsContent value="recurring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <AlertTriangle className="size-5 text-warning" />
                Recurring Issues Analysis
              </CardTitle>
              <CardDescription>
                Equipment with 2 or more corrective maintenance records.
                These units may require deeper investigation or replacement planning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recurringIssues.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <CheckCircle2 className="mx-auto mb-3 size-8 text-success" />
                  <p className="text-sm font-medium">No recurring issues detected</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All equipment has fewer than 2 corrective maintenance records.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recurringIssues.map((issue) => (
                    <Card key={issue.serial}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{issue.name}</h4>
                              <span className="font-mono text-xs text-muted-foreground">
                                {issue.serial}
                              </span>
                              <Badge variant="destructive" className="text-xs">
                                {issue.records.length} corrective records
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              {issue.records.slice(0, 3).map((r) => (
                                <p key={r.id} className="text-sm text-muted-foreground">
                                  · {r.date.toLocaleDateString('en-US')} — {r.summary}
                                </p>
                              ))}
                              {issue.records.length > 3 && (
                                <p className="text-xs text-muted-foreground">
                                  +{issue.records.length - 3} more records
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 rounded-lg border border-warning/20 bg-warning/5 p-3">
                          <p className="text-sm">
                            <strong>Recommendation:</strong> Review corrective records for root cause patterns.
                            Consider scheduling a comprehensive inspection or planning unit replacement.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Analytics ── */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Engineer Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Engineer Performance</CardTitle>
                <CardDescription>Service statistics by engineer</CardDescription>
              </CardHeader>
              <CardContent>
                {engineerAnalytics.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data available.</p>
                ) : (
                  <div className="space-y-4">
                    {engineerAnalytics.map((eng) => (
                      <div
                        key={eng.name}
                        className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {initials(eng.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{eng.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {eng.services} service{eng.services !== 1 ? 's' : ''} ·
                              Avg: {eng.avgTime === '—' ? '—' : `${eng.avgTime}h`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold tabular-nums">{eng.services}</p>
                          <p className="text-xs text-muted-foreground">records</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Service Distribution</CardTitle>
                <CardDescription>Breakdown by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {distribution.map((item) => (
                    <div key={item.type} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="font-medium tabular-nums">
                          {item.pct}% ({item.count})
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-semibold tabular-nums">{avgServiceTime}h</p>
                    <p className="text-xs text-muted-foreground">Avg Service Time</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold tabular-nums">{history.length}</p>
                    <p className="text-xs text-muted-foreground">Total Records</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}