import { AppLayout } from '@/components/app-layout'
import { InventoryContent } from '@/components/inventory/inventory-content'
import { db } from '@/lib/db'
import { EquipmentWithOrganization } from '@/lib/types'
import { getCurrentUser } from '@/lib/get-current-user'

async function getEquipment(): Promise<EquipmentWithOrganization[]> {
  const equipment = await db.equipment.findMany({
    include: { 
      organization: true,
      equipmentModel: true 
    },
    orderBy: {
      equipmentModel: {
        name: 'asc' 
      }
    },
  })
  return equipment
}

async function getOrganizations() {
  return db.organization.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
}

async function getEquipmentModels() {
  return db.equipmentModel.findMany({
    select: {
      id: true,
      name: true,
      manufacturer: true,
      model: true,
      category: true,
    },
    orderBy: { name: 'asc' },
  })
}

export default async function InventoryPage() {
  const [equipment, organizations, equipmentModels] = await Promise.all([
    getEquipment(),
    getOrganizations(),
    getEquipmentModels(),
  ])
  const user = await getCurrentUser();

  return (
    <AppLayout user={user}>
      <InventoryContent
        equipment={equipment}
        organizations={organizations}
        equipmentModels={equipmentModels}
      />
    </AppLayout>
  )
}
