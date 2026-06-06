'use client'

import * as React from 'react'
import {
  Bug,
  Calendar,
  Gauge,
  Image as ImageIcon,
  RefreshCw,
  ShieldCheck,
  Wrench,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { historyData, type HistoryRecord } from '@/lib/equipment-data'

const filters: (HistoryRecord['type'] | 'All')[] = [
  'All',
  'Preventive',
  'Corrective',
  'Calibration',
  'Repair',
  'Software Update',
]

function typeMeta(type: HistoryRecord['type']) {
  switch (type) {
    case 'Corrective':
      return { Icon: Wrench, className: 'bg-warning/10 text-warning', ring: 'ring-warning/30' }
    case 'Calibration':
      return { Icon: Gauge, className: 'bg-primary/10 text-primary', ring: 'ring-primary/30' }
    case 'Repair':
      return { Icon: Bug, className: 'bg-destructive/10 text-destructive', ring: 'ring-destructive/30' }
    case 'Software Update':
      return { Icon: RefreshCw, className: 'bg-accent text-accent-foreground', ring: 'ring-border' }
    default:
      return { Icon: ShieldCheck, className: 'bg-success/10 text-success', ring: 'ring-success/30' }
  }
}

export function HistoryTab() {
  const [filter, setFilter] = React.useState<string>('All')

  const filtered = historyData.filter((r) => filter === 'All' || r.type === filter)

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f}
            type="button"
            size="sm"
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative space-y-4 pl-2">
        <div
          className="absolute bottom-4 left-[1.4rem] top-4 w-px bg-border"
          aria-hidden="true"
        />
        {filtered.map((record) => {
          const { Icon, className, ring } = typeMeta(record.type)
          return (
            <div key={record.id} className="relative flex gap-4">
              <div
                className={cn(
                  'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ring-4 ring-background',
                  className,
                )}
              >
                <Icon className="size-4" />
              </div>
              <Card className={cn('flex-1 ring-1 ring-inset', ring)}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{record.summary}</p>
                        <Badge variant="outline" className="text-[10px]">
                          {record.type}
                        </Badge>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3" />
                        {record.date} · {record.id}
                      </p>
                    </div>
                    <Badge variant="secondary" className="tabular-nums">
                      {record.serviceTime}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{record.detail}</p>

                  {record.partsReplaced.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {record.partsReplaced.map((part, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">
                          {part}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
                    <span>By {record.engineer}</span>
                    {record.photos > 0 && (
                      <span className="flex items-center gap-1">
                        <ImageIcon className="size-3" />
                        {record.photos} photos
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No {filter.toLowerCase()} records found.
        </p>
      )}
    </div>
  )
}
