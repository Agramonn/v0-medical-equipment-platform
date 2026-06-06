'use client'

import * as React from 'react'
import { CheckCircle2, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { equipmentData } from '@/lib/equipment-data'

type ServiceOrderType =
  | 'Preventive'
  | 'Corrective'
  | 'Calibration'
  | 'Inspection'
  | 'Installation'

// Read-only equipment fields auto-populated when creating a service order
// directly from an equipment record. The engineer only fills service-specific
// information.
const inheritedFields: { label: string; value: string; mono?: boolean }[] = [
  { label: 'Equipment Name', value: equipmentData.name },
  { label: 'Manufacturer', value: equipmentData.manufacturer },
  { label: 'Model', value: equipmentData.model },
  { label: 'Serial Number', value: equipmentData.serialNumber, mono: true },
  { label: 'Asset Number', value: equipmentData.assetNumber, mono: true },
  { label: 'Department', value: equipmentData.department },
  { label: 'Location', value: equipmentData.location },
]

export function CreateServiceOrderFromEquipmentDialog({
  type,
  trigger,
}: {
  type: ServiceOrderType
  trigger: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setOpen(false)
    toast.success(`${type} service order created`, {
      description: `New ${type.toLowerCase()} service order for ${equipmentData.name}.`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Create {type} Service Order
          </DialogTitle>
          <DialogDescription>
            Equipment details are pre-filled. Complete the service-specific
            information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Auto-populated equipment context */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Auto-filled from equipment
                </p>
                <Badge variant="outline">{type}</Badge>
              </div>
              <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {inheritedFields.map((field) => (
                  <div key={field.label} className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">{field.label}</p>
                    <p
                      className={
                        field.mono ? 'font-mono text-sm' : 'text-sm font-medium'
                      }
                    >
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service-specific fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="so-date">Scheduled Date</Label>
              <Input id="so-date" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Assign Engineer</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select engineer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="John Doe">John Doe</SelectItem>
                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="so-description">Service Description</Label>
            <Textarea
              id="so-description"
              placeholder={`Describe the ${type.toLowerCase()} work to be performed...`}
              className="min-h-[100px]"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <CheckCircle2 className="mr-2 size-4" />
              Create Service Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
