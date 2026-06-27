import { AppLayout } from '@/components/app-layout'
import { InventoryContent } from '@/components/inventory/inventory-content'
import { db } from '@/lib/db'
import { EquipmentWithOrganization } from '@/lib/types'
import { getCurrentUser } from '@/lib/get-current-user'

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
  const user = await getCurrentUser();

  return (
    <AppLayout user={user}>
      <InventoryContent equipment={equipment} organizations={organizations} />
    </AppLayout>
  )
}
