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
  Wrench,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

// Mock data for today's services
const todayServices = [
  {
    id: 'OS-2024-001',
    equipment: 'Ventilator V-2847',
    equipmentId: 'EQ-001',
    hospital: 'Central Hospital',
    area: 'ICU',
    type: 'Corrective',
    priority: 'high',
    status: 'in-progress',
    scheduledTime: '09:00 AM',
    description: 'Oxygen sensor calibration error E-101',
  },
  {
    id: 'OS-2024-002',
    equipment: 'CT Scanner CT-4521',
    equipmentId: 'EQ-005',
    hospital: 'Central Hospital',
    area: 'Radiology',
    type: 'Preventive',
    priority: 'medium',
    status: 'pending',
    scheduledTime: '11:30 AM',
    description: 'Quarterly preventive maintenance',
  },
  {
    id: 'OS-2024-003',
    equipment: 'Defibrillator D-0892',
    equipmentId: 'EQ-004',
    hospital: 'Emergency Center',
    area: 'Emergency',
    type: 'Corrective',
    priority: 'critical',
    status: 'pending',
    scheduledTime: '02:00 PM',
    description: 'Battery not charging - urgent repair needed',
  },
]

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

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'critical':
      return 'bg-destructive text-destructive-foreground'
    case 'high':
      return 'bg-warning text-warning-foreground'
    case 'medium':
      return 'bg-secondary text-secondary-foreground'
    case 'low':
      return 'bg-muted text-muted-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="size-4 text-success" />
    case 'in-progress':
      return <Play className="size-4 text-primary" />
    default:
      return <Clock className="size-4 text-muted-foreground" />
  }
}

export function EngineerDashboard() {
  const [isOnline, setIsOnline] = React.useState(true)
  
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
          <div className="flex gap-2 overflow-x-auto pb-2">
            {weeklySchedule.map((day) => (
              <div
                key={day.day}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center p-3 rounded-lg min-w-[64px] transition-colors',
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
            <Link 
              key={service.id} 
              href={`/equipment/${service.equipmentId}`}
            >
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1">
                      {getStatusIcon(service.status)}
                      <span className="text-xs text-muted-foreground">
                        {service.scheduledTime}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{service.equipment}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {service.type}
                            </Badge>
                            <Badge className={cn('text-xs', getPriorityColor(service.priority))}>
                              {service.priority}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="size-5 text-muted-foreground flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <MapPin className="size-3" />
                        <span className="truncate">
                          {service.hospital} - {service.area}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
    </div>
  )
}
