'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Bot,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Clock,
  Download,
  FileText,
  History,
  Lightbulb,
  MessageSquare,
  Mic,
  Package,
  Paperclip,
  Play,
  Search,
  Send,
  Settings,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  User,
  Wifi,
  WifiOff,
  Wrench,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Mock equipment data
const equipmentData = {
  id: 'EQ-001',
  name: 'Ventilator V-2847',
  brand: 'Philips',
  model: 'Trilogy Evo',
  serialNumber: 'SN-2847-PHL-001',
  hospital: 'Central Hospital',
  area: 'ICU',
  contractType: 'Full Service',
  status: 'operational',
  lastMaintenance: '2024-01-15',
  nextMaintenance: '2024-04-15',
  hoursUsed: 8432,
  installDate: '2022-03-10',
}

const checklistItems = [
  {
    id: '1',
    category: 'Visual Inspection',
    items: [
      { id: '1.1', text: 'Check external housing for damage', completed: true },
      { id: '1.2', text: 'Verify all labels are legible', completed: true },
      { id: '1.3', text: 'Inspect power cord for damage', completed: false },
      { id: '1.4', text: 'Check filter condition', completed: false },
    ],
  },
  {
    id: '2',
    category: 'Functional Tests',
    items: [
      { id: '2.1', text: 'Power on/off test', completed: true },
      { id: '2.2', text: 'Self-test verification', completed: false },
      { id: '2.3', text: 'Alarm testing', completed: false },
      { id: '2.4', text: 'Oxygen sensor calibration', completed: false },
    ],
  },
  {
    id: '3',
    category: 'Performance Verification',
    items: [
      { id: '3.1', text: 'Verify tidal volume accuracy (±10%)', completed: false, expectedValue: '300-700 mL' },
      { id: '3.2', text: 'Check respiratory rate range', completed: false, expectedValue: '4-60 bpm' },
      { id: '3.3', text: 'Verify FiO2 accuracy', completed: false, expectedValue: '21-100%' },
      { id: '3.4', text: 'Pressure relief test', completed: false },
    ],
  },
]

const partsData = [
  { partNumber: 'PHI-OS-2847', name: 'Oxygen Sensor', stock: 12, criticality: 'high', lastReplaced: '2024-01-15' },
  { partNumber: 'PHI-FL-100', name: 'Air Filter', stock: 45, criticality: 'medium', lastReplaced: '2023-12-01' },
  { partNumber: 'PHI-BP-500', name: 'Battery Pack', stock: 8, criticality: 'high', lastReplaced: '2023-06-20' },
  { partNumber: 'PHI-TU-200', name: 'Tubing Set', stock: 100, criticality: 'low', lastReplaced: '2024-02-01' },
  { partNumber: 'PHI-FS-300', name: 'Flow Sensor', stock: 15, criticality: 'high', lastReplaced: '2023-09-10' },
]

const manualsData = [
  { name: 'Service Manual', type: 'PDF', size: '28.7 MB', pages: 342 },
  { name: 'User Manual', type: 'PDF', size: '12.4 MB', pages: 128 },
  { name: 'Calibration Guide', type: 'PDF', size: '4.2 MB', pages: 45 },
  { name: 'Technical Bulletin #TB-2024-01', type: 'PDF', size: '1.1 MB', pages: 8 },
  { name: 'Parts Catalog', type: 'PDF', size: '8.9 MB', pages: 156 },
  { name: 'Quick Reference Card', type: 'PDF', size: '0.5 MB', pages: 2 },
]

const historyData = [
  {
    id: 'TH-001',
    date: '2024-02-15',
    type: 'Corrective',
    engineer: 'John Doe',
    diagnosis: 'Oxygen sensor calibration drift beyond acceptable limits',
    verdict: 'Sensor replaced with new unit. Calibration completed successfully.',
    partsReplaced: ['Oxygen Sensor (PHI-OS-2847)'],
    serviceTime: '2.5 hours',
    photos: 3,
  },
  {
    id: 'TH-002',
    date: '2024-01-05',
    type: 'Corrective',
    engineer: 'Jane Smith',
    diagnosis: 'Flow sensor providing inconsistent readings',
    verdict: 'Sensor cleaned and recalibrated. Root cause: dust accumulation.',
    partsReplaced: [],
    serviceTime: '1 hour',
    photos: 2,
  },
  {
    id: 'TH-003',
    date: '2023-11-15',
    type: 'Preventive',
    engineer: 'Mike Johnson',
    diagnosis: 'Quarterly preventive maintenance check',
    verdict: 'All systems operational. Filter replaced as scheduled.',
    partsReplaced: ['Air Filter (PHI-FL-100)'],
    serviceTime: '1.5 hours',
    photos: 4,
  },
]

const quickPrompts = [
  { icon: AlertTriangle, text: 'Diagnose E-101 error', color: 'text-destructive' },
  { icon: Wrench, text: 'Maintenance steps', color: 'text-warning' },
  { icon: FileText, text: 'Find in manual', color: 'text-primary' },
  { icon: Lightbulb, text: 'Troubleshooting', color: 'text-success' },
]

function OverviewTab() {
  return (
    <div className="space-y-6 p-4">
      {/* Status Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <Activity className="size-6 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Equipment Status</p>
              <p className="text-lg font-semibold text-success">Operational</p>
            </div>
            <Badge className="bg-success/10 text-success">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Hours Used</p>
            <p className="text-2xl font-semibold">{equipmentData.hoursUsed.toLocaleString()}</p>
            <Progress value={(equipmentData.hoursUsed / 15000) * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Next Service</p>
            <p className="text-2xl font-semibold text-primary">48</p>
            <p className="text-xs text-muted-foreground">days remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {historyData.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                item.type === 'Corrective' ? 'bg-warning/10' : 'bg-primary/10'
              )}>
                <Wrench className={cn(
                  'size-4',
                  item.type === 'Corrective' ? 'text-warning' : 'text-primary'
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.type} Service</p>
                <p className="text-xs text-muted-foreground truncate">{item.diagnosis}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-warning" />
            <div>
              <p className="font-medium text-warning">Attention Required</p>
              <p className="text-sm text-muted-foreground">
                Recurring sensor calibration issues detected. Consider environmental review.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ChecklistTab() {
  const [checklist, setChecklist] = React.useState(checklistItems)

  const toggleItem = (categoryId: string, itemId: string) => {
    setChecklist(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        }
      }
      return cat
    }))
  }

  const totalItems = checklist.reduce((acc, cat) => acc + cat.items.length, 0)
  const completedItems = checklist.reduce(
    (acc, cat) => acc + cat.items.filter(i => i.completed).length, 
    0
  )

  return (
    <div className="space-y-4 p-4">
      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Checklist Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedItems} of {totalItems} completed
            </span>
          </div>
          <Progress value={(completedItems / totalItems) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Checklist Items */}
      {checklist.map((category) => (
        <Card key={category.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{category.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {category.items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                onClick={() => toggleItem(category.id, item.id)}
              >
                <Checkbox 
                  checked={item.completed} 
                  onCheckedChange={() => toggleItem(category.id, item.id)}
                />
                <div className="flex-1">
                  <p className={cn(
                    'text-sm',
                    item.completed && 'line-through text-muted-foreground'
                  )}>
                    {item.text}
                  </p>
                  {'expectedValue' in item && item.expectedValue && (
                    <p className="text-xs text-primary mt-1">
                      Expected: {item.expectedValue}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Camera className="mr-2 size-4" />
          Add Photo
        </Button>
        <Button className="flex-1">
          <CheckCircle2 className="mr-2 size-4" />
          Complete Checklist
        </Button>
      </div>
    </div>
  )
}

function PartsTab() {
  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
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

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search parts..." className="pl-9" />
        </div>
      </div>

      <div className="space-y-3">
        {partsData.map((part) => (
          <Card key={part.partNumber}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{part.name}</p>
                  <p className="text-xs font-mono text-muted-foreground">{part.partNumber}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getCriticalityColor(part.criticality)}>
                      {part.criticality}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Stock: {part.stock}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last replaced</p>
                  <p className="text-sm font-medium">{part.lastReplaced}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ManualsTab() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search in manuals..." className="pl-9" />
        </div>
      </div>

      <div className="space-y-3">
        {manualsData.map((manual) => (
          <Card key={manual.name} className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <FileText className="size-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{manual.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {manual.type} - {manual.size} - {manual.pages} pages
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ChatTab() {
  const [message, setMessage] = React.useState('')
  const [messages, setMessages] = React.useState<
    { id: string; role: 'assistant' | 'user'; content: string; timestamp: string }[]
  >([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant for the Philips Trilogy Evo Ventilator. I have access to all technical documentation, service history, and troubleshooting guides. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const handleSend = () => {
    if (!message.trim()) return
    
    setMessages(prev => [...prev, {
      id: String(Date.now()),
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
    setMessage('')

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: String(Date.now()),
        role: 'assistant',
        content: 'I\'m analyzing your request using the technical documentation and service history for this equipment. Based on the information available, I can provide detailed guidance on troubleshooting, maintenance procedures, and error code diagnosis.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-280px)]">
      {/* Quick Prompts */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        {quickPrompts.map((prompt) => (
          <Button
            key={prompt.text}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
            onClick={() => setMessage(prompt.text)}
          >
            <prompt.icon className={cn('mr-2 size-4', prompt.color)} />
            {prompt.text}
          </Button>
        ))}
      </div>
      
      <Separator />

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3',
                msg.role === 'user' && 'flex-row-reverse'
              )}
            >
              <Avatar className="size-8">
                <AvatarFallback className={
                  msg.role === 'assistant' 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-muted'
                }>
                  {msg.role === 'assistant' ? <Bot className="size-4" /> : <User className="size-4" />}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-card border rounded-tl-sm'
                )}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={cn(
                  'text-xs mt-1',
                  msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Paperclip className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Mic className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Voice input</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about this equipment..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} disabled={!message.trim()}>
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function HistoryTab() {
  return (
    <div className="space-y-4 p-4">
      {historyData.map((record) => (
        <Card key={record.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className={cn(
                'p-2 rounded-lg',
                record.type === 'Corrective' ? 'bg-warning/10' : 'bg-primary/10'
              )}>
                <Wrench className={cn(
                  'size-5',
                  record.type === 'Corrective' ? 'text-warning' : 'text-primary'
                )} />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{record.type} Service</p>
                    <p className="text-xs text-muted-foreground">
                      {record.id} - {record.date}
                    </p>
                  </div>
                  <Badge variant="outline">{record.serviceTime}</Badge>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Diagnosis</p>
                    <p className="text-sm">{record.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Verdict</p>
                    <p className="text-sm">{record.verdict}</p>
                  </div>
                </div>

                {record.partsReplaced.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {record.partsReplaced.map((part, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {part}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>By {record.engineer}</span>
                  <span>{record.photos} photos attached</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function EquipmentWorkspace({ equipmentId }: { equipmentId: string }) {
  const [isOnline, setIsOnline] = React.useState(true)

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/engineer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{equipmentData.name}</h1>
              <Badge className="bg-success/10 text-success">
                <CheckCircle2 className="mr-1 size-3" />
                Operational
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {equipmentData.brand} {equipmentData.model} - {equipmentData.serialNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isOnline ? 'default' : 'destructive'} className="flex items-center gap-1">
            {isOnline ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Equipment Info Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Hospital:</span>
              <span className="font-medium">{equipmentData.hospital}</span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Area:</span>
              <span className="font-medium">{equipmentData.area}</span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Contract:</span>
              <Badge variant="default">{equipmentData.contractType}</Badge>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Next PM:</span>
              <span className="font-medium text-primary">{equipmentData.nextMaintenance}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="size-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <Clipboard className="size-4" />
            <span className="hidden sm:inline">Checklist</span>
          </TabsTrigger>
          <TabsTrigger value="parts" className="flex items-center gap-2">
            <Package className="size-4" />
            <span className="hidden sm:inline">Parts</span>
          </TabsTrigger>
          <TabsTrigger value="manuals" className="flex items-center gap-2">
            <BookOpen className="size-4" />
            <span className="hidden sm:inline">Manuals</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Bot className="size-4" />
            <span className="hidden sm:inline">AI Chat</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="size-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="-mx-4 mt-4">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="checklist" className="-mx-4 mt-4">
          <ChecklistTab />
        </TabsContent>
        <TabsContent value="parts" className="-mx-4 mt-4">
          <PartsTab />
        </TabsContent>
        <TabsContent value="manuals" className="-mx-4 mt-4">
          <ManualsTab />
        </TabsContent>
        <TabsContent value="chat" className="-mx-4 mt-4">
          <ChatTab />
        </TabsContent>
        <TabsContent value="history" className="-mx-4 mt-4">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
