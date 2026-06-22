'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowLeft,
  BookOpen,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  Download,
  History,
  Info,
  Package,
  Wrench,
  Wifi,
  WifiOff,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

<<<<<<< HEAD
import { equipmentData, statusConfig, type EquipmentStatus } from '@/lib/equipment-data'
=======
import { statusConfig, type EquipmentStatus } from '@/lib/equipment-data'
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
import { GeneralInfoTab } from './tabs/general-info-tab'
import { ServiceTab } from './tabs/service-tab'
import { ChecklistTab } from './tabs/checklist-tab'
import { PartsTab } from './tabs/parts-tab'
import { ManualsTab } from './tabs/manuals-tab'
import { ChatTab } from './tabs/chat-tab'
import { HistoryTab } from './tabs/history-tab'
<<<<<<< HEAD
=======
import { EquipmentWithDetails } from '@/lib/types'
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)

const tabs = [
  { value: 'general', label: 'General', Icon: Info, Component: GeneralInfoTab },
  { value: 'service', label: 'Service', Icon: Wrench, Component: ServiceTab },
  { value: 'checklist', label: 'Checklist', Icon: Clipboard, Component: ChecklistTab },
  { value: 'parts', label: 'Parts', Icon: Package, Component: PartsTab },
  { value: 'manuals', label: 'Manuals', Icon: BookOpen, Component: ManualsTab },
  { value: 'chat', label: 'AI Chat', Icon: Bot, Component: ChatTab },
  { value: 'history', label: 'Service History', Icon: History, Component: HistoryTab },
]

<<<<<<< HEAD
export function EquipmentWorkspace({ equipmentId }: { equipmentId: string }) {
  const [isOnline, setIsOnline] = React.useState(true)
  // Field engineers can change the equipment status.
  const [status, setStatus] = React.useState<EquipmentStatus>(equipmentData.status)
=======
export function EquipmentWorkspace({ equipment }: { equipment: EquipmentWithDetails }) {
  const [isOnline, setIsOnline] = React.useState(true)
  const [status, setStatus] = React.useState<EquipmentStatus>(equipment.status.toLowerCase().replace('_', '-') as EquipmentStatus)
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)

  React.useEffect(() => {
    setIsOnline(typeof navigator === 'undefined' ? true : navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const current = statusConfig[status]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/engineer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
<<<<<<< HEAD
              <h1 className="text-xl font-semibold">{equipmentData.name}</h1>
=======
              <h1 className="text-xl font-semibold">{equipment.name}</h1>
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
              {/* Status selector (Field Engineer can change it) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full"
                  >
                    <Badge className={current.className}>
                      <CheckCircle2 className="mr-1 size-3" />
                      {current.label}
                      <ChevronDown className="ml-1 size-3" />
                    </Badge>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Change status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={status}
                    onValueChange={(v) => setStatus(v as EquipmentStatus)}
                  >
                    {(Object.keys(statusConfig) as EquipmentStatus[]).map((key) => (
                      <DropdownMenuRadioItem key={key} value={key}>
                        {statusConfig[key].label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground">
<<<<<<< HEAD
              {equipmentData.manufacturer} {equipmentData.model} ·{' '}
              <span className="font-mono">{equipmentData.serialNumber}</span>
=======
              {equipment.manufacturer} {equipment.model} ·{' '}
              <span className="font-mono">{equipment.serialNumber}</span>
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={isOnline ? 'default' : 'destructive'}
            className="flex items-center gap-1"
          >
            {isOnline ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Equipment info bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Hospital:</span>
<<<<<<< HEAD
              <span className="font-medium">{equipmentData.hospital}</span>
=======
              <span className="font-medium">{equipment.organization.name}</span>
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Department:</span>
<<<<<<< HEAD
              <span className="font-medium">{equipmentData.department}</span>
=======
              <span className="font-medium">{equipment.department}</span>
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Contract:</span>
<<<<<<< HEAD
              <Badge variant="default">{equipmentData.contractType}</Badge>
=======
              <Badge variant="default">{equipment.contractType}</Badge>
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Next PM:</span>
<<<<<<< HEAD
              <span className="font-medium text-primary">{equipmentData.nextService}</span>
=======
              <span className="font-medium text-primary">{equipment.nextServiceDate?.toLocaleDateString() || 'N/A'}</span>
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Asset:</span>
<<<<<<< HEAD
              <span className="font-mono font-medium">{equipmentData.assetNumber}</span>
=======
              <span className="font-mono font-medium">{equipment.assetNumber}</span>
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {tabs.map(({ value, label, Icon }) => (
            <TabsTrigger key={value} value={value} className="flex items-center gap-2">
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(({ value, Component }) => (
          <TabsContent key={value} value={value} className="-mx-4 mt-4 sm:-mx-6 lg:-mx-8">
<<<<<<< HEAD
            <Component />
=======
            <Component equipment={equipment} />
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
