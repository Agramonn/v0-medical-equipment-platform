'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  MessageSquareText,
  FileText,
  History,
  Wrench,
  Building2,
  Settings,
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  User,
  HelpCircle,
  Activity,
  Calendar,
  ClipboardList,
  Shield,
  HardHat,
  MapPin,
  Briefcase,
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CommandPalette } from '@/components/command-palette'
import { logoutAction } from '@/lib/actions/auth'

type SessionUser = {
  id: string
  name: string | null
  email: string | null
  role: 'SUPERVISOR' | 'ENGINEER'
}

const supervisorNavItems = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard, badge: null },
  { title: 'Inventory', href: '/inventory', icon: Package, badge: null },
  { title: 'Service Orders', href: '/service-orders', icon: FileText, badge: null },
  { title: 'Technical History', href: '/history', icon: History, badge: null },
  { title: 'Contracts', href: '/contracts', icon: Briefcase, badge: null },
  { title: 'AI Assistant', href: '/chat', icon: MessageSquareText, badge: null },
]

const engineerNavItems = [
  { title: 'My Services', href: '/engineer', icon: ClipboardList, badge: null },
  { title: 'Weekly Calendar', href: '/engineer/calendar', icon: Calendar, badge: null },
  { title: 'Equipment', href: '/inventory', icon: Package, badge: null },
  { title: 'AI Assistant', href: '/chat', icon: MessageSquareText, badge: null },
  { title: 'Troubleshooting', href: '/troubleshooting', icon: Wrench, badge: null },
]

const managementNavItems = [
  { title: 'Organizations', href: '/organizations', icon: Building2, badge: null },
  { title: 'Settings', href: '/settings', icon: Settings, badge: null },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function AppSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const isSupervisor = user.role === 'SUPERVISOR'

  const navItems = isSupervisor ? supervisorNavItems : engineerNavItems

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={isSupervisor ? '/' : '/engineer'} className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Activity className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">BioSupp</span>
                  <span className="text-xs text-muted-foreground">v0.0.1</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Role indicator (read-only — defined by the signed-in account) */}
        {!isCollapsed && (
          <div className="px-2 py-2">
            <div className="flex w-full items-center gap-2 rounded-md border px-3 py-1.5">
              {isSupervisor ? (
                <Shield className="size-4 text-primary" />
              ) : (
                <HardHat className="size-4 text-warning" />
              )}
              <span className="text-sm">
                {isSupervisor ? 'Supervisor' : 'Field Engineer'}
              </span>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{isSupervisor ? 'Operations' : 'Field Work'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isSupervisor && (
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managementNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="w-full">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name ? initials(user.name) : 'N/A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start gap-0.5 leading-none">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {isSupervisor ? 'Supervisor' : 'Biomedical Engineer'}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 size-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={logoutAction}>
                  <button type="submit" className="flex w-full items-center px-2 py-1.5 text-sm text-destructive hover:bg-accent rounded-sm">
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function TopBar({ user }: { user: SessionUser }) {
  const { theme, setTheme } = useTheme()
  const isSupervisor = user.role === 'SUPERVISOR'

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <div className="h-5 w-px bg-border" aria-hidden="true" />

      <div className="flex flex-1 items-center gap-4">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
          className="group relative flex h-9 max-w-md flex-1 items-center rounded-lg border border-border/60 bg-muted/40 pl-9 pr-3 text-left text-sm text-muted-foreground shadow-xs transition-colors hover:border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <span className="truncate">
            {isSupervisor ? 'Search equipment, orders, history...' : 'Search equipment, services...'}
          </span>
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-0.5 rounded border border-border/60 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-xs sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {!isSupervisor && (
          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5">
            <MapPin className="size-3" />
            Central Hospital
          </Badge>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-4" />
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  3
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>3 new notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle theme</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}

export function AppLayout({
  children,
  user,
}: {
  children: React.ReactNode
  user: SessionUser
}) {
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <TopBar user={user} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
      <CommandPalette role={user.role} />
    </SidebarProvider>
  )
}