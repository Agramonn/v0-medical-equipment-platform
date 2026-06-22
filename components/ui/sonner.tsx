'use client'

<<<<<<< HEAD
=======
import * as React from 'react'
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
<<<<<<< HEAD
  const { theme = 'system' } = useTheme()

=======
  const [mounted, setMounted] = React.useState(false)
  const { theme = 'system' } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
