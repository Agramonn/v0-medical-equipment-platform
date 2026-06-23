'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  MapPin,
  MessageSquareText,
  Package,
  Play,
  QrCode,
  Wifi,
  WifiOff,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { serviceOrders, type ServiceOrder } from '@/lib/service-order-data'
import { EngineerServicePanel } from './engineer-service-panel'

// TEMP: local badges for the legacy mock model (lib/service-order-data.ts).
// TODO: remove these once engineer-dashboard.tsx is connected to real data
// and can use the shared badges from service-order-badges.tsx.
function MockTypeBadge({ type }: { type: ServiceOrder['type'] }) {
  return <Badge variant="outline">{type}</Badge>
}

function MockPriorityBadge({ priority }: { priority: ServiceOrder['priority'] }) {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>
    case 'high':
      return <Badge className="bg-warning text-warning-foreground">High</Badge>
    case 'medium':
      return <Badge variant="secondary">Medium</Badge>
    default:
      return <Badge variant="outline">Low</Badge>
  }
}

function MockStatusBadge({ status }: { status: ServiceOrder['status'] }) {
  const labels: Record<ServiceOrder['status'], string> = {
    draft: 'Draft',
    assigned: 'Assigned',
    'in-progress': 'In Progress',
    'pending-parts': 'Pending Parts',
    'pending-customer': 'Pending Customer',
    completed: 'Completed',
    'pending-signature': 'Pending Signature',
    closed: 'Closed',
  }
  return <Badge variant="secondary">{labels[status]}</Badge>
}

// Today's services: orders assigned to the signed-in engineer that are still
// in an actionable state (sourced from the shared Service Order model).
const CURRENT_ENGINEER = 'John Doe'

const scheduledTimes: Record<string, string> = {
  'OS-2024-001': '09:00 AM',
  'OS-2024-004': '11:30 AM',
  'OS-2024-007': '02:00 PM',
}

const todayServices = serviceOrders.filter(
  (o) =>
    o.assignedEngineer === CURRENT_ENGINEER &&
    o.status !== 'closed',
)

const weeklySchedule = [
  { day: 'Mon', date: '26', services: 3, completed: 3 },
  { day: 'Tue', date: '27', services: 5, completed: 2, isToday: true },
  { day: 'Wed', date: '28', services: 4, completed: 0 },
  { day: 'Thu', date: '29', services: 2, completed: 0 },
  { day: 'Fri', date: '01', services: 6, completed: 0 },
]

const hospitals = [
  { name: 'Central Hospital', services: 8, equipment: 342 },
  { name: 'Regional Medical Center', services: 5, equipment: 567 },
  { name: 'Emergency Center', services: 3, equipment: 275 },
  { name: 'City Clinic', services: 2, equipment: 189 },
]

const quickActions = [
  { icon: QrCode, label: 'Scan QR', href: '/scan' },
  { icon: MessageSquareText, label: 'AI Chat', href: '/chat' },
  { icon: Package, label: 'Equipment', href: '/inventory' },
  { icon: Download, label: 'Offline', href: '/offline' },
]

function getStatusIcon(status: ServiceOrder['status']) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="size-4 text-success" />
    case 'in-progress':
      return <Play className="size-4 text-primary" />
    case 'pending-parts':
    case 'pending-customer':
      return <Clock className="size-4 text-warning" />
    default:
      return <Clock className="size-4 text-muted-foreground" />
  }
}

export function EngineerDashboard() {
  const [isOnline, setIsOnline] = React.useState(true)
  const [activeOrder, setActiveOrder] = React.useState<ServiceOrder | null>(null)
  const [panelOpen, setPanelOpen] = React.useState(false)

  function openPanel(order: ServiceOrder) {
    setActiveOrder(order)
    setPanelOpen(true)
  }

  // Simulate online/offline status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const completedToday = todayServices.filter(s => s.status === 'completed').length
  const totalToday = todayServices.length
  const progressPercent = (completedToday / totalToday) * 100

  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">My Services</h1>
          <p className="text-muted-foreground">
            Tuesday, February 27, 2024
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={isOnline ? 'default' : 'destructive'}
            className="flex items-center gap-1.5"
          >
            {isOnline ? (
              <>
                <Wifi className="size-3" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="size-3" />
                Offline
              </>
            )}
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Sync Data
          </Button>
        </div>
      </div>

      {/* Progress Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Today&apos;s Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedToday} of {totalToday} services
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Quick Actions - Mobile Optimized */}
      <div className="grid grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href}>
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <action.icon className="size-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-center">{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">This Week</CardTitle>
            <Link href="/engineer/calendar">
              <Button variant="ghost" size="sm">
                View Calendar
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible">
            {weeklySchedule.map((day) => (
              <div
                key={day.day}
                className={cn(
                  'flex flex-shrink-0 min-w-[64px] flex-col items-center rounded-lg p-3 transition-colors sm:min-w-0',
                  day.isToday
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 hover:bg-muted'
                )}
              >
                <span className={cn(
                  'text-xs font-medium',
                  !day.isToday && 'text-muted-foreground'
                )}>
                  {day.day}
                </span>
                <span className={cn(
                  'text-lg font-semibold',
                  !day.isToday && 'text-foreground'
                )}>
                  {day.date}
                </span>
                <div className={cn(
                  'flex items-center gap-1 text-xs mt-1',
                  day.isToday ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}>
                  <span>{day.services}</span>
                  {day.completed > 0 && (
                    <span className="text-success">({day.completed})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Services */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Today&apos;s Services</h2>
        <div className="space-y-3">
          {todayServices.map((service) => (
            <Card
              key={service.id}
              className="hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => openPanel(service)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1">
                    {getStatusIcon(service.status)}
                    <span className="text-xs text-muted-foreground">
                      {scheduledTimes[service.id] ?? service.scheduledDate}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{service.equipment.name}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <MockTypeBadge type={service.type} />
                          <MockPriorityBadge priority={service.priority} />
                          <MockStatusBadge status={service.status} />
                        </div>
                      </div>
                      <ChevronRight className="size-5 text-muted-foreground flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="size-3" />
                      <span className="truncate">
                        {service.equipment.hospital} - {service.equipment.department}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {service.scope.objectives || service.type}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Hospitals List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">My Hospitals</CardTitle>
          <CardDescription>Assigned locations and pending work</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hospitals.map((hospital, index) => (
              <React.Fragment key={hospital.name}>
                <Link href={`/hospitals/${encodeURIComponent(hospital.name)}`}>
                  <div className="flex items-center justify-between py-2 hover:bg-accent/50 -mx-2 px-2 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <MapPin className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{hospital.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {hospital.equipment} equipment
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{hospital.services} services</Badge>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
                {index < hospitals.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      <EngineerServicePanel
        order={activeOrder}
        open={panelOpen}
        onOpenChange={setPanelOpen}
      />
    </div>
  )
}
