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
  Users,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import {
  customerOrganizations,
  customerTypeConfig,
  contracts,
  getPmPlansForContract,
} from '@/lib/contract-data'

// Flatten contacts across organizations for the Contacts tab.
const allContacts = customerOrganizations.flatMap((org) =>
  org.contacts.map((c) => ({ ...c, org: org.name })),
)

const activeContractCount = contracts.filter((c) => c.status !== 'expired').length

export function OrganizationsContent() {
  const [search, setSearch] = React.useState('')

  const filteredOrgs = customerOrganizations.filter(
    (org) =>
      !search ||
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.type.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Customer Organizations
          </h1>
          <p className="text-muted-foreground">
            Hospitals, clinics, government and distributors that hold service
            contracts.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Add Organization
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Building2 className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">
                  {customerOrganizations.length}
                </p>
                <p className="text-xs text-muted-foreground">Organizations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <FileText className="size-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">
                  {activeContractCount}
                </p>
                <p className="text-xs text-muted-foreground">Active Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Users className="size-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">
                  {allContacts.length}
                </p>
                <p className="text-xs text-muted-foreground">Contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <Globe className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">
                  {new Set(customerOrganizations.map((o) => o.type)).size}
                </p>
                <p className="text-xs text-muted-foreground">Customer Types</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="organizations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrgs.map((org) => {
              const typeMeta = customerTypeConfig[org.type]
              const orgContracts = contracts.filter((c) => c.customerId === org.id)
              return (
                <Card
                  key={org.id}
                  className="cursor-pointer transition-colors hover:border-primary/50"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="size-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{org.name}</CardTitle>
                          <CardDescription>
                            <Badge className={typeMeta.className}>
                              {typeMeta.label}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-4 shrink-0" />
                      <span>
                        {org.address}, {org.city}
                      </span>
                    </div>
                    {org.contacts[0] && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="size-4 shrink-0" />
                        <span>{org.contacts[0].phone}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="text-sm text-muted-foreground">
                        {orgContracts.length} contract
                        {orgContracts.length === 1 ? '' : 's'}
                      </span>
                      <span className="text-sm font-medium tabular-nums">
                        {org.equipmentCount} equipment
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {contact.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{contact.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{contact.role}</TableCell>
                      <TableCell>{contact.org}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="size-3.5" />
                          {contact.email}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {contact.phone}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Service Contracts</CardTitle>
              <CardDescription>
                Contracts define the maintenance obligations for each customer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contracts.map((contract) => {
                  const planCount = getPmPlansForContract(contract.id).length
                  return (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="size-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{contract.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {contract.contractNumber} · {planCount} PM plan
                            {planCount === 1 ? '' : 's'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{contract.coverageType}</Badge>
                        <Button variant="ghost" size="sm">
                          View
                          <ChevronRight className="ml-1 size-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
