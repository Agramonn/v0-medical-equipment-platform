import { AppLayout } from '@/components/app-layout'
import { InventoryContent } from '@/components/inventory/inventory-content'
<<<<<<< HEAD

export default function InventoryPage() {
  return (
    <AppLayout>
      <InventoryContent />
    </AppLayout>
  )
}
=======
import { db } from '@/lib/db'
import { EquipmentWithOrganization } from '@/lib/types'

async function getEquipment(): Promise<EquipmentWithOrganization[]> {
  const equipment = await db.equipment.findMany({
    include: { organization: true },
    orderBy: { name: 'asc' },
  })
  return equipment as EquipmentWithOrganization[]
}

async function getOrganizations() {
  return db.organization.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
}

export default async function InventoryPage() {
  const [equipment, organizations] = await Promise.all([
    getEquipment(),
    getOrganizations(),
  ])

  return (
    <AppLayout>
      <InventoryContent equipment={equipment} organizations={organizations} />
    </AppLayout>
  )
}
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
