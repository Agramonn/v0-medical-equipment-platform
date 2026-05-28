'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Play,
  Wrench,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

// Mock calendar data
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const generateWeekData = (weekOffset: number = 0) => {
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() + (weekOffset * 7))
  
  // Get Monday of the current week
  const dayOfWeek = baseDate.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(baseDate)
  monday.setDate(baseDate.getDate() + mondayOffset)
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return {
      day: weekDays[i],
      date: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      fullDate: date,
      isToday: date.toDateString() === new Date().toDateString(),
      isWeekend: i >= 5,
    }
  })
}

const servicesData: Record<string, typeof mockServices> = {
  '26': [
    {
      id: 'OS-2024-010',
      equipment: 'MRI Scanner M-1204',
      equipmentId: 'EQ-002',
      hospital: 'Regional Medical Center',
      area: 'Radiology',
      type: 'Preventive',
      priority: 'medium',
      status: 'completed',
      time: '09:00 AM',
    },
    {
      id: 'OS-2024-011',
      equipment: 'Ultrasound U-3421',
      equipmentId: 'EQ-003',
      hospital: 'Regional Medical Center',
      area: 'Cardiology',
      type: 'Preventive',
      priority: 'low',
      status: 'completed',
      time: '11:00 AM',
    },
    {
      id: 'OS-2024-012',
      equipment: 'ECG Machine ECG-5632',
      equipmentId: 'EQ-010',
      hospital: 'Regional Medical Center',
      area: 'Cardiology',
      type: 'Corrective',
      priority: 'medium',
      status: 'completed',
      time: '02:00 PM',
    },
  ],
  '27': [
    {
      id: 'OS-2024-001',
      equipment: 'Ventilator V-2847',
      equipmentId: 'EQ-001',
      hospital: 'Central Hospital',
      area: 'ICU',
      type: 'Corrective',
      priority: 'high',
      status: 'in-progress',
      time: '09:00 AM',
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
      time: '11:30 AM',
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
      time: '02:00 PM',
    },
    {
      id: 'OS-2024-013',
      equipment: 'X-Ray Machine X-1567',
      equipmentId: 'EQ-009',
      hospital: 'Central Hospital',
      area: 'Radiology',
      type: 'Preventive',
      priority: 'low',
      status: 'pending',
      time: '04:00 PM',
    },
    {
      id: 'OS-2024-014',
      equipment: 'Patient Monitor PM-8976',
      equipmentId: 'EQ-007',
      hospital: 'City Clinic',
      area: 'ICU',
      type: 'Corrective',
      priority: 'high',
      status: 'pending',
      time: '05:30 PM',
    },
  ],
  '28': [
    {
      id: 'OS-2024-015',
      equipment: 'Anesthesia Machine A-2134',
      equipmentId: 'EQ-006',
      hospital: 'Regional Medical Center',
      area: 'Surgery',
      type: 'Preventive',
      priority: 'medium',
      status: 'pending',
      time: '08:00 AM',
    },
    {
      id: 'OS-2024-016',
      equipment: 'Infusion Pump IP-3421',
      equipmentId: 'EQ-008',
      hospital: 'Emergency Center',
      area: 'Emergency',
      type: 'Preventive',
      priority: 'low',
      status: 'pending',
      time: '10:00 AM',
    },
    {
      id: 'OS-2024-017',
      equipment: 'MRI Scanner M-1204',
      equipmentId: 'EQ-002',
      hospital: 'Regional Medical Center',
      area: 'Radiology',
      type: 'Corrective',
      priority: 'high',
      status: 'pending',
      time: '01:00 PM',
    },
    {
      id: 'OS-2024-018',
      equipment: 'Ventilator V-2848',
      equipmentId: 'EQ-011',
      hospital: 'Central Hospital',
      area: 'ICU',
      type: 'Preventive',
      priority: 'medium',
      status: 'pending',
      time: '03:30 PM',
    },
  ],
  '29': [
    {
      id: 'OS-2024-019',
      equipment: 'CT Scanner CT-4522',
      equipmentId: 'EQ-012',
      hospital: 'City Clinic',
      area: 'Radiology',
      type: 'Preventive',
      priority: 'medium',
      status: 'pending',
      time: '09:00 AM',
    },
    {
      id: 'OS-2024-020',
      equipment: 'Defibrillator D-0893',
      equipmentId: 'EQ-013',
      hospital: 'Emergency Center',
      area: 'Emergency',
      type: 'Corrective',
      priority: 'critical',
      status: 'pending',
      time: '02:00 PM',
    },
  ],
  '1': [
    {
      id: 'OS-2024-021',
      equipment: 'Ultrasound U-3422',
      equipmentId: 'EQ-014',
      hospital: 'Central Hospital',
      area: 'Cardiology',
      type: 'Preventive',
      priority: 'low',
      status: 'pending',
      time: '08:30 AM',
    },
    {
      id: 'OS-2024-022',
      equipment: 'Patient Monitor PM-8977',
      equipmentId: 'EQ-015',
      hospital: 'Regional Medical Center',
      area: 'ICU',
      type: 'Corrective',
      priority: 'high',
      status: 'pending',
      time: '10:00 AM',
    },
    {
      id: 'OS-2024-023',
      equipment: 'X-Ray Machine X-1568',
      equipmentId: 'EQ-016',
      hospital: 'City Clinic',
      area: 'Radiology',
      type: 'Preventive',
      priority: 'medium',
      status: 'pending',
      time: '11:30 AM',
    },
    {
      id: 'OS-2024-024',
      equipment: 'ECG Machine ECG-5633',
      equipmentId: 'EQ-017',
      hospital: 'Emergency Center',
      area: 'Cardiology',
      type: 'Preventive',
      priority: 'low',
      status: 'pending',
      time: '01:00 PM',
    },
    {
      id: 'OS-2024-025',
      equipment: 'Infusion Pump IP-3422',
      equipmentId: 'EQ-018',
      hospital: 'Central Hospital',
      area: 'Emergency',
      type: 'Corrective',
      priority: 'medium',
      status: 'pending',
      time: '03:00 PM',
    },
    {
      id: 'OS-2024-026',
      equipment: 'Anesthesia Machine A-2135',
      equipmentId: 'EQ-019',
      hospital: 'Regional Medical Center',
      area: 'Surgery',
      type: 'Preventive',
      priority: 'high',
      status: 'pending',
      time: '04:30 PM',
    },
  ],
}

const mockServices = servicesData['27'] || []

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
      return <CheckCircle2 className="size-3 text-success" />
    case 'in-progress':
      return <Play className="size-3 text-primary" />
    default:
      return <Clock className="size-3 text-muted-foreground" />
  }
}

export function EngineerCalendar() {
  const [weekOffset, setWeekOffset] = React.useState(0)
  const [selectedDate, setSelectedDate] = React.useState<string>('27')
  
  const weekData = generateWeekData(weekOffset)
  const selectedServices = servicesData[selectedDate] || []

  const weekStart = weekData[0]
  const weekEnd = weekData[6]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/engineer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Weekly Calendar</h1>
            <p className="text-muted-foreground">
              {weekStart.month} {weekStart.date} - {weekEnd.month} {weekEnd.date}, 2024
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setWeekOffset(prev => prev - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button 
            variant="outline"
            onClick={() => setWeekOffset(0)}
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setWeekOffset(prev => prev + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Week View */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {weekData.map((day) => {
              const dayServices = servicesData[String(day.date)] || []
              const completedCount = dayServices.filter(s => s.status === 'completed').length
              const isSelected = String(day.date) === selectedDate
              
              return (
                <button
                  key={day.day}
                  onClick={() => setSelectedDate(String(day.date))}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-lg transition-colors',
                    day.isToday && 'ring-2 ring-primary',
                    isSelected && 'bg-primary text-primary-foreground',
                    !isSelected && !day.isWeekend && 'hover:bg-muted',
                    !isSelected && day.isWeekend && 'bg-muted/50 hover:bg-muted',
                  )}
                >
                  <span className={cn(
                    'text-xs font-medium',
                    !isSelected && 'text-muted-foreground'
                  )}>
                    {day.day}
                  </span>
                  <span className={cn(
                    'text-2xl font-semibold my-1',
                    !isSelected && 'text-foreground'
                  )}>
                    {day.date}
                  </span>
                  {dayServices.length > 0 && (
                    <div className={cn(
                      'flex items-center gap-1 text-xs',
                      isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    )}>
                      <span>{dayServices.length} tasks</span>
                      {completedCount > 0 && (
                        <CheckCircle2 className={cn(
                          'size-3',
                          isSelected ? 'text-primary-foreground' : 'text-success'
                        )} />
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Schedule */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {selectedServices.length > 0 
              ? `${selectedServices.length} Services Scheduled`
              : 'No Services Scheduled'
            }
          </h2>
          {selectedServices.length > 0 && (
            <Badge variant="secondary">
              {selectedServices.filter(s => s.status === 'completed').length} completed
            </Badge>
          )}
        </div>

        {selectedServices.length > 0 ? (
          <div className="space-y-3">
            {selectedServices.map((service) => (
              <Link 
                key={service.id}
                href={`/equipment/${service.equipmentId}`}
              >
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1 min-w-[60px]">
                        {getStatusIcon(service.status)}
                        <span className="text-xs font-medium">{service.time}</span>
                      </div>
                      <Separator orientation="vertical" className="h-auto self-stretch" />
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarIcon className="size-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No services scheduled for this day</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Weekly Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Weekly Summary</CardTitle>
          <CardDescription>Overview of your scheduled services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-semibold">
                {Object.values(servicesData).flat().length}
              </p>
              <p className="text-sm text-muted-foreground">Total Services</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-semibold text-success">
                {Object.values(servicesData).flat().filter(s => s.status === 'completed').length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-semibold text-warning">
                {Object.values(servicesData).flat().filter(s => s.priority === 'critical' || s.priority === 'high').length}
              </p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-semibold">
                {new Set(Object.values(servicesData).flat().map(s => s.hospital)).size}
              </p>
              <p className="text-sm text-muted-foreground">Hospitals</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
