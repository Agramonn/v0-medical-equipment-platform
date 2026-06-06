'use client'

import * as React from 'react'
import {
  Camera,
  CheckCircle2,
  Paperclip,
  Wrench,
  X,
  Check,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  checklistData,
  recommendedTools,
  type ChecklistCategory,
  type ChecklistItem,
} from '@/lib/equipment-data'

function StatusButtons({
  status,
  onChange,
}: {
  status: ChecklistItem['status']
  onChange: (status: ChecklistItem['status']) => void
}) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button
        type="button"
        size="sm"
        variant={status === 'pass' ? 'default' : 'outline'}
        className={cn(
          'h-8 px-2.5',
          status === 'pass' && 'bg-success text-success-foreground hover:bg-success/90',
        )}
        onClick={() => onChange(status === 'pass' ? 'pending' : 'pass')}
      >
        <Check className="size-3.5" />
        <span className="sr-only sm:not-sr-only sm:ml-1">Pass</span>
      </Button>
      <Button
        type="button"
        size="sm"
        variant={status === 'fail' ? 'default' : 'outline'}
        className={cn(
          'h-8 px-2.5',
          status === 'fail' &&
            'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        )}
        onClick={() => onChange(status === 'fail' ? 'pending' : 'fail')}
      >
        <X className="size-3.5" />
        <span className="sr-only sm:not-sr-only sm:ml-1">Fail</span>
      </Button>
    </div>
  )
}

export function ChecklistTab() {
  const [checklist, setChecklist] = React.useState<ChecklistCategory[]>(checklistData)
  const [openNotes, setOpenNotes] = React.useState<Record<string, boolean>>({})

  const setItemStatus = (
    categoryId: string,
    itemId: string,
    status: ChecklistItem['status'],
  ) => {
    setChecklist((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, status } : item,
              ),
            }
          : cat,
      ),
    )
  }

  const setItemNotes = (categoryId: string, itemId: string, notes: string) => {
    setChecklist((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, notes } : item,
              ),
            }
          : cat,
      ),
    )
  }

  const allItems = checklist.flatMap((c) => c.items)
  const total = allItems.length
  const completed = allItems.filter((i) => i.status !== 'pending').length
  const passed = allItems.filter((i) => i.status === 'pass').length
  const failed = allItems.filter((i) => i.status === 'fail').length
  const progress = Math.round((completed / total) * 100)

  return (
    <div className="space-y-4 p-4">
      {/* Recommended tools */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="size-4 text-muted-foreground" />
            Recommended Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {recommendedTools.map((tool) => (
              <Badge key={tool} variant="secondary" className="font-normal">
                {tool}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Checklist Progress</span>
            <span className="text-sm text-muted-foreground tabular-nums">
              {completed} of {total} completed
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="mt-3 flex gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-success">
              <span className="size-2 rounded-full bg-success" /> {passed} passed
            </span>
            <span className="flex items-center gap-1.5 text-destructive">
              <span className="size-2 rounded-full bg-destructive" /> {failed} failed
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-muted-foreground/40" />{' '}
              {total - completed} pending
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Accordion type="multiple" defaultValue={checklist.map((c) => c.id)} className="space-y-3">
        {checklist.map((category) => {
          const catCompleted = category.items.filter((i) => i.status !== 'pending').length
          return (
            <AccordionItem
              key={category.id}
              value={category.id}
              className="rounded-lg border bg-card px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 items-center justify-between pr-2">
                  <span className="text-sm font-medium">{category.category}</span>
                  <Badge variant="outline" className="ml-2 text-[10px] tabular-nums">
                    {catCompleted}/{category.items.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pb-3">
                {category.items.map((item) => {
                  const noteKey = `${category.id}-${item.id}`
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border bg-background p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              'text-sm',
                              item.status === 'pass' && 'text-success',
                              item.status === 'fail' && 'text-destructive',
                            )}
                          >
                            {item.text}
                          </p>
                          {item.expectedValue && (
                            <p className="mt-0.5 text-xs text-primary">
                              Expected: {item.expectedValue}
                            </p>
                          )}
                        </div>
                        <StatusButtons
                          status={item.status}
                          onChange={(s) => setItemStatus(category.id, item.id, s)}
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-muted-foreground"
                          onClick={() =>
                            setOpenNotes((prev) => ({
                              ...prev,
                              [noteKey]: !prev[noteKey],
                            }))
                          }
                        >
                          Notes
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-muted-foreground"
                        >
                          <Paperclip className="mr-1 size-3" />
                          Evidence
                        </Button>
                      </div>
                      {openNotes[noteKey] && (
                        <Textarea
                          value={item.notes ?? ''}
                          onChange={(e) =>
                            setItemNotes(category.id, item.id, e.target.value)
                          }
                          placeholder="Add inspection notes..."
                          className="mt-2 min-h-[60px] text-sm"
                        />
                      )}
                    </div>
                  )
                })}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Camera className="mr-2 size-4" />
          Add Photo
        </Button>
        <Button className="flex-1" disabled={completed < total}>
          <CheckCircle2 className="mr-2 size-4" />
          Complete Checklist
        </Button>
      </div>
    </div>
  )
}
