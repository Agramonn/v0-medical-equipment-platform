'use client'

import * as React from 'react'
import {
  Building2,
  ChevronRight,
  FileText,
  Globe,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
  Wrench,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { OrganizationWithRelations } from '@/app/organizations/page'
import { AddOrganizationDialog } from './add-organization-content'
import { OrganizationDetailSheet } from './organization-detail-sheet'
import { deleteOrganization } from '@/lib/actions/organizations'

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

export function OrganizationsContent({
  organizations,
}: {
  organizations: OrganizationWithRelations[]
}) {
  const [search, setSearch] = React.useState('')
  const [addOpen, setAddOpen] = React.useState(false)
  const [activeOrg, setActiveOrg] = React.useState<OrganizationWithRelations | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [orgToDelete, setOrgToDelete] = React.useState<OrganizationWithRelations | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const filteredOrgs = organizations.filter(
    (org) =>
      !search ||
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.city.toLowerCase().includes(search.toLowerCase()) ||
      org.type.toLowerCase().includes(search.toLowerCase())
  )

  const allContacts = organizations.flatMap((org) =>
    org.contacts.map((c) => ({ ...c, orgName: org.name }))
  )

  const allContracts = organizations.flatMap((org) =>
    org.contracts.map((c) => ({ ...c, orgName: org.name }))
  )

  const activeContracts = allContracts.filter((c) => c.status === 'ACTIVE').length

  const stats = [
    {
      label: 'Organizations',
      value: organizations.length,
      Icon: Building2,
      className: 'bg-primary/10 text-primary',
    },
    {
      label: 'Active Contracts',
      value: activeContracts,
      Icon: FileText,
      className: 'bg-success/10 text-success',
    },
    {
      label: 'Contacts',
      value: allContacts.length,
      Icon: Users,
      className: 'bg-warning/10 text-warning',
    },
    {
      label: 'Customer Types',
      value: new Set(organizations.map((o) => o.type)).size,
      Icon: Globe,
      className: 'bg-muted text-muted-foreground',
    },
  ]

  async function handleDelete() {
    if (!orgToDelete) return
    setIsDeleting(true)
    try {
      await deleteOrganization(orgToDelete.id)
      setOrgToDelete(null)
    } catch (e) {
      console.error(e)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Customer Organizations
          </h1>
          <p className="text-muted-foreground">
            Hospitals, clinics, government and distributors that hold service contracts.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Organization
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${stat.className}`}>
                  <stat.Icon className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="organizations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organizations">
            Organizations ({organizations.length})
          </TabsTrigger>
          <TabsTrigger value="contacts">
            Contacts ({allContacts.length})
          </TabsTrigger>
          <TabsTrigger value="contracts">
            Contracts ({allContracts.length})
          </TabsTrigger>
        </TabsList>

        {/* ── Tab: Organizations ── */}
        <TabsContent value="organizations" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, city or type..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredOrgs.length === 0 && (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <Building2 className="mx-auto mb-3 size-8 text-muted-foreground" />
              <p className="text-sm font-medium">No organizations found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {search ? 'Try a different search term.' : 'Add your first organization.'}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrgs.map((org) => {
              const meta = typeConfig[org.type] ?? { label: org.type, className: 'bg-muted text-muted-foreground' }
              const primaryContact = org.contacts.find((c) => c.isPrimary) ?? org.contacts[0]
              const activeOrgContracts = org.contracts.filter((c) => c.status === 'ACTIVE').length

              return (
                <Card
                  key={org.id}
                  className="cursor-pointer transition-colors hover:border-primary/50"
                  onClick={() => {
                    setActiveOrg(org)
                    setDetailOpen(true)
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="size-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base leading-snug">
                            {org.name}
                          </CardTitle>
                          <Badge className={`mt-1 ${meta.className}`}>
                            {meta.label}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            setActiveOrg(org)
                            setDetailOpen(true)
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              setOrgToDelete(org)
                            }}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      <span className="truncate">
                        {org.address ? `${org.address}, ` : ''}{org.city}, {org.state}
                      </span>
                    </div>
                    {primaryContact?.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="size-3.5 shrink-0" />
                        <span>{primaryContact.phone}</span>
                      </div>
                    )}
                    {org.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="size-3.5 shrink-0" />
                        <span className="truncate">{org.email}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t pt-3 text-sm">
                      <span className="text-muted-foreground">
                        {activeOrgContracts} active contract{activeOrgContracts !== 1 ? 's' : ''}
                      </span>
                      <span className="font-medium">
                        {org._count.equipment} equipment
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ── Tab: Contacts ── */}
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Primary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{contact.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {contact.role}
                      </TableCell>
                      <TableCell className="text-sm">{contact.orgName}</TableCell>
                      <TableCell>
                        {contact.email ? (
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Mail className="size-3.5" />
                            {contact.email}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {contact.phone ?? '—'}
                      </TableCell>
                      <TableCell>
                        {contact.isPrimary && (
                          <Badge variant="secondary" className="text-xs">Primary</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {allContacts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                        No contacts recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Contracts ── */}
        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Service Contracts</CardTitle>
              <CardDescription>
                Contracts define the maintenance obligations for each customer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {allContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{contract.orgName}</p>
                      <p className="text-sm text-muted-foreground">
                        {contract.contractNumber} ·{' '}
                        {contractTypeLabels[contract.type] ?? contract.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        contract.status === 'ACTIVE'
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {contract.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Exp. {new Date(contract.endDate).toLocaleDateString('en-US')}
                    </span>
                  </div>
                </div>
              ))}
              {allContracts.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No contracts found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddOrganizationDialog open={addOpen} onOpenChange={setAddOpen} />

      <OrganizationDetailSheet
        organization={activeOrg}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDelete={(org) => {
          setDetailOpen(false)
          setOrgToDelete(org)
        }}
      />

      <AlertDialog open={!!orgToDelete} onOpenChange={(o) => { if (!o) setOrgToDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {orgToDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this organization and all its contacts.
              Equipment and contracts must be reassigned or deleted first.
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