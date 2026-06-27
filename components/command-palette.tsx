'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard,
  Package,
  FileText,
  History,
  Briefcase,
  MessageSquareText,
  ClipboardList,
  Calendar,
  Wrench,
  Building2,
  Settings,
  Shield,
  HardHat,
  Moon,
  Sun,
  Activity,
  Stethoscope,
  HeartPulse,
  Cpu,
} from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

type Item = {
  label: string
  icon: React.ElementType
  href?: string
  keywords?: string
  action?: () => void
}

// Representative searchable equipment records (mirrors the inventory mock data)
const equipmentIndex = [
  { id: 'EQ-1042', name: 'Ventilator V60', icon: HeartPulse, location: 'ICU - Central Hospital' },
  { id: 'EQ-2087', name: 'MRI Scanner 3T', icon: Cpu, location: 'Radiology - Central Hospital' },
  { id: 'EQ-3391', name: 'Patient Monitor B450', icon: Activity, location: 'ER - Central Hospital' },
  { id: 'EQ-4410', name: 'Infusion Pump Plum 360', icon: Stethoscope, location: 'Oncology - North Clinic' },
  { id: 'EQ-5523', name: 'Defibrillator LIFEPAK 20', icon: HeartPulse, location: 'ICU - North Clinic' },
]

export function CommandPalette({ role }: { role: 'SUPERVISOR' | 'ENGINEER' }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Allow other components (e.g. the topbar search) to open the palette
  React.useEffect(() => {
    const openHandler = () => setOpen(true)
    window.addEventListener('open-command-palette', openHandler)
    return () => window.removeEventListener('open-command-palette', openHandler)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const navItems: Item[] =
    role === 'SUPERVISOR'
      ? [
          { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
          { label: 'Inventory', icon: Package, href: '/inventory', keywords: 'equipment assets' },
          { label: 'Service Orders', icon: FileText, href: '/service-orders', keywords: 'work orders tickets' },
          { label: 'Technical History', icon: History, href: '/history', keywords: 'logs records' },
          { label: 'Contracts', icon: Briefcase, href: '/contracts', keywords: 'sla agreements' },
          { label: 'AI Assistant', icon: MessageSquareText, href: '/chat', keywords: 'chat support' },
          { label: 'Organizations', icon: Building2, href: '/organizations', keywords: 'hospitals clients' },
          { label: 'Settings', icon: Settings, href: '/settings', keywords: 'preferences config' },
        ]
      : [
          { label: 'My Services', icon: ClipboardList, href: '/engineer', keywords: 'tasks jobs assignments' },
          { label: 'Weekly Calendar', icon: Calendar, href: '/engineer/calendar', keywords: 'schedule agenda' },
          { label: 'Equipment', icon: Package, href: '/inventory', keywords: 'assets devices' },
          { label: 'AI Assistant', icon: MessageSquareText, href: '/chat', keywords: 'chat support' },
          { label: 'Troubleshooting', icon: Wrench, href: '/troubleshooting', keywords: 'repair fix diagnose' },
        ]

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, equipment, or run a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem
              key={item.href}
              value={`${item.label} ${item.keywords ?? ''}`}
              onSelect={() => runCommand(() => router.push(item.href!))}
            >
              <item.icon className="mr-2 size-4 text-muted-foreground" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Equipment">
          {equipmentIndex.map((eq) => (
            <CommandItem
              key={eq.id}
              value={`${eq.id} ${eq.name} ${eq.location}`}
              onSelect={() => runCommand(() => router.push(`/equipment/${eq.id}`))}
            >
              <eq.icon className="mr-2 size-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span>{eq.name}</span>
                <span className="text-xs text-muted-foreground">
                  {eq.id} · {eq.location}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem
            value="theme light mode"
            onSelect={() => runCommand(() => setTheme('light'))}
          >
            <Sun className="mr-2 size-4 text-muted-foreground" />
            <span>Light mode</span>
          </CommandItem>
          <CommandItem
            value="theme dark mode"
            onSelect={() => runCommand(() => setTheme('dark'))}
          >
            <Moon className="mr-2 size-4 text-muted-foreground" />
            <span>Dark mode</span>
            <CommandShortcut>⌘K to reopen</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
