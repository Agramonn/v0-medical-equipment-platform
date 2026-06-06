'use client'

import * as React from 'react'
import { AlertTriangle, Package, Search, ShoppingCart } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { partsData, type SparePart } from '@/lib/equipment-data'

function stockState(part: SparePart) {
  if (part.stock === 0)
    return { label: 'Out of stock', className: 'bg-destructive/10 text-destructive' }
  if (part.stock < part.reorderLevel)
    return { label: 'Low stock', className: 'bg-warning/10 text-warning' }
  return { label: 'In stock', className: 'bg-success/10 text-success' }
}

export function PartsTab() {
  const [query, setQuery] = React.useState('')

  const filtered = partsData.filter((p) => {
    const q = query.toLowerCase()
    return (
      p.description.toLowerCase().includes(q) ||
      p.partNumber.toLowerCase().includes(q) ||
      p.manufacturer.toLowerCase().includes(q)
    )
  })

  const lowStockCount = partsData.filter((p) => p.stock < p.reorderLevel).length

  return (
    <div className="space-y-4 p-4">
      {lowStockCount > 0 && (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="size-5 text-warning" />
            <p className="text-sm">
              <span className="font-medium">{lowStockCount} part(s)</span> below reorder
              level. Consider restocking soon.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search parts by name, number or manufacturer..."
          className="pl-9"
        />
      </div>

      {/* Desktop table */}
      <Card className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Compatible Models</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Reorder</TableHead>
              <TableHead className="text-right">Est. Cost</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((part) => {
              const state = stockState(part)
              return (
                <TableRow key={part.partNumber}>
                  <TableCell>
                    <div className="font-medium">{part.description}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {part.partNumber}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{part.manufacturer}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {part.compatibleModels.map((m) => (
                        <Badge key={m} variant="secondary" className="text-[10px] font-normal">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={cn('tabular-nums', state.className)}>
                      {part.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                    {part.reorderLevel}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    ${part.estimatedCost.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm">{part.supplier}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={part.stock >= part.reorderLevel}
                    >
                      <ShoppingCart className="size-4" />
                      <span className="sr-only">Order</span>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((part) => {
          const state = stockState(part)
          return (
            <Card key={part.partNumber}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">{part.description}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {part.partNumber}
                    </p>
                  </div>
                  <Badge className={state.className}>{state.label}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Manufacturer</p>
                    <p>{part.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Supplier</p>
                    <p>{part.supplier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock / Reorder</p>
                    <p className="tabular-nums">
                      {part.stock} / {part.reorderLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Est. Cost</p>
                    <p className="tabular-nums">${part.estimatedCost.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {part.compatibleModels.map((m) => (
                    <Badge key={m} variant="secondary" className="text-[10px] font-normal">
                      {m}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <Package className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No parts match your search.</p>
        </div>
      )}
    </div>
  )
}
