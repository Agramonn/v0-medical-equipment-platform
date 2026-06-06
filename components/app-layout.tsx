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
  ChevronDown,
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
  CheckSquare,
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'
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
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Role context
type UserRole = 'supervisor' | 'engineer'

const RoleContext = React.createContext<{
  role: UserRole
  setRole: (role: UserRole) => void
}>({
  role: 'supervisor',
  setRole: () => {},
})

export function useRole() {
  return React.useContext(RoleContext)
}

// Navigation items for Supervisor
const supervisorNavItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'Inventory',
    href: '/inventory',
    icon: Package,
    badge: '2,847',
  },
  {
    title: 'Service Orders',
    href: '/service-orders',
    icon: FileText,
    badge: '12',
  },
  {
    title: 'Technical History',
    href: '/history',
    icon: History,
    badge: null,
  },
  {
    title: 'Contracts',
    href: '/contracts',
    icon: Briefcase,
    badge: '3',
  },
  {
    title: 'AI Assistant',
    href: '/chat',
    icon: MessageSquareText,
    badge: null,
  },
]

// Navigation items for Field Engineer
const engineerNavItems = [
  {
    title: 'My Services',
    href: '/engineer',
    icon: ClipboardList,
    badge: '5',
  },
  {
    title: 'Weekly Calendar',
    href: '/engineer/calendar',
    icon: Calendar,
    badge: null,
  },
  {
    title: 'Equipment',
    href: '/inventory',
    icon: Package,
    badge: null,
  },
  {
    title: 'AI Assistant',
    href: '/chat',
    icon: MessageSquareText,
    badge: null,
  },
  {
    title: 'Troubleshooting',
    href: '/troubleshooting',
    icon: Wrench,
    badge: null,
  },
]

const managementNavItems = [
  {
    title: 'Organizations',
    href: '/organizations',
    icon: Building2,
    badge: null,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    badge: null,
  },
]

function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const { role, setRole } = useRole()
  const isCollapsed = state === 'collapsed'

  const navItems = role === 'supervisor' ? supervisorNavItems : engineerNavItems

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={role === 'engineer' ? '/engineer' : '/'} className="flex items-center gap-2">
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

        {/* Role Selector */}
        {!isCollapsed && (
          <div className="px-2 py-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    {role === 'supervisor' ? (
                      <Shield className="size-4 text-primary" />
                    ) : (
                      <HardHat className="size-4 text-warning" />
                    )}
                    <span className="text-sm">
                      {role === 'supervisor' ? 'Supervisor' : 'Field Engineer'}
                    </span>
                  </div>
                  <ChevronDown className="size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setRole('supervisor')}
                  className={cn(role === 'supervisor' && 'bg-accent')}
                >
                  <Shield className="mr-2 size-4 text-primary" />
                  Supervisor
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setRole('engineer')}
                  className={cn(role === 'engineer' && 'bg-accent')}
                >
                  <HardHat className="mr-2 size-4 text-warning" />
                  Field Engineer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === 'supervisor' ? 'Operations' : 'Field Work'}
          </SidebarGroupLabel>
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
                      {item.badge && !isCollapsed && (
                        <Badge
                          variant="secondary"
                          className="ml-auto text-xs font-normal"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {role === 'supervisor' && (
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managementNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
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
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start gap-0.5 leading-none">
                    <span className="font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">
                      {role === 'supervisor' ? 'Supervisor' : 'Biomedical Engineer'}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width]"
              >
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
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function TopBar() {
  const { theme, setTheme } = useTheme()
  const { role } = useRole()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={role === 'supervisor' 
              ? "Search equipment, orders, history..." 
              : "Search equipment, services..."
            }
            className="h-9 w-full pl-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span className="text-xs">Cmd</span>K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {role === 'engineer' && (
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
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

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<UserRole>('supervisor')
  const [isHydrated, setIsHydrated] = React.useState(false)

  // Load role from localStorage on mount
  React.useEffect(() => {
    const savedRole = localStorage.getItem('medequip-role') as UserRole | null
    if (savedRole && (savedRole === 'supervisor' || savedRole === 'engineer')) {
      setRole(savedRole)
    }
    setIsHydrated(true)
  }, [])

  // Save role to localStorage when it changes
  const handleSetRole = React.useCallback((newRole: UserRole) => {
    setRole(newRole)
    localStorage.setItem('medequip-role', newRole)
  }, [])

  // Prevent hydration mismatch by not rendering until client-side
  if (!isHydrated) {
    return null
  }

  return (
    <RoleContext.Provider value={{ role, setRole: handleSetRole }}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopBar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </RoleContext.Provider>
  )
}
