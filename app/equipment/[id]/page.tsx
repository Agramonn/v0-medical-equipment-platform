<<<<<<< HEAD
import { AppLayout } from '@/components/app-layout'
import { EquipmentWorkspace } from '@/components/equipment/equipment-workspace'

export default async function EquipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <AppLayout>
      <EquipmentWorkspace equipmentId={id} />
    </AppLayout>
  )
}
=======
import { notFound } from 'next/navigation'
import { AppLayout } from '@/components/app-layout'
import { EquipmentWorkspace } from '@/components/equipment/equipment-workspace'
import { db } from '@/lib/db'
import { EquipmentWithDetails } from '@/lib/types'

async function getEquipment(id: string): Promise<EquipmentWithDetails | null> {
  const equipment = await db.equipment.findUnique({
    where: { id },
    include: {
      organization: true,
      serviceHistory: {
        include: {
          engineer: {
            select: { id: true, name: true },
          },
        },
        orderBy: { date: 'desc' },
      },
    },
  })

  return equipment as EquipmentWithDetails | null
}

export default async function EquipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const equipment = await getEquipment(id)

  if (!equipment) {
    notFound()
  }

  return (
    <AppLayout>
      <EquipmentWorkspace equipment={equipment} />
    </AppLayout>
  )
}
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
