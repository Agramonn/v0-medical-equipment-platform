'use client'

import * as React from 'react'
import {
  Building2,
  FileText,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  Users,
  Wrench,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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
import { OrganizationWithRelations } from '@/app/organizations/page'
import { createContact, deleteContact } from '@/lib/actions/organizations'

const typeConfig: Record<string, { label: string; className: string }> = {
  IMSS: { label: 'IMSS', className: 'bg-blue-500/10 text-blue-500' },
  ISSSTE: { label: 'ISSSTE', className: 'bg-purple-500/10 text-purple-500' },
  SEDENA: { label: 'SEDENA', className: 'bg-green-700/10 text-green-700' },
  PEMEX: { label: 'PEMEX', className: 'bg-red-500/10 text-red-500' },
  STATE_HOSPITAL: { label: 'State Hospital', className: 'bg-primary/10 text-primary' },
  PRIVATE_HOSPITAL: { label: 'Private Hospital', className: 'bg-warning/10 text-warning' },
  CLINIC: { label: 'Clinic', className: 'bg-success/10 text-success' },
  LABORATORY: { label: 'Laboratory', className: 'bg-muted text-muted-foreground' },
  DISTRIBUTOR: { label: 'Distributor', className: 'bg-secondary text-secondary-foreground' },
}

const contractTypeLabels: Record<string, string> = {
  PUBLIC_BID: 'Public Bid',
  DIRECT_AWARD: 'Direct Award',
  LIMITED_TENDER: 'Limited Tender',
  LOAN_AGREEMENT: 'Loan Agreement',
  PRIVATE: 'Private',
}

export function OrganizationDetailSheet({
  organization,
  open,
  onOpenChange,
  onDelete,
}: {
  organization: OrganizationWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (org: OrganizationWithRelations) => void
}) {
  const [showAddContact, setShowAddContact] = React.useState(false)
  const [contactName, setContactName] = React.useState('')
  const [contactRole, setContactRole] = React.useState('')
  const [contactEmail, setContactEmail] = React.useState('')
  const [contactPhone, setContactPhone] = React.useState('')
  const [contactPrimary, setContactPrimary] = React.useState(false)
  const [isSavingContact, setIsSavingContact] = React.useState(false)
  const [contactToDelete, setContactToDelete] = React.useState<string | null>(null)
  const [isDeletingContact, setIsDeletingContact] = React.useState(false)

  if (!organization) return null

  const meta = typeConfig[organization.type] ?? { label: organization.type, className: 'bg-muted text-muted-foreground' }
  const activeContracts = organization.contracts.filter((c) => c.status === 'ACTIVE').length

  function resetContactForm() {
    setContactName('')
    setContactRole('')
    setContactEmail('')
    setContactPhone('')
    setContactPrimary(false)
    setShowAddContact(false)
  }

  async function handleAddContact() {
    if (!contactName || !contactRole) return
    setIsSavingContact(true)
    try {
      await createContact(organization!.id, {
        name: contactName,
        role: contactRole,
        email: contactEmail || undefined,
        phone: contactPhone || undefined,
        isPrimary: contactPrimary,
      })
      resetContactForm()
      onOpenChange(false)
    } finally {
      setIsSavingContact(false)
    }
  }

  async function handleDeleteContact() {
    if (!contactToDelete) return
    setIsDeletingContact(true)
    try {
      await deleteContact(contactToDelete)
      setContactToDelete(null)
      onOpenChange(false)
    } finally {
      setIsDeletingContact(false)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-xl">
          <SheetHeader className="shrink-0 border-b p-6 pb-4">
            <div className="flex items-start gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="size-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg leading-snug">{organization.name}</SheetTitle>
                <SheetDescription className="mt-1">
                  <Badge className={meta.className}>{meta.label}</Badge>
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-5 p-6">

              {/* General info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">General Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="divide-y divide-border text-sm">
                    {organization.address && (
                      <div className="flex items-center gap-2 py-2.5">
                        <MapPin className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground mr-2">Address</span>
                        <span className="ml-auto text-right">
                          {organization.address}, {organization.city}, {organization.state}
                        </span>
                      </div>
                    )}
                    {!organization.address && (
                      <div className="flex items-center gap-2 py-2.5">
                        <MapPin className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Location</span>
                        <span className="ml-auto">{organization.city}, {organization.state}</span>
                      </div>
                    )}
                    {organization.phone && (
                      <div className="flex items-center gap-2 py-2.5">
                        <Phone className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Phone</span>
                        <span className="ml-auto">{organization.phone}</span>
                      </div>
                    )}
                    {organization.email && (
                      <div className="flex items-center gap-2 py-2.5">
                        <Mail className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Email</span>
                        <span className="ml-auto">{organization.email}</span>
                      </div>
                    )}
                    {organization.website && (
                      <div className="flex items-center gap-2 py-2.5">
                        <Globe className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Website</span>
                        <span className="ml-auto">{organization.website}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 py-2.5">
                      <Wrench className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Equipment</span>
                      <span className="ml-auto font-medium">{organization._count.equipment} units</span>
                    </div>
                    <div className="flex items-center gap-2 py-2.5">
                      <FileText className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Active Contracts</span>
                      <span className="ml-auto font-medium">{activeContracts}</span>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Contacts */}
              <Card>
                <CardHeader className="flex-row items-center justify-between pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Users className="size-4" />
                    Contacts ({organization.contacts.length})
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddContact((v) => !v)}
                  >
                    <Plus className="mr-1 size-3" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {showAddContact && (
                    <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Name *</Label>
                          <Input
                            className="h-8 text-xs"
                            placeholder="Dr. Juan Pérez"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Role *</Label>
                          <Input
                            className="h-8 text-xs"
                            placeholder="Biomedical Engineer"
                            value={contactRole}
                            onChange={(e) => setContactRole(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Email</Label>
                          <Input
                            className="h-8 text-xs"
                            type="email"
                            placeholder="juan@hospital.mx"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Phone</Label>
                          <Input
                            className="h-8 text-xs"
                            placeholder="55 1234 5678"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <Checkbox
                          checked={contactPrimary}
                          onCheckedChange={(v) => setContactPrimary(v === true)}
                        />
                        Set as primary contact
                      </label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleAddContact}
                          disabled={!contactName || !contactRole || isSavingContact}
                        >
                          {isSavingContact && <Loader2 className="mr-2 size-3 animate-spin" />}
                          Save Contact
                        </Button>
                        <Button size="sm" variant="ghost" onClick={resetContactForm}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {organization.contacts.length === 0 && !showAddContact && (
                    <p className="text-sm text-muted-foreground py-2">
                      No contacts yet. Add one above.
                    </p>
                  )}

                  {organization.contacts.map((contact) => (
                    <div key={contact.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                          <span className="text-xs font-medium text-primary">
                            {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{contact.name}</p>
                            {contact.isPrimary && (
                              <Badge variant="secondary" className="text-xs">Primary</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{contact.role}</p>
                          {contact.email && (
                            <p className="text-xs text-muted-foreground">{contact.email}</p>
                          )}
                          {contact.phone && (
                            <p className="text-xs text-muted-foreground">{contact.phone}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive shrink-0"
                        onClick={() => setContactToDelete(contact.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contracts */}
              {organization.contracts.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="size-4" />
                      Contracts ({organization.contracts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {organization.contracts.map((contract) => (
                      <div key={contract.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                        <div>
                          <p className="text-sm font-mono font-medium">{contract.contractNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {contractTypeLabels[contract.type] ?? contract.type} ·
                            Exp. {new Date(contract.endDate).toLocaleDateString('en-US')}
                          </p>
                        </div>
                        <Badge className={
                          contract.status === 'ACTIVE'
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }>
                          {contract.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>

          {/* Footer actions */}
          <div className="shrink-0 border-t bg-muted/30 p-4">
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              onClick={() => onDelete(organization)}
            >
              <Trash2 className="mr-2 size-4" />
              Delete Organization
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Contact delete confirmation */}
      <AlertDialog open={!!contactToDelete} onOpenChange={(o) => { if (!o) setContactToDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this contact?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingContact}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContact}
              disabled={isDeletingContact}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingContact ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}