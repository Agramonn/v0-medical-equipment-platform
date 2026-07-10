'use client'

import * as React from 'react'
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EquipmentWithDetails, ManualRecord } from '@/lib/types'
import { createManual, updateManual, deleteManual } from '@/lib/actions/equipment-model'

const CATEGORIES = [
  'All',
  'Operator Manual',
  'Service Manual',
  'Technical Bulletin',
  'Calibration Procedure',
  'Schematic',
  'Regulatory Document',
]

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c !== 'All')

// ── Manual Viewer ─────────────────────────────────────────────────────────────

function ManualViewerDialog({
  manual,
  open,
  onOpenChange,
}: {
  manual: ManualRecord
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-w-3xl flex-col p-0">
        <DialogHeader className="flex-row items-center justify-between border-b px-4 py-3">
          <DialogTitle className="text-base">{manual.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Viewing document: {manual.name}
          </DialogDescription>
          {manual.fileUrl && (
            <div className="flex items-center gap-1 pr-6">
              <Button variant="outline" size="sm" asChild>
                <a href={manual.fileUrl} download target="_blank" rel="noreferrer">
                  <Download className="mr-2 size-4" />
                  Download
                </a>
              </Button>
            </div>
          )}
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {manual.fileUrl ? (
            <iframe src={manual.fileUrl} className="h-full w-full" title={manual.name} />
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <FileText className="mx-auto mb-3 size-10 text-muted-foreground/40" />
                <p className="text-sm font-medium">No file attached</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add a URL to enable document viewing.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Manual Form Dialog ────────────────────────────────────────────────────────

function ManualFormDialog({
  open,
  onOpenChange,
  equipmentModelId,
  manual,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  equipmentModelId: string
  manual?: ManualRecord
}) {
  const isEdit = !!manual
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [name, setName] = React.useState(manual?.name ?? '')
  const [category, setCategory] = React.useState(manual?.category ?? 'Service Manual')
  const [pages, setPages] = React.useState(manual?.pages?.toString() ?? '')
  const [fileUrl, setFileUrl] = React.useState(manual?.fileUrl ?? '')

  React.useEffect(() => {
    if (manual) {
      setName(manual.name)
      setCategory(manual.category)
      setPages(manual.pages?.toString() ?? '')
      setFileUrl(manual.fileUrl ?? '')
    } else {
      setName('')
      setCategory('Service Manual')
      setPages('')
      setFileUrl('')
    }
    setError(null)
  }, [manual, open])

  async function handleSubmit() {
    if (!name || !category) {
      setError('Name and category are required')
      return
    }
    setError(null)
    setIsPending(true)
    try {
      if (isEdit && manual) {
        await updateManual(manual.id, {
          name,
          category,
          pages: pages ? parseInt(pages) : undefined,
          fileUrl: fileUrl || undefined,
        })
      } else {
        await createManual({
          equipmentModelId,
          name,
          category,
          pages: pages ? parseInt(pages) : undefined,
          fileUrl: fileUrl || undefined,
        })
      }
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save manual')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Manual' : 'Add Manual'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details for this document.'
              : 'Add a new document to the equipment model catalog.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Document Name *</Label>
            <Input
              placeholder="Trilogy Evo Service Manual v3.2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Pages</Label>
              <Input
                type="number"
                min={1}
                placeholder="342"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>File URL</Label>
            <Input
              placeholder="https://example.com/manual.pdf"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Link to a PDF hosted on Google Drive, SharePoint, or any public URL.
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Manual'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Main tab ──────────────────────────────────────────────────────────────────

export function ManualsTab({
  equipment,
  isSupervisor,
}: {
  equipment: EquipmentWithDetails
  isSupervisor: boolean
}) {
  const [query, setQuery] = React.useState('')
  const [category, setCategory] = React.useState('All')
  const [viewManual, setViewManual] = React.useState<ManualRecord | null>(null)
  const [editManual, setEditManual] = React.useState<ManualRecord | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [addOpen, setAddOpen] = React.useState(false)

  const manuals = equipment.equipmentModel.manuals

  const filtered = manuals.filter((m) => {
    const matchesQuery =
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'All' || m.category === category
    return matchesQuery && matchesCategory
  })

  async function handleDelete() {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteManual(deleteId)
      setDeleteId(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      {/* Search + Upload */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents..."
            className="pl-9"
          />
        </div>
        {isSupervisor && (
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 size-4" />
            Add Manual
          </Button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            type="button"
            size="sm"
            variant={category === cat ? 'default' : 'outline'}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Empty state */}
      {manuals.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <BookOpen className="mx-auto mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">No manuals available</p>
          <p className="text-xs text-muted-foreground mt-1">
            Manuals for {equipment.equipmentModel.manufacturer} {equipment.equipmentModel.model} have not been added yet.
          </p>
          {isSupervisor && (
            <Button size="sm" variant="outline" className="mt-4" onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 size-4" />
              Add First Manual
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((manual) => (
            <Card key={manual.id} className="transition-colors hover:bg-accent/40">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-destructive/10 p-3">
                  <FileText className="size-5 text-destructive" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{manual.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px]">{manual.category}</Badge>
                    {manual.pages && <span>{manual.pages} pages</span>}
                    <span>Added {new Date(manual.createdAt).toLocaleDateString('en-US')}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setViewManual(manual)}>
                    <Eye className="size-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  {manual.fileUrl && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={manual.fileUrl} download target="_blank" rel="noreferrer">
                        <Download className="size-4" />
                        <span className="sr-only">Download</span>
                      </a>
                    </Button>
                  )}
                  {isSupervisor && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => setEditManual(manual)}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(manual.id)}
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <BookOpen className="size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No documents match your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Viewer */}
      {viewManual && (
        <ManualViewerDialog
          manual={viewManual}
          open={!!viewManual}
          onOpenChange={(v) => { if (!v) setViewManual(null) }}
        />
      )}

      {/* Add form */}
      <ManualFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        equipmentModelId={equipment.equipmentModel.id}
      />

      {/* Edit form */}
      <ManualFormDialog
        open={!!editManual}
        onOpenChange={(v) => { if (!v) setEditManual(null) }}
        equipmentModelId={equipment.equipmentModel.id}
        manual={editManual ?? undefined}
      />

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this manual?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the manual from all units of this model.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}