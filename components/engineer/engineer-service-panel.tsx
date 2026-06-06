'use client'

import * as React from 'react'
import {
  Camera,
  CheckCircle2,
  ClipboardList,
  FileText,
  Gauge,
  Info,
  Package,
  PauseCircle,
  PlayCircle,
  Send,
  Wrench,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  completionRequirementLabels,
  type CompletionRequirements,
  type ServiceOrder,
  type ServiceOrderStatus,
} from '@/lib/service-order-data'
import {
  PriorityBadge,
  StatusBadge,
  TypeBadge,
} from '@/components/service-orders/service-order-badges'

// Engineers can move an order through execution states, but they can NEVER
// close it. They submit completed work for supervisor review.
type EngineerStatus = Extract<
  ServiceOrderStatus,
  'assigned' | 'in-progress' | 'pending-parts' | 'pending-customer' | 'completed'
>

export function EngineerServicePanel({
  order,
  open,
  onOpenChange,
}: {
  order: ServiceOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [localStatus, setLocalStatus] = React.useState<EngineerStatus>('assigned')
  const [checklist, setChecklist] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    if (order) {
      setLocalStatus(
        (order.status === 'completed' ||
        order.status === 'in-progress' ||
        order.status === 'pending-parts' ||
        order.status === 'pending-customer'
          ? order.status
          : 'assigned') as EngineerStatus,
      )
      setChecklist(
        Object.fromEntries(order.scope.checklist.map((c) => [c.id, c.done])),
      )
    }
  }, [order])

  if (!order) return null

  const started = localStatus !== 'assigned'
  const submitted = localStatus === 'completed'
  const checklistDone = order.scope.checklist.filter((c) => checklist[c.id]).length
  const checklistTotal = order.scope.checklist.length

  const requiredEvidence = (
    Object.keys(completionRequirementLabels) as (keyof CompletionRequirements)[]
  ).filter((key) => order.requirements[key])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-hidden p-0 sm:max-w-lg">
        <SheetHeader className="border-b p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Wrench className="size-5" />
            {order.equipment.name}
          </SheetTitle>
          <SheetDescription className="font-mono">{order.id}</SheetDescription>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={localStatus} />
            <PriorityBadge priority={order.priority} />
            <TypeBadge type={order.type} />
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-210px)]">
          <div className="space-y-5 p-6">
            {/* Scope summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Info className="size-4" />
                  Scope
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>{order.scope.objectives || order.type}</p>
                {order.scope.safetyRequirements && (
                  <p className="rounded-md bg-warning/10 p-2 text-xs text-warning">
                    Safety: {order.scope.safetyRequirements}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {order.serviceLocation} · Est. {order.estimatedHours} h
                </p>
              </CardContent>
            </Card>

            {/* Checklist */}
            {order.scope.checklist.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm font-medium">
                    <span className="flex items-center gap-2">
                      <ClipboardList className="size-4" />
                      Checklist
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {checklistDone}/{checklistTotal}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {order.scope.checklist.map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={checklist[item.id] ?? false}
                        disabled={!started || submitted}
                        onCheckedChange={(c) =>
                          setChecklist((prev) => ({ ...prev, [item.id]: c === true }))
                        }
                      />
                      <span
                        className={cn(
                          checklist[item.id] && 'text-muted-foreground line-through',
                        )}
                      >
                        {item.text}
                      </span>
                    </label>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Documentation entry */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="size-4" />
                  Service Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Findings</Label>
                  <Textarea
                    placeholder="What did you find?"
                    disabled={!started || submitted}
                    defaultValue={order.documentation.findings}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Root Cause</Label>
                  <Textarea
                    placeholder="Root cause analysis..."
                    disabled={!started || submitted}
                    defaultValue={order.documentation.rootCause}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Corrective Actions</Label>
                  <Textarea
                    placeholder="What did you do?"
                    disabled={!started || submitted}
                    defaultValue={order.documentation.correctiveActions}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Recommendations</Label>
                  <Textarea
                    placeholder="Follow-up recommendations..."
                    disabled={!started || submitted}
                    defaultValue={order.documentation.recommendations}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Evidence capture */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Capture Evidence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {requiredEvidence.map((key) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {completionRequirementLabels[key].replace(' Required', '')}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-col h-auto py-3"
                    disabled={!started || submitted}
                  >
                    <Gauge className="mb-1 size-4" />
                    <span className="text-xs">Measurement</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-col h-auto py-3"
                    disabled={!started || submitted}
                  >
                    <Camera className="mb-1 size-4" />
                    <span className="text-xs">Photo</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-col h-auto py-3"
                    disabled={!started || submitted}
                  >
                    <Package className="mb-1 size-4" />
                    <span className="text-xs">Part Used</span>
                  </Button>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Labor Hours</Label>
                  <Input
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="0"
                    disabled={!started || submitted}
                    defaultValue={order.documentation.laborHours || ''}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Engineer actions */}
        <div className="border-t bg-muted/30 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Engineer Actions
          </p>
          {!started && (
            <Button className="w-full" onClick={() => setLocalStatus('in-progress')}>
              <PlayCircle className="mr-2 size-4" />
              Start Service
            </Button>
          )}
          {started && !submitted && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocalStatus('pending-parts')}
              >
                <PauseCircle className="mr-2 size-4" />
                Pending Parts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocalStatus('pending-customer')}
              >
                <PauseCircle className="mr-2 size-4" />
                Pending Customer
              </Button>
              {(localStatus === 'pending-parts' ||
                localStatus === 'pending-customer') && (
                <Button
                  variant="outline"
                  size="sm"
                  className="col-span-2"
                  onClick={() => setLocalStatus('in-progress')}
                >
                  <PlayCircle className="mr-2 size-4" />
                  Resume Service
                </Button>
              )}
              <Button
                size="sm"
                className="col-span-2"
                onClick={() => setLocalStatus('completed')}
              >
                <Send className="mr-2 size-4" />
                Complete &amp; Submit for Review
              </Button>
            </div>
          )}
          {submitted && (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-success/10 p-3 text-sm text-success">
              <CheckCircle2 className="size-4" />
              Submitted for supervisor review
            </div>
          )}
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Engineers submit work for review. Only a supervisor can close an order.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
