'use client'

import * as React from 'react'
import {
  AlertCircle,
  ArrowUp,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  FileText,
  History,
  Lightbulb,
  Maximize2,
  MessageSquare,
  Mic,
  Minimize2,
  Paperclip,
  Plus,
  Search,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  User,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

// Mock conversation data
const conversations = [
  {
    id: '1',
    title: 'Ventilator V-2847 Error E-101',
    equipment: 'Ventilator V-2847',
    date: 'Today',
    preview: 'The oxygen sensor calibration error...',
  },
  {
    id: '2',
    title: 'MRI Scanner Cooling Issue',
    equipment: 'MRI Scanner M-1204',
    date: 'Yesterday',
    preview: 'Temperature fluctuation detected in...',
  },
  {
    id: '3',
    title: 'Defibrillator Battery Problem',
    equipment: 'Defibrillator D-0892',
    date: '2 days ago',
    preview: 'Battery not holding charge after...',
  },
  {
    id: '4',
    title: 'CT Scanner Calibration',
    equipment: 'CT Scanner CT-4521',
    date: '3 days ago',
    preview: 'Annual calibration procedure steps...',
  },
]

const equipment = [
  { id: 'EQ-001', name: 'Ventilator V-2847', brand: 'Philips' },
  { id: 'EQ-002', name: 'MRI Scanner M-1204', brand: 'Siemens' },
  { id: 'EQ-003', name: 'Ultrasound U-3421', brand: 'GE Healthcare' },
  { id: 'EQ-004', name: 'Defibrillator D-0892', brand: 'Zoll' },
  { id: 'EQ-005', name: 'CT Scanner CT-4521', brand: 'Canon Medical' },
]

const quickPrompts = [
  { icon: AlertCircle, text: 'Diagnose error code', color: 'text-destructive' },
  { icon: Wrench, text: 'Maintenance procedure', color: 'text-warning' },
  { icon: FileText, text: 'Find in manual', color: 'text-primary' },
  { icon: Lightbulb, text: 'Troubleshooting steps', color: 'text-success' },
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  references?: { title: string; page: string }[]
  confidence?: number
  steps?: { step: number; title: string; description: string; completed: boolean }[]
  errorCode?: { code: string; description: string; severity: 'low' | 'medium' | 'high' | 'critical' }
  relatedIssues?: { id: string; title: string; similarity: number }[]
}

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'The Ventilator V-2847 is showing error code E-101. What does it mean and how do I fix it?',
    timestamp: '10:32 AM',
  },
  {
    id: '2',
    role: 'assistant',
    content: `I've analyzed the error code E-101 for the Philips Trilogy Evo Ventilator (V-2847). This is a **Oxygen Sensor Calibration Error** that indicates the oxygen sensor needs recalibration or replacement.

**Root Cause Analysis:**
This error typically occurs when:
- The oxygen sensor has drifted beyond acceptable calibration limits
- The sensor has reached its end of life (typical lifespan: 12-18 months)
- Environmental factors have affected sensor accuracy

**Recommended Actions:**`,
    timestamp: '10:32 AM',
    confidence: 94,
    errorCode: {
      code: 'E-101',
      description: 'Oxygen Sensor Calibration Error',
      severity: 'high',
    },
    references: [
      { title: 'Philips Trilogy Evo Service Manual', page: 'Section 7.3, Page 145' },
      { title: 'Calibration Guide', page: 'Section 3.1, Page 28' },
    ],
    steps: [
      { step: 1, title: 'Access Calibration Menu', description: 'Navigate to Settings > Service > Calibration', completed: false },
      { step: 2, title: 'Run Auto-Calibration', description: 'Select O2 Sensor and initiate automatic calibration sequence', completed: false },
      { step: 3, title: 'Verify Readings', description: 'Compare sensor readings with reference gas (21% O2)', completed: false },
      { step: 4, title: 'Replace if Necessary', description: 'If calibration fails, replace sensor (Part: PHI-OS-2847)', completed: false },
    ],
    relatedIssues: [
      { id: 'ISS-2341', title: 'Similar E-101 error on Ventilator V-2845', similarity: 92 },
      { id: 'ISS-2298', title: 'O2 sensor replacement procedure', similarity: 87 },
      { id: 'ISS-2156', title: 'Calibration failure after power surge', similarity: 78 },
    ],
  },
]

function ConversationHistory({ 
  onSelect, 
  selectedId 
}: { 
  onSelect: (id: string) => void
  selectedId: string | null 
}) {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredConversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.equipment.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col">
      <div className="p-3 border-b">
        <Button variant="outline" className="w-full justify-start gap-2">
          <Plus className="size-4" />
          New Conversation
        </Button>
      </div>
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={cn(
                'w-full rounded-lg p-3 text-left transition-colors hover:bg-accent',
                selectedId === conversation.id && 'bg-accent'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="size-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{conversation.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.equipment}
                  </p>
                  <p className="text-xs text-muted-foreground">{conversation.date}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function ContextPanel({ equipment: selectedEquipment }: { equipment: string | null }) {
  const equipmentData = equipment.find((e) => e.name === selectedEquipment)

  if (!equipmentData) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Zap className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium">No Equipment Selected</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select equipment to view context and documentation
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Selected Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{equipmentData.name}</p>
              <p className="text-sm text-muted-foreground">{equipmentData.brand}</p>
              <Badge variant="secondary" className="mt-2">
                <CheckCircle2 className="mr-1 size-3" />
                Operational
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <span className="text-sm font-medium">Technical Documentation</span>
            <ChevronDown className="size-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {[
              { name: 'Service Manual', pages: '342 pages' },
              { name: 'User Guide', pages: '128 pages' },
              { name: 'Troubleshooting Guide', pages: '86 pages' },
            ].map((doc) => (
              <button
                key={doc.name}
                className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:bg-accent transition-colors"
              >
                <FileText className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.pages}</p>
                </div>
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <span className="text-sm font-medium">Recent History</span>
            <ChevronDown className="size-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {[
              { type: 'Preventive', date: '2024-02-10', engineer: 'John Doe' },
              { type: 'Corrective', date: '2024-01-05', engineer: 'Jane Smith' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 py-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                  <Wrench className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.type} Service</p>
                  <p className="text-xs text-muted-foreground">
                    {item.date} • {item.engineer}
                  </p>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <span className="text-sm font-medium">Common Error Codes</span>
            <ChevronDown className="size-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {[
              { code: 'E-101', desc: 'Oxygen sensor calibration' },
              { code: 'E-205', desc: 'Power fluctuation' },
              { code: 'E-312', desc: 'Communication timeout' },
            ].map((error) => (
              <div key={error.code} className="flex items-center gap-2 py-1">
                <Badge variant="outline" className="font-mono">
                  {error.code}
                </Badge>
                <span className="text-sm text-muted-foreground">{error.desc}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </ScrollArea>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <Avatar className={cn('size-8', isUser ? 'bg-primary' : 'bg-primary/10')}>
        <AvatarFallback className={isUser ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}>
          {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
        </AvatarFallback>
      </Avatar>
      <div className={cn('flex-1 space-y-3', isUser && 'text-right')}>
        <div
          className={cn(
            'inline-block rounded-2xl px-4 py-3 max-w-[85%]',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-card border rounded-tl-sm'
          )}
        >
          <div className={cn('prose prose-sm', isUser && 'text-primary-foreground', !isUser && 'dark:prose-invert')}>
            {message.content.split('\n').map((line, i) => (
              <p key={i} className={cn('mb-2 last:mb-0', line.startsWith('**') && 'font-semibold')}>
                {line.replace(/\*\*/g, '')}
              </p>
            ))}
          </div>
        </div>

        {/* Error Code Card */}
        {message.errorCode && (
          <Card className="inline-block text-left max-w-[85%]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  'rounded-lg p-2',
                  message.errorCode.severity === 'critical' && 'bg-destructive/10',
                  message.errorCode.severity === 'high' && 'bg-warning/10',
                  message.errorCode.severity === 'medium' && 'bg-primary/10',
                  message.errorCode.severity === 'low' && 'bg-muted'
                )}>
                  <AlertCircle className={cn(
                    'size-5',
                    message.errorCode.severity === 'critical' && 'text-destructive',
                    message.errorCode.severity === 'high' && 'text-warning',
                    message.errorCode.severity === 'medium' && 'text-primary',
                    message.errorCode.severity === 'low' && 'text-muted-foreground'
                  )} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {message.errorCode.code}
                    </Badge>
                    <Badge
                      variant={message.errorCode.severity === 'critical' ? 'destructive' : 'secondary'}
                      className="capitalize"
                    >
                      {message.errorCode.severity}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mt-1">{message.errorCode.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Procedure Steps */}
        {message.steps && (
          <Card className="inline-block text-left max-w-[85%]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wrench className="size-4" />
                Recommended Procedure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {message.steps.map((step) => (
                <div key={step.step} className="flex items-start gap-3">
                  <div className={cn(
                    'flex size-6 items-center justify-center rounded-full text-xs font-medium',
                    step.completed 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {step.completed ? <CheckCircle2 className="size-4" /> : step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* References */}
        {message.references && (
          <Card className="inline-block text-left max-w-[85%]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="size-4" />
                Manual References
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {message.references.map((ref, index) => (
                <button
                  key={index}
                  className="flex w-full items-center gap-2 rounded-lg border p-2 text-left hover:bg-accent transition-colors"
                >
                  <FileText className="size-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ref.title}</p>
                    <p className="text-xs text-muted-foreground">{ref.page}</p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Related Issues */}
        {message.relatedIssues && (
          <Card className="inline-block text-left max-w-[85%]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <History className="size-4" />
                Similar Previous Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {message.relatedIssues.map((issue) => (
                <button
                  key={issue.id}
                  className="flex w-full items-center gap-2 rounded-lg border p-2 text-left hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{issue.title}</p>
                    <p className="text-xs text-muted-foreground">{issue.id}</p>
                  </div>
                  <Badge variant="secondary">{issue.similarity}% match</Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Confidence & Actions */}
        {!isUser && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{message.timestamp}</span>
            {message.confidence && (
              <div className="flex items-center gap-1">
                <Sparkles className="size-3" />
                <span>{message.confidence}% confidence</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-6">
                      <Copy className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy response</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-6">
                      <ThumbsUp className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Helpful</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-6">
                      <ThumbsDown className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Not helpful</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
        {isUser && (
          <p className="text-xs text-muted-foreground">{message.timestamp}</p>
        )}
      </div>
    </div>
  )
}

export function ChatContent() {
  const [messages, setMessages] = React.useState<Message[]>(mockMessages)
  const [input, setInput] = React.useState('')
  const [selectedEquipment, setSelectedEquipment] = React.useState<string>('Ventilator V-2847')
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>('1')
  const [showHistory, setShowHistory] = React.useState(true)
  const [showContext, setShowContext] = React.useState(true)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    
    setMessages([...messages, newMessage])
    setInput('')
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Conversation History Sidebar */}
      {showHistory && (
        <Card className="w-72 shrink-0 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium">History</CardTitle>
            <Button variant="ghost" size="icon" className="size-6" onClick={() => setShowHistory(false)}>
              <X className="size-4" />
            </Button>
          </CardHeader>
          <div className="flex-1 overflow-hidden">
            <ConversationHistory
              onSelect={setSelectedConversation}
              selectedId={selectedConversation}
            />
          </div>
        </Card>
      )}

      {/* Main Chat Area */}
      <Card className="flex flex-1 flex-col overflow-hidden">
        {/* Chat Header */}
        <CardHeader className="border-b py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!showHistory && (
                <Button variant="ghost" size="icon" onClick={() => setShowHistory(true)}>
                  <History className="size-4" />
                </Button>
              )}
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">AI Technical Assistant</CardTitle>
                  <CardDescription>Powered by equipment manuals & service history</CardDescription>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((e) => (
                    <SelectItem key={e.id} value={e.name}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowContext(!showContext)}
              >
                {showContext ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>

        {/* Quick Prompts */}
        <div className="border-t px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => setInput(prompt.text)}
              >
                <prompt.icon className={cn('mr-2 size-4', prompt.color)} />
                {prompt.text}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Textarea
                placeholder="Describe the issue or ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="min-h-[52px] max-h-[200px] pr-24 resize-none"
                rows={1}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <Paperclip className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Attach file</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <Mic className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voice input</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Button onClick={handleSend} size="icon" className="size-[52px]">
              <ArrowUp className="size-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Context Panel */}
      {showContext && (
        <Card className="w-80 shrink-0 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium">Context</CardTitle>
            <Button variant="ghost" size="icon" className="size-6" onClick={() => setShowContext(false)}>
              <X className="size-4" />
            </Button>
          </CardHeader>
          <div className="flex-1 overflow-hidden">
            <ContextPanel equipment={selectedEquipment} />
          </div>
        </Card>
      )}
    </div>
  )
}
