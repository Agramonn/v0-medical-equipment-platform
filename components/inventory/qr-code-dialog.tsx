'use client'

import * as React from 'react'
import { QrCode, Download } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function QrCodeDialog({
  equipmentId,
  equipmentName,
  assetNumber,
  open,
  onOpenChange,
}: {
  equipmentId: string
  equipmentName: string
  assetNumber: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [baseUrl, setBaseUrl] = React.useState('')

  React.useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  const equipmentUrl = `${baseUrl}/equipment/${equipmentId}`

  function handleDownload() {
    const svg = document.getElementById('equipment-qr-code')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)

      const link = document.createElement('a')
      link.download = `qr-${assetNumber}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="size-5" />
            QR Code
          </DialogTitle>
          <DialogDescription>
            Scan this code to open {equipmentName} directly.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {baseUrl ? (
            <div className="rounded-lg border bg-white p-4">
              <QRCodeSVG
                id="equipment-qr-code"
                value={equipmentUrl}
                size={200}
                level="H"
              />
            </div>
          ) : (
            <div className="size-[232px] animate-pulse rounded-lg bg-muted" />
          )}

          <p className="text-center text-xs text-muted-foreground break-all">
            {equipmentUrl}
          </p>

          <Button onClick={handleDownload} variant="outline" className="w-full">
            <Download className="mr-2 size-4" />
            Download PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}