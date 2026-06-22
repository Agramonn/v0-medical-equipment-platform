'use client'

import * as React from 'react'
import {
  Bell,
  Building2,
  Check,
  Globe,
  Key,
  Moon,
  Palette,
  Shield,
  Sun,
  User,
  Users,
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function SettingsContent() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Information</CardTitle>
              <CardDescription>Update your personal details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="size-20">
                  <AvatarImage src="/avatars/engineer.jpg" />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@medequip.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="engineer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="engineer">Biomedical Engineer</SelectItem>
                      <SelectItem value="technician">Service Technician</SelectItem>
                      <SelectItem value="manager">Technical Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appearance</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors',
                      theme === 'light' ? 'border-primary' : 'border-transparent hover:border-muted'
                    )}
                  >
                    <div className="rounded-lg bg-[#f8fafc] p-3 border">
                      <Sun className="size-6 text-[#0f172a]" />
                    </div>
                    <span className="text-sm font-medium">Light</span>
                    {theme === 'light' && <Check className="size-4 text-primary" />}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors',
                      theme === 'dark' ? 'border-primary' : 'border-transparent hover:border-muted'
                    )}
                  >
                    <div className="rounded-lg bg-[#0f172a] p-3 border border-[#1e293b]">
                      <Moon className="size-6 text-[#f8fafc]" />
                    </div>
                    <span className="text-sm font-medium">Dark</span>
                    {theme === 'dark' && <Check className="size-4 text-primary" />}
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors',
                      theme === 'system' ? 'border-primary' : 'border-transparent hover:border-muted'
                    )}
                  >
                    <div className="rounded-lg bg-gradient-to-br from-[#f8fafc] to-[#0f172a] p-3 border">
                      <Palette className="size-6 text-[#64748b]" />
                    </div>
                    <span className="text-sm font-medium">System</span>
                    {theme === 'system' && <Check className="size-4 text-primary" />}
                  </button>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <Label>Language & Region</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm text-muted-foreground">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-sm text-muted-foreground">Timezone</Label>
                    <Select defaultValue="est">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="est">Eastern Time (ET)</SelectItem>
                        <SelectItem value="cst">Central Time (CT)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: 'critical', label: 'Critical Alerts', description: 'Equipment failures and urgent issues', defaultChecked: true },
                { id: 'maintenance', label: 'Maintenance Reminders', description: 'Upcoming preventive maintenance schedules', defaultChecked: true },
                { id: 'orders', label: 'Service Order Updates', description: 'Status changes on assigned orders', defaultChecked: true },
                { id: 'inventory', label: 'Inventory Alerts', description: 'Low stock and parts availability', defaultChecked: false },
                { id: 'reports', label: 'Weekly Reports', description: 'Summary of activities and metrics', defaultChecked: true },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={item.id}>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch id={item.id} defaultChecked={item.defaultChecked} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security Settings</CardTitle>
              <CardDescription>Manage your password and account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Change Password</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm text-muted-foreground">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div></div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm text-muted-foreground">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                <Button>Update Password</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active Sessions</Label>
                  <p className="text-sm text-muted-foreground">Manage devices where you are logged in</p>
                </div>
                <Button variant="outline">View Sessions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Members</CardTitle>
              <CardDescription>Manage your team and their access levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'John Doe', email: 'john.doe@medequip.com', role: 'Admin', status: 'Active' },
                { name: 'Jane Smith', email: 'jane.smith@medequip.com', role: 'Engineer', status: 'Active' },
                { name: 'Mike Johnson', email: 'mike.johnson@medequip.com', role: 'Technician', status: 'Active' },
              ].map((member) => (
                <div key={member.email} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Select defaultValue={member.role.toLowerCase()}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="engineer">Engineer</SelectItem>
                        <SelectItem value="technician">Technician</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Users className="mr-2 size-4" />
                Invite Team Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
