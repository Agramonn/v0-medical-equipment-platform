'use client'

import * as React from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Loader2,
  Save,
  Send,
  X,
  Check,
  Wifi,
  WifiOff,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  ServiceOrderWithRelations,
  ChecklistTemplate,
  ChecklistItemResponse,
  ChecklistResponse,
} from '@/lib/types'
import {
  saveChecklistProgress,
  completeChecklist,
} from '@/lib/actions/service-orders'

// ── Offline storage key ───────────────────────────────────────────────────────
const offlineKey = (orderId: string) => `checklist_draft_${orderId}`

// ── Status button ─────────────────────────────────────────────────────────────
function ItemStatusButtons({
  status,
  onChange,
}: {
  status: ChecklistItemResponse['status']
  onChange: (s: ChecklistItemResponse['status']) => void
}) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button
        type="button"
        size="sm"
        variant={status === 'pass' ? 'default' : 'outline'}
        className={cn(
          'h-7 px-2',
          status === 'pass' && 'bg-success text-success-foreground hover:bg-success/90'
        )}
        onClick={() => onChange(status === 'pass' ? 'pending' : 'pass')}
      >
        <Check className="size-3.5" />
        <span className="ml-1 hidden sm:inline">Pass</span>
      </Button>
      <Button
        type="button"
        size="sm"
        variant={status === 'fail' ? 'default' : 'outline'}
        className={cn(
          'h-7 px-2',
          status === 'fail' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
        )}
        onClick={() => onChange(status === 'fail' ? 'pending' : 'fail')}
      >
        <X className="size-3.5" />
        <span className="ml-1 hidden sm:inline">Fail</span>
      </Button>
      <Button
        type="button"
        size="sm"
        variant={status === 'na' ? 'secondary' : 'outline'}
        className="h-7 px-2"
        onClick={() => onChange(status === 'na' ? 'pending' : 'na')}
      >
        <span className="text-xs">N/A</span>
      </Button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function EngineerOrderSheet({
  order,
  template,
  open,
  onOpenChange,
}: {
  order: ServiceOrderWithRelations | null
  template: ChecklistTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [items, setItems] = React.useState<ChecklistItemResponse[]>([])
  const [findings, setFindings] = React.useState('')
  const [laborHours, setLaborHours] = React.useState('')
  const [openSections, setOpenSections] = React.useState<Set<string>>(new Set())
  const [openNotes, setOpenNotes] = React.useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [isOnline, setIsOnline] = React.useState(true)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  // ── Initialize items from template or saved checklist ─────────────────────
  React.useEffect(() => {
    if (!order || !template) return

    // Try offline draft first
    const draft = localStorage.getItem(offlineKey(order.id))
    if (draft) {
      try {
        const parsed: ChecklistItemResponse[] = JSON.parse(draft)
        setItems(parsed)
        setLastSaved(new Date())
        return
      } catch {}
    }

    // Then try saved checklist from DB
    const saved = order.checklist as ChecklistResponse | null
    if (saved?.items?.length) {
      setItems(saved.items)
      setFindings(order.findings ?? '')
      setLaborHours(order.laborHours?.toString() ?? '')
      return
    }

    // Initialize fresh from template
    setItems(
      template.items.map((item) => ({
        itemId: item.id,
        status: 'pending',
      }))
    )
    setFindings(order.findings ?? '')
    setLaborHours(order.laborHours?.toString() ?? '')

    // Open all sections by default
    const sections = new Set(template.items.map((i) => i.section))
    setOpenSections(sections)
  }, [order?.id, template])

  // ── Online/offline detection ───────────────────────────────────────────────
  React.useEffect(() => {
    const onOnline = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (!order || !template) return null

  // ── Computed values ────────────────────────────────────────────────────────
  const sections = Array.from(new Set(template.items.map((i) => i.section)))

  const getItem = (itemId: string) =>
    items.find((r) => r.itemId === itemId) ?? { itemId, status: 'pending' as const }

  function updateItem(
    itemId: string,
    field: keyof ChecklistItemResponse,
    value: string
  ) {
    setItems((prev) => {
      const exists = prev.find((r) => r.itemId === itemId)
      if (exists) {
        return prev.map((r) => (r.itemId === itemId ? { ...r, [field]: value } : r))
      }
      return [...prev, { itemId, status: 'pending', [field]: value }]
    })
  }

  function updateItemStatus(itemId: string, status: ChecklistItemResponse['status']) {
    setItems((prev) => {
      const exists = prev.find((r) => r.itemId === itemId)
      if (exists) {
        return prev.map((r) => (r.itemId === itemId ? { ...r, status } : r))
      }
      return [...prev, { itemId, status }]
    })
  }

  const total = template.items.length
  const completed = items.filter((i) => i.status !== 'pending').length
  const passed = items.filter((i) => i.status === 'pass').length
  const failed = items.filter((i) => i.status === 'fail').length
  const progress = Math.round((completed / total) * 100)
  const pendingCritical = template.items.filter(
    (ti) => ti.isCritical && getItem(ti.id).status === 'pending'
  ).length

  // ── Save draft ─────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!order) return
    setError(null)

    // Always save to localStorage (offline support)
    localStorage.setItem(offlineKey(order.id), JSON.stringify(items))
    setLastSaved(new Date())

    if (!isOnline) return // Skip DB save if offline

    setIsSaving(true)
    try {
      await saveChecklistProgress(order.id, items)
      setLastSaved(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  // ── Submit checklist ───────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!order) return
    setError(null)
    setIsSubmitting(true)
    try {
      await completeChecklist(
        order.id,
        items,
        findings,
        parseFloat(laborHours) || 0
      )
      // Clear offline draft
      localStorage.removeItem(offlineKey(order.id))
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit')
    } finally {
      setIsSubmitting(false)
      setConfirmOpen(false)
    }
  }

  const isPreventive = order.type === 'PREVENTIVE_MAINTENANCE'
  const submitLabel = isPreventive
    ? 'Submit PM Checklist'
    : 'Submit Corrective Report'
  const submitDescription = isPreventive
    ? 'This will mark the PM as completed and send it for supervisor review.'
    : 'This will submit your corrective report. The order will move to Pending Customer Confirmation.'

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-2xl">
          {/* Header */}
          <SheetHeader className="shrink-0 border-b p-6 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <SheetTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  <span className="font-mono text-sm">
                    {order.orderNumber.slice(0, 12)}
                  </span>
                </SheetTitle>
                <SheetDescription>
                  {order.equipment.equipmentModel.name} ·{' '}
                  {order.equipment.serialNumber}
                </SheetDescription>
              </div>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Badge variant="outline" className="gap-1 text-success">
                    <Wifi className="size-3" /> Online
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-warning">
                    <WifiOff className="size-3" /> Offline
                  </Badge>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{completed}/{total} items</span>
                <span className="flex items-center gap-3">
                  <span className="text-success">{passed} pass</span>
                  <span className="text-destructive">{failed} fail</span>
                </span>
              </div>
              <Progress value={progress} className="h-1.5" />
              {lastSaved && (
                <p className="text-xs text-muted-foreground">
                  Last saved: {lastSaved.toLocaleTimeString()}
                  {!isOnline && ' (offline — will sync when connected)'}
                </p>
              )}
            </div>
          </SheetHeader>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-4 p-6">
              {/* Checklist sections */}
              {sections.map((section) => {
                const sectionItems = template.items.filter(
                  (i) => i.section === section
                )
                const sectionCompleted = sectionItems.filter(
                  (i) => getItem(i.id).status !== 'pending'
                ).length
                const isOpen = openSections.has(section)

                return (
                  <Collapsible
                    key={section}
                    open={isOpen}
                    onOpenChange={(v) =>
                      setOpenSections((prev) => {
                        const next = new Set(prev)
                        if (v) next.add(section)
                        else next.delete(section)
                        return next
                      })
                    }
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border bg-muted/30 px-4 py-3 hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-sm">{section}</span>
                        <Badge variant="outline" className="tabular-nums text-xs">
                          {sectionCompleted}/{sectionItems.length}
                        </Badge>
                      </div>
                      <ChevronDown
                        className={cn(
                          'size-4 text-muted-foreground transition-transform',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-2 space-y-2">
                      {sectionItems.map((templateItem) => {
                        const response = getItem(templateItem.id)
                        const noteKey = templateItem.id
                        const showNote = openNotes.has(noteKey)

                        return (
                          <div
                            key={templateItem.id}
                            className={cn(
                              'rounded-lg border bg-card p-3',
                              response.status === 'pass' &&
                                'border-success/20 bg-success/5',
                              response.status === 'fail' &&
                                'border-destructive/20 bg-destructive/5'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start gap-2">
                                  {templateItem.isCritical && (
                                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />
                                  )}
                                  <p className="text-sm">{templateItem.description}</p>
                                </div>
                                {templateItem.expectedValue && (
                                  <p className="mt-0.5 text-xs text-primary">
                                    Expected: {templateItem.expectedValue}
                                    {templateItem.unit && ` ${templateItem.unit}`}
                                  </p>
                                )}
                              </div>
                              <ItemStatusButtons
                                status={response.status}
                                onChange={(s) =>
                                  updateItemStatus(templateItem.id, s)
                                }
                              />
                            </div>

                            {/* Measured value if has expected */}
                            {templateItem.expectedValue &&
                              response.status !== 'pending' && (
                                <div className="mt-2">
                                  <Input
                                    className="h-7 text-xs"
                                    placeholder={`Measured value (${templateItem.unit ?? 'value'})`}
                                    value={response.measuredValue ?? ''}
                                    onChange={(e) =>
                                      updateItem(
                                        templateItem.id,
                                        'measuredValue',
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              )}

                            {/* Notes toggle */}
                            <div className="mt-2 flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-muted-foreground"
                                onClick={() =>
                                  setOpenNotes((prev) => {
                                    const next = new Set(prev)
                                    if (next.has(noteKey)) next.delete(noteKey)
                                    else next.add(noteKey)
                                    return next
                                  })
                                }
                              >
                                {showNote ? 'Hide notes' : 'Add notes'}
                              </Button>
                              {templateItem.requiresEvidence && (
                                <Badge
                                  variant="outline"
                                  className="h-5 text-[10px]"
                                >
                                  Evidence required
                                </Badge>
                              )}
                            </div>

                            {showNote && (
                              <Textarea
                                className="mt-2 min-h-[60px] text-xs"
                                placeholder="Inspection notes..."
                                value={response.notes ?? ''}
                                onChange={(e) =>
                                  updateItem(
                                    templateItem.id,
                                    'notes',
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </div>
                        )
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}

              <Separator />

              {/* Findings / Summary */}
              <div className="space-y-2">
                <Label>
                  {isPreventive
                    ? 'Service Findings & Observations'
                    : 'Corrective Actions Performed'}
                </Label>
                <Textarea
                  className="min-h-[100px]"
                  placeholder={
                    isPreventive
                      ? 'Document any findings, observations or recommendations...'
                      : 'Describe all corrective actions performed, parts replaced, and final equipment status...'
                  }
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Labor Hours</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  placeholder="e.g. 2.5"
                  value={laborHours}
                  onChange={(e) => setLaborHours(e.target.value)}
                  className="max-w-[140px]"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </ScrollArea>

          {/* Footer actions */}
          <div className="shrink-0 border-t bg-muted/30 p-4 space-y-2">
            {pendingCritical > 0 && (
              <p className="text-xs text-warning flex items-center gap-1">
                <AlertTriangle className="size-3.5" />
                {pendingCritical} critical item(s) still pending
              </p>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                className="flex-1"
                onClick={() => setConfirmOpen(true)}
                disabled={completed < total || isSubmitting}
              >
                <Send className="mr-2 size-4" />
                {submitLabel}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Submit confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{submitLabel}?</AlertDialogTitle>
            <AlertDialogDescription>
              {submitDescription}
              {failed > 0 && (
                <span className="mt-2 block text-warning">
                  ⚠ {failed} item(s) marked as failed. Make sure findings are documented.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              {isSubmitting ? 'Submitting...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}