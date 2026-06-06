'use client'

import * as React from 'react'
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  Search,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { manualsData, type Manual } from '@/lib/equipment-data'

const categories: (Manual['category'] | 'All')[] = [
  'All',
  'Operator Manual',
  'Service Manual',
  'Technical Bulletin',
  'Calibration Procedure',
  'Schematic',
  'Regulatory Document',
]

function ManualRow({ manual }: { manual: Manual }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Card className="transition-colors hover:bg-accent/40">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-lg bg-destructive/10 p-3">
            <FileText className="size-5 text-destructive" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{manual.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px]">
                {manual.category}
              </Badge>
              <span>
                {manual.type} · {manual.size} · {manual.pages} pages
              </span>
              <span>Updated {manual.updatedOn}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
              <Eye className="size-4" />
              <span className="sr-only">View {manual.name}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="size-4" />
              <span className="sr-only">Download {manual.name}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[85vh] max-w-3xl flex-col p-0">
          <DialogHeader className="flex-row items-center justify-between border-b px-4 py-3">
            <DialogTitle className="text-base">{manual.name}</DialogTitle>
            <div className="flex items-center gap-1 pr-6">
              <Button variant="outline" size="sm">
                <Download className="mr-2 size-4" />
                Download
              </Button>
            </div>
          </DialogHeader>
          {/* Simulated PDF viewer surface */}
          <div className="flex-1 overflow-auto bg-muted/40 p-6">
            <div className="mx-auto max-w-2xl space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[1/1.3] rounded-md border bg-card p-8 shadow-sm"
                >
                  <div className="flex items-center gap-2 border-b pb-3">
                    <FileText className="size-4 text-destructive" />
                    <span className="text-sm font-semibold">{manual.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      Page {i + 1} of {manual.pages}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {Array.from({ length: 10 }).map((_, line) => (
                      <div
                        key={line}
                        className={cn(
                          'h-2.5 rounded bg-muted',
                          line % 4 === 0 ? 'w-1/2' : line % 3 === 0 ? 'w-5/6' : 'w-full',
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function ManualsTab() {
  const [query, setQuery] = React.useState('')
  const [category, setCategory] = React.useState<string>('All')

  const filtered = manualsData.filter((m) => {
    const matchesQuery =
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'All' || m.category === category
    return matchesQuery && matchesCategory
  })

  return (
    <div className="space-y-4 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
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

      <div className="space-y-3">
        {filtered.map((manual) => (
          <ManualRow key={manual.id} manual={manual} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <BookOpen className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No documents found.</p>
        </div>
      )}
    </div>
  )
}
