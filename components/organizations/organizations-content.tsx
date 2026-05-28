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
  Settings2,
  Trash2,
  User,
  Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Mock organization data
const organizations = [
  {
    id: 'ORG-001',
    name: 'Central Hospital',
    type: 'Hospital',
    contractType: 'Full Service',
    equipment: 438,
    contacts: 12,
    location: 'New York, NY',
    phone: '+1 (555) 123-4567',
    email: 'admin@centralhospital.com',
    status: 'active',
  },
  {
    id: 'ORG-002',
    name: 'Regional Medical Center',
    type: 'Hospital',
    contractType: 'Full Service',
    equipment: 616,
    contacts: 18,
    location: 'Los Angeles, CA',
    phone: '+1 (555) 234-5678',
    email: 'info@regionalmed.com',
    status: 'active',
  },
  {
    id: 'ORG-003',
    name: 'City Clinic',
    type: 'Clinic',
    contractType: 'Preventive Only',
    equipment: 291,
    contacts: 6,
    location: 'Chicago, IL',
    phone: '+1 (555) 345-6789',
    email: 'contact@cityclinic.com',
    status: 'active',
  },
  {
    id: 'ORG-004',
    name: 'Emergency Center',
    type: 'Emergency',
    contractType: 'Full Service',
    equipment: 275,
    contacts: 8,
    location: 'Houston, TX',
    phone: '+1 (555) 456-7890',
    email: 'ops@emergencycenter.com',
    status: 'active',
  },
]

const contacts = [
  { name: 'Dr. Sarah Johnson', role: 'Chief Medical Officer', org: 'Central Hospital', email: 'sjohnson@centralhospital.com', phone: '+1 (555) 111-1111' },
  { name: 'Mike Chen', role: 'Biomedical Director', org: 'Regional Medical Center', email: 'mchen@regionalmed.com', phone: '+1 (555) 222-2222' },
  { name: 'Emily Davis', role: 'Operations Manager', org: 'City Clinic', email: 'edavis@cityclinic.com', phone: '+1 (555) 333-3333' },
  { name: 'James Wilson', role: 'Technical Lead', org: 'Emergency Center', email: 'jwilson@emergencycenter.com', phone: '+1 (555) 444-4444' },
]

export function OrganizationsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Organizations</h1>
          <p className="text-muted-foreground">
            Manage hospitals, clinics, and service contracts
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
                <p className="text-2xl font-semibold">{organizations.length}</p>
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
                <p className="text-2xl font-semibold">12</p>
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
                <p className="text-2xl font-semibold">{contacts.length}</p>
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
                <p className="text-2xl font-semibold">4</p>
                <p className="text-xs text-muted-foreground">Regions</p>
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
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search organizations..." className="pl-9" />
            </div>
          </div>

          {/* Organizations Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <Card key={org.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="size-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{org.name}</CardTitle>
                        <CardDescription>{org.type}</CardDescription>
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
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    <span>{org.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="size-4" />
                    <span>{org.phone}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="secondary">{org.contractType}</Badge>
                    <span className="text-sm text-muted-foreground">{org.equipment} equipment</span>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{contact.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{contact.role}</TableCell>
                      <TableCell>{contact.org}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
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
              <CardDescription>Active contracts and SLA agreements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organizations.map((org) => (
                  <div key={org.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-sm text-muted-foreground">{org.equipment} equipment covered</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge>{org.contractType}</Badge>
                      <Button variant="ghost" size="sm">
                        View Contract
                        <ChevronRight className="ml-1 size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
