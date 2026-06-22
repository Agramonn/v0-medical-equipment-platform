'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Cloud,
  CloudOff,
  Download,
  FileText,
  HardDrive,
  Package,
  RefreshCw,
  Trash2,
  Wifi,
  WifiOff,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// Mock offline data
const downloadedPackages = [
  {
    id: 'PKG-001',
    name: 'Central Hospital - Today',
    services: 3,
    equipment: 3,
    manuals: 5,
    size: '45.2 MB',
    downloadedAt: '2024-02-27 08:30 AM',
    status: 'current',
  },
  {
    id: 'PKG-002',
    name: 'Emergency Center Services',
    services: 2,
    equipment: 2,
    manuals: 3,
    size: '28.7 MB',
    downloadedAt: '2024-02-26 09:15 AM',
    status: 'outdated',
  },
]

const availablePackages = [
  {
    id: 'PKG-003',
    name: 'Tomorrow Services Package',
    services: 4,
    equipment: 4,
    manuals: 8,
    estimatedSize: '52.3 MB',
  },
  {
    id: 'PKG-004',
    name: 'Regional Medical Center',
    services: 5,
    equipment: 5,
    manuals: 10,
    estimatedSize: '68.1 MB',
  },
]

const offlineSettings = {
  autoDownload: true,
  downloadManuals: true,
  downloadHistory: true,
  downloadTroubleshooting: true,
  syncOnWifi: true,
}

export function OfflineContent() {
  const [isOnline, setIsOnline] = React.useState(true)
  const [downloading, setDownloading] = React.useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = React.useState(0)
  const [settings, setSettings] = React.useState(offlineSettings)
  const [syncing, setSyncing] = React.useState(false)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleDownload = (packageId: string) => {
    setDownloading(packageId)
    setDownloadProgress(0)
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setDownloading(null)
          return 0
        }
        return prev + 10
      })
    }, 200)
  }

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2000)
  }

  const totalStorage = downloadedPackages.reduce((acc, pkg) => {
    return acc + parseFloat(pkg.size)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/engineer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Offline Mode</h1>
            <p className="text-muted-foreground">
              Manage offline data and sync settings
            </p>
          </div>
        </div>
        <Badge 
          variant={isOnline ? 'default' : 'destructive'}
          className="flex items-center gap-1.5"
        >
          {isOnline ? (
            <>
              <Wifi className="size-3" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="size-3" />
              Offline
            </>
          )}
        </Badge>
      </div>

      {/* Connection Status Card */}
      <Card className={cn(
        isOnline ? 'border-success/50 bg-success/5' : 'border-destructive/50 bg-destructive/5'
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isOnline ? (
                <Cloud className="size-8 text-success" />
              ) : (
                <CloudOff className="size-8 text-destructive" />
              )}
              <div>
                <p className="font-medium">
                  {isOnline ? 'Connected to Server' : 'Working Offline'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isOnline 
                    ? 'All data is synced and up to date'
                    : 'Using cached data. Changes will sync when connected.'
                  }
                </p>
              </div>
            </div>
            {isOnline && (
              <Button 
                variant="outline" 
                onClick={handleSync}
                disabled={syncing}
              >
                <RefreshCw className={cn('mr-2 size-4', syncing && 'animate-spin')} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <HardDrive className="size-4" />
              Storage Usage
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {totalStorage.toFixed(1)} MB used
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={(totalStorage / 500) * 100} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            {totalStorage.toFixed(1)} MB of 500 MB available
          </p>
        </CardContent>
      </Card>

      {/* Downloaded Packages */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Downloaded Packages</h2>
        <div className="space-y-3">
          {downloadedPackages.map((pkg) => (
            <Card key={pkg.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{pkg.name}</p>
                      <Badge 
                        variant={pkg.status === 'current' ? 'default' : 'secondary'}
                        className={cn(
                          pkg.status === 'current' && 'bg-success/10 text-success'
                        )}
                      >
                        {pkg.status === 'current' ? 'Current' : 'Outdated'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{pkg.services} services</span>
                      <span>{pkg.equipment} equipment</span>
                      <span>{pkg.manuals} manuals</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Downloaded: {pkg.downloadedAt} - {pkg.size}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {pkg.status === 'outdated' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(pkg.id)}
                        disabled={downloading === pkg.id}
                      >
                        <RefreshCw className={cn(
                          'mr-2 size-4',
                          downloading === pkg.id && 'animate-spin'
                        )} />
                        Update
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Package?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove all offline data for &quot;{pkg.name}&quot;. 
                            You can download it again when connected.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                {downloading === pkg.id && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span>Downloading...</span>
                      <span>{downloadProgress}%</span>
                    </div>
                    <Progress value={downloadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Packages */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available for Download</h2>
        <div className="space-y-3">
          {availablePackages.map((pkg) => (
            <Card key={pkg.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="font-medium">{pkg.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{pkg.services} services</span>
                      <span>{pkg.equipment} equipment</span>
                      <span>{pkg.manuals} manuals</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Estimated size: {pkg.estimatedSize}
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleDownload(pkg.id)}
                    disabled={downloading === pkg.id || !isOnline}
                  >
                    <Download className={cn(
                      'mr-2 size-4',
                      downloading === pkg.id && 'animate-pulse'
                    )} />
                    Download
                  </Button>
                </div>
                {downloading === pkg.id && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span>Downloading...</span>
                      <span>{downloadProgress}%</span>
                    </div>
                    <Progress value={downloadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Offline Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Offline Settings</CardTitle>
          <CardDescription>
            Configure what data to include in offline packages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-download scheduled services</Label>
              <p className="text-xs text-muted-foreground">
                Automatically download packages for upcoming services
              </p>
            </div>
            <Switch
              checked={settings.autoDownload}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, autoDownload: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include technical manuals</Label>
              <p className="text-xs text-muted-foreground">
                Download PDF manuals for offline viewing
              </p>
            </div>
            <Switch
              checked={settings.downloadManuals}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, downloadManuals: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include service history</Label>
              <p className="text-xs text-muted-foreground">
                Download past service records for context
              </p>
            </div>
            <Switch
              checked={settings.downloadHistory}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, downloadHistory: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include troubleshooting guides</Label>
              <p className="text-xs text-muted-foreground">
                Download common issues and solutions
              </p>
            </div>
            <Switch
              checked={settings.downloadTroubleshooting}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, downloadTroubleshooting: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sync on Wi-Fi only</Label>
              <p className="text-xs text-muted-foreground">
                Only download packages when connected to Wi-Fi
              </p>
            </div>
            <Switch
              checked={settings.syncOnWifi}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, syncOnWifi: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Offline Tips */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckCircle2 className="size-5 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Offline Mode Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>- Download service packages before visiting hospitals with poor connectivity</li>
                <li>- Completed checklists and service orders are saved locally and sync automatically</li>
                <li>- AI chat features require internet connection</li>
                <li>- Photos taken offline will upload when connected</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
