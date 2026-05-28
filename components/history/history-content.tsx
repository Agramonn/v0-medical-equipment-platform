'use client'

import * as React from 'react'
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  GitCompare,
  History,
  MessageSquare,
  MoreHorizontal,
  Package,
  Search,
  SlidersHorizontal,
  StickyNote,
  User,
  Wrench,
  XCircle,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Mock technical history data
const technicalHistory = [
  {
    id: 'TH-001',
    equipment: 'Ventilator V-2847',
    equipmentId: 'EQ-001',
    date: '2024-02-15',
    type: 'Corrective',
    engineer: 'John Doe',
    diagnosis: 'Oxygen sensor calibration drift beyond acceptable limits',
    verdict: 'Sensor replaced with new unit. Calibration completed successfully.',
    failureType: 'Sensor Degradation',
    partsReplaced: ['Oxygen Sensor (PHI-OS-2847)'],
    observations: 'Recommended monitoring sensor readings weekly for the next month.',
    serviceTime: '2.5 hours',
    isRecurring: true,
  },
  {
    id: 'TH-002',
    equipment: 'MRI Scanner M-1204',
    equipmentId: 'EQ-002',
    date: '2024-02-10',
    type: 'Preventive',
    engineer: 'Jane Smith',
    diagnosis: 'Quarterly preventive maintenance check',
    verdict: 'All systems operational. Minor adjustments made to cooling system.',
    failureType: null,
    partsReplaced: [],
    observations: 'Cooling system efficiency at 92%. Consider filter replacement in next PM.',
    serviceTime: '4 hours',
    isRecurring: false,
  },
  {
    id: 'TH-003',
    equipment: 'Defibrillator D-0892',
    equipmentId: 'EQ-004',
    date: '2024-02-08',
    type: 'Corrective',
    engineer: 'Mike Johnson',
    diagnosis: 'Battery not holding charge. Internal cell degradation detected.',
    verdict: 'Battery pack replaced. Full charge cycle completed and tested.',
    failureType: 'Battery Failure',
    partsReplaced: ['Battery Pack (ZOL-BP-892)', 'Charge Controller Board (ZOL-CCB-100)'],
    observations: 'Old battery was 3 years old. Recommend annual battery health checks.',
    serviceTime: '1.5 hours',
    isRecurring: false,
  },
  {
    id: 'TH-004',
    equipment: 'Ventilator V-2847',
    equipmentId: 'EQ-001',
    date: '2024-01-05',
    type: 'Corrective',
    engineer: 'Jane Smith',
    diagnosis: 'Flow sensor providing inconsistent readings',
    verdict: 'Sensor cleaned and recalibrated. Root cause: dust accumulation.',
    failureType: 'Sensor Contamination',
    partsReplaced: [],
    observations: 'Recommend implementing monthly cleaning schedule for airway sensors.',
    serviceTime: '1 hour',
    isRecurring: true,
  },
  {
    id: 'TH-005',
    equipment: 'CT Scanner CT-4521',
    equipmentId: 'EQ-005',
    date: '2024-01-20',
    type: 'Preventive',
    engineer: 'John Doe',
    diagnosis: 'Annual calibration and certification',
    verdict: 'All parameters within specification. Certification renewed.',
    failureType: null,
    partsReplaced: ['X-Ray Tube Filter (CAN-XTF-45)'],
    observations: 'Tube life at 78%. Plan replacement in 6-8 months.',
    serviceTime: '6 hours',
    isRecurring: false,
  },
]

const recurringIssues = [
  {
    equipment: 'Ventilator V-2847',
    issue: 'Sensor calibration drift',
    occurrences: 3,
    lastOccurrence: '2024-02-15',
    trend: 'increasing',
    recommendation: 'Consider sensor replacement or environmental review',
  },
  {
    equipment: 'Patient Monitor PM-8976',
    issue: 'Display flickering',
    occurrences: 2,
    lastOccurrence: '2024-01-28',
    trend: 'stable',
    recommendation: 'Monitor for LCD backlight failure',
  },
  {
    equipment: 'Infusion Pump IP-3421',
    issue: 'Flow rate inaccuracy',
    occurrences: 2,
    lastOccurrence: '2024-02-01',
    trend: 'stable',
    recommendation: 'Calibrate every 30 days',
  },
]

const engineerStats = [
  { name: 'John Doe', services: 45, avgTime: '2.3 hrs', satisfaction: 98 },
  { name: 'Jane Smith', services: 38, avgTime: '2.8 hrs', satisfaction: 96 },
  { name: 'Mike Johnson', services: 32, avgTime: '2.1 hrs', satisfaction: 97 },
]

function HistoryDetailCard({ record }: { record: typeof technicalHistory[0] }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-4">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'rounded-lg p-2',
                  record.type === 'Corrective' ? 'bg-warning/10' : 'bg-primary/10'
                )}>
                  <Wrench className={cn(
                    'size-5',
                    record.type === 'Corrective' ? 'text-warning' : 'text-primary'
                  )} />
                </div>
                <div className="text-left">
                  <CardTitle className="text-base flex items-center gap-2">
                    {record.equipment}
                    {record.isRecurring && (
                      <Badge variant="outline" className="text-warning border-warning">
                        <AlertTriangle className="mr-1 size-3" />
                        Recurring
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {record.id} • {record.date} • {record.type} Service
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={record.type === 'Corrective' ? 'secondary' : 'outline'}>
                  {record.type}
                </Badge>
                <ChevronDown className={cn(
                  'size-4 transition-transform',
                  isOpen && 'rotate-180'
                )} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <Separator />
            
            {/* Engineer Info */}
            <div className="flex items-center gap-4">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {record.engineer.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{record.engineer}</p>
                <p className="text-sm text-muted-foreground">
                  Service time: {record.serviceTime}
                </p>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Search className="size-4" />
                Diagnosis
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {record.diagnosis}
              </p>
            </div>

            {/* Technical Verdict */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Technical Verdict
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {record.verdict}
              </p>
            </div>

            {/* Failure Type */}
            {record.failureType && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Failure Type:</span>
                <Badge variant="destructive">{record.failureType}</Badge>
              </div>
            )}

            {/* Parts Replaced */}
            {record.partsReplaced.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Package className="size-4" />
                  Parts Replaced
                </h4>
                <div className="flex flex-wrap gap-2">
                  {record.partsReplaced.map((part, index) => (
                    <Badge key={index} variant="outline" className="font-mono">
                      {part}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Observations */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <StickyNote className="size-4" />
                Observations & Notes
              </h4>
              <p className="text-sm text-muted-foreground bg-warning/5 border border-warning/20 p-3 rounded-lg">
                {record.observations}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 size-4" />
                View Full Report
              </Button>
              <Button variant="outline" size="sm">
                <GitCompare className="mr-2 size-4" />
                Compare Similar
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

export function HistoryContent() {
  const [equipmentFilter, setEquipmentFilter] = React.useState<string>('all')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  const [engineerFilter, setEngineerFilter] = React.useState<string>('all')

  const filteredHistory = technicalHistory.filter((record) => {
    if (equipmentFilter !== 'all' && record.equipmentId !== equipmentFilter) return false
    if (typeFilter !== 'all' && record.type !== typeFilter) return false
    if (engineerFilter !== 'all' && record.engineer !== engineerFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Technical History</h1>
          <p className="text-muted-foreground">
            Complete service records, diagnoses, and technical verdicts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Export Records
          </Button>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Issues</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search history..." className="pl-9" />
                </div>
                <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Equipment</SelectItem>
                    <SelectItem value="EQ-001">Ventilator V-2847</SelectItem>
                    <SelectItem value="EQ-002">MRI Scanner M-1204</SelectItem>
                    <SelectItem value="EQ-004">Defibrillator D-0892</SelectItem>
                    <SelectItem value="EQ-005">CT Scanner CT-4521</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Corrective">Corrective</SelectItem>
                    <SelectItem value="Preventive">Preventive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={engineerFilter} onValueChange={setEngineerFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Engineer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Engineers</SelectItem>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="space-y-0">
            {filteredHistory.map((record) => (
              <HistoryDetailCard key={record.id} record={record} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recurring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <AlertTriangle className="size-5 text-warning" />
                Recurring Issues Analysis
              </CardTitle>
              <CardDescription>
                Equipment with repeated failures requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recurringIssues.map((issue, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{issue.equipment}</h4>
                            <Badge
                              variant={issue.trend === 'increasing' ? 'destructive' : 'secondary'}
                            >
                              {issue.trend === 'increasing' ? 'Trending Up' : 'Stable'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Issue: {issue.issue}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Occurrences: <strong>{issue.occurrences}</strong>
                            </span>
                            <span className="text-muted-foreground">
                              Last: <strong>{issue.lastOccurrence}</strong>
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 size-4" />
                          View Details
                        </Button>
                      </div>
                      <div className="mt-4 p-3 bg-warning/5 border border-warning/20 rounded-lg">
                        <p className="text-sm">
                          <strong>Recommendation:</strong> {issue.recommendation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Engineer Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Engineer Performance</CardTitle>
                <CardDescription>Service statistics by engineer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engineerStats.map((engineer) => (
                    <div key={engineer.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {engineer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{engineer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {engineer.services} services • Avg: {engineer.avgTime}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-success">{engineer.satisfaction}%</p>
                        <p className="text-xs text-muted-foreground">Satisfaction</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Service Distribution</CardTitle>
                <CardDescription>Breakdown by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-primary" />
                      <span className="text-sm">Preventive Maintenance</span>
                    </div>
                    <span className="font-medium">62%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-warning" />
                      <span className="text-sm">Corrective Repairs</span>
                    </div>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-success" />
                      <span className="text-sm">Calibrations</span>
                    </div>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-semibold">2.4h</p>
                    <p className="text-xs text-muted-foreground">Avg Service Time</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">97%</p>
                    <p className="text-xs text-muted-foreground">First-Time Fix Rate</p>
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
