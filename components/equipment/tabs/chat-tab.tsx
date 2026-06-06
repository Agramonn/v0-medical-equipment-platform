'use client'

import * as React from 'react'
import {
  AlertTriangle,
  Bot,
  FileText,
  Lightbulb,
  Mic,
  Paperclip,
  Send,
  User,
  Wrench,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { equipmentData } from '@/lib/equipment-data'

const quickPrompts = [
  { icon: AlertTriangle, text: 'Diagnose E-101 error', color: 'text-destructive' },
  { icon: Wrench, text: 'Maintenance steps', color: 'text-warning' },
  { icon: FileText, text: 'Find in manual', color: 'text-primary' },
  { icon: Lightbulb, text: 'Troubleshooting', color: 'text-success' },
]

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
  timestamp: string
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function ChatTab() {
  const [message, setMessage] = React.useState('')
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI assistant for the ${equipmentData.manufacturer} ${equipmentData.model}. I have access to all technical documentation, service history, and troubleshooting guides for this unit. How can I help you today?`,
      timestamp: timeNow(),
    },
  ])
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = (text?: string) => {
    const content = (text ?? message).trim()
    if (!content) return

    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), role: 'user', content, timestamp: timeNow() },
    ])
    setMessage('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content:
            'Based on the service manual and this unit\u2019s service history, here is what I found. The most recent records show recurring oxygen sensor calibration drift. I recommend verifying sensor seating and running the calibration procedure in Service Manual \u00a77.3. Would you like the step-by-step procedure?',
          timestamp: timeNow(),
        },
      ])
    }, 900)
  }

  return (
    <div className="flex h-[calc(100vh-300px)] min-h-[420px] flex-col">
      {/* Quick prompts */}
      <div className="flex gap-2 overflow-x-auto p-4">
        {quickPrompts.map((prompt) => (
          <Button
            key={prompt.text}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
            onClick={() => handleSend(prompt.text)}
          >
            <prompt.icon className={cn('mr-2 size-4', prompt.color)} />
            {prompt.text}
          </Button>
        ))}
      </div>

      <Separator />

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
            >
              <Avatar className="size-8 shrink-0">
                <AvatarFallback
                  className={
                    msg.role === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-muted'
                  }
                >
                  {msg.role === 'assistant' ? (
                    <Bot className="size-4" />
                  ) : (
                    <User className="size-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  msg.role === 'user'
                    ? 'rounded-tr-sm bg-primary text-primary-foreground'
                    : 'rounded-tl-sm border bg-card',
                )}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p
                  className={cn(
                    'mt-1 text-xs',
                    msg.role === 'user'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground',
                  )}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t p-4">
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
          <Button onClick={() => handleSend()} disabled={!message.trim()}>
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
