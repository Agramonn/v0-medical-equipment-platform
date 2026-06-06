'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  Package,
  TrendingDown,
  TrendingUp,
  Wrench,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const stats = [
  {
    title: 'Active Equipment',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Package,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Out of Service',
    value: '23',
    change: '-8.3%',
    trend: 'down',
    icon: XCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    title: 'Pending Services',
    value: '156',
    change: '+3.2%',
    trend: 'up',
    icon: Clock,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    title: 'Completed Today',
    value: '42',
    change: '+18.7%',
    trend: 'up',
    icon: CheckCircle2,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
]

const serviceData = [
  { month: 'Jan', preventive: 120, corrective: 45 },
  { month: 'Feb', preventive: 140, corrective: 38 },
  { month: 'Mar', preventive: 135, corrective: 52 },
  { month: 'Apr', preventive: 155, corrective: 41 },
  { month: 'May', preventive: 148, corrective: 36 },
  { month: 'Jun', preventive: 162, corrective: 48 },
]

const equipmentByArea = [
  { area: 'ICU', count: 342 },
  { area: 'Surgery', count: 289 },
  { area: 'Radiology', count: 198 },
  { area: 'Laboratory', count: 156 },
  { area: 'Emergency', count: 234 },
  { area: 'Cardiology', count: 187 },
]

const recentActivity = [
  {
    id: 1,
    type: 'service',
    title: 'Preventive maintenance completed',
    equipment: 'Ventilator V-2847',
    hospital: 'Central Hospital',
    time: '15 min ago',
    status: 'completed',
  },
  {
    id: 2,
    type: 'alert',
    title: 'Critical alert triggered',
    equipment: 'MRI Scanner M-1204',
    hospital: 'Regional Medical Center',
    time: '32 min ago',
    status: 'critical',
  },
  {
    id: 3,
    type: 'order',
    title: 'Service order created',
    equipment: 'Ultrasound U-3421',
    hospital: 'City Clinic',
    time: '1 hour ago',
    status: 'pending',
  },
  {
    id: 4,
    type: 'service',
    title: 'Corrective repair finished',
    equipment: 'Defibrillator D-0892',
    hospital: 'Emergency Center',
    time: '2 hours ago',
    status: 'completed',
  },
  {
    id: 5,
    type: 'alert',
    title: 'Maintenance due reminder',
    equipment: 'X-Ray Machine X-1567',
    hospital: 'Central Hospital',
    time: '3 hours ago',
    status: 'warning',
  },
]

const upcomingMaintenance = [
  {
    id: 1,
    equipment: 'CT Scanner CT-4521',
    type: 'Preventive',
    dueDate: 'Tomorrow',
    hospital: 'Central Hospital',
    priority: 'high',
  },
  {
    id: 2,
    equipment: 'Anesthesia Machine A-2134',
    type: 'Calibration',
    dueDate: 'In 2 days',
    hospital: 'Regional Medical Center',
    priority: 'medium',
  },
  {
    id: 3,
    equipment: 'Patient Monitor PM-8976',
    type: 'Preventive',
    dueDate: 'In 3 days',
    hospital: 'City Clinic',
    priority: 'low',
  },
  {
    id: 4,
    equipment: 'Infusion Pump IP-3421',
    type: 'Safety Check',
    dueDate: 'In 4 days',
    hospital: 'Emergency Center',
    priority: 'medium',
  },
]

const criticalTickets = [
  {
    id: 'TKT-2847',
    equipment: 'Ventilator V-1234',
    issue: 'Oxygen sensor malfunction',
    hospital: 'Central Hospital',
    created: '2 hours ago',
    assignee: 'John Doe',
  },
  {
    id: 'TKT-2848',
    equipment: 'MRI Scanner M-5678',
    issue: 'Cooling system failure',
    hospital: 'Regional Medical Center',
    created: '4 hours ago',
    assignee: 'Jane Smith',
  },
  {
    id: 'TKT-2849',
    equipment: 'Defibrillator D-9012',
    issue: 'Battery not charging',
    hospital: 'Emergency Center',
    created: '6 hours ago',
    assignee: 'Mike Johnson',
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-success/10 text-success'
    case 'critical':
      return 'bg-destructive/10 text-destructive'
    case 'pending':
      return 'bg-warning/10 text-warning'
    case 'warning':
      return 'bg-warning/10 text-warning'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-destructive text-destructive-foreground'
    case 'medium':
      return 'bg-warning text-warning-foreground'
    case 'low':
      return 'bg-success text-success-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'service':
      return Wrench
    case 'alert':
      return AlertTriangle
    case 'order':
      return FileText
    default:
      return Activity
  }
}

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your biomedical equipment and service operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="group relative overflow-hidden transition-colors hover:border-primary/40"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div
                  className={`rounded-lg p-2 ${stat.bgColor} ring-1 ring-inset ring-border/50`}
                >
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    stat.trend === 'up'
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <TrendingUp className="size-3.5" />
                  ) : (
                    <TrendingDown className="size-3.5" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-semibold tracking-tight tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Service Trends */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-medium">Service Trends</CardTitle>
            <CardDescription>
              Preventive vs Corrective maintenance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={serviceData}>
                  <defs>
                    <linearGradient id="preventive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="corrective" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    tickLine={{ stroke: 'currentColor' }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    tickLine={{ stroke: 'currentColor' }}
                  />
                  <Tooltip
                    cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px oklch(0 0 0 / 0.15)',
                    }}
                    labelStyle={{ color: 'var(--foreground)', fontWeight: 500 }}
                    itemStyle={{ color: 'var(--muted-foreground)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="preventive"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    fill="url(#preventive)"
                    name="Preventive"
                  />
                  <Area
                    type="monotone"
                    dataKey="corrective"
                    stroke="var(--chart-4)"
                    strokeWidth={2}
                    fill="url(#corrective)"
                    name="Corrective"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Equipment by Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-medium">Equipment by Area</CardTitle>
            <CardDescription>Distribution across hospital areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={equipmentByArea} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" className="text-xs" tick={{ fill: 'currentColor' }} />
                  <YAxis
                    dataKey="area"
                    type="category"
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px oklch(0 0 0 / 0.15)',
                    }}
                    labelStyle={{ color: 'var(--foreground)', fontWeight: 500 }}
                    itemStyle={{ color: 'var(--muted-foreground)' }}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--chart-1)"
                    radius={[0, 4, 4, 0]}
                    name="Equipment"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/history">
                View all
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`rounded-lg p-2 ${getStatusColor(activity.status)}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.equipment} • {activity.hospital}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Maintenance */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium">Upcoming Maintenance</CardTitle>
              <CardDescription>Scheduled preventive services</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/service-orders">
                View all
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMaintenance.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <CalendarClock className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {item.equipment}
                      </p>
                      <Badge
                        variant="secondary"
                        className={getPriorityColor(item.priority)}
                      >
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.type} • {item.hospital}
                    </p>
                    <p className="text-xs font-medium text-primary">
                      {item.dueDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical Tickets */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium">Critical Tickets</CardTitle>
              <CardDescription>Issues requiring immediate attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/service-orders">
                View all
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-start gap-3">
                  <div className="rounded-lg bg-destructive/10 p-2">
                    <AlertTriangle className="size-4 text-destructive" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {ticket.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.created}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {ticket.equipment}
                    </p>
                    <p className="text-xs text-destructive">
                      {ticket.issue}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Assigned to {ticket.assignee}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Contract Status Overview</CardTitle>
          <CardDescription>
            Active service contracts and their utilization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Central Hospital</span>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">
                342 of 438 equipment covered
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Regional Medical Center</span>
                <span className="text-sm text-muted-foreground">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">
                567 of 616 equipment covered
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">City Clinic</span>
                <span className="text-sm text-muted-foreground">65%</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground">
                189 of 291 equipment covered
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Emergency Center</span>
                <span className="text-sm text-muted-foreground">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">
                234 of 275 equipment covered
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
