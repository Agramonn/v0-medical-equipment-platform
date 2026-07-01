import { notFound } from 'next/navigation'
import { AppLayout } from '@/components/app-layout'
import { getCurrentUser } from '@/lib/get-current-user'
import { EquipmentWorkspace } from '@/components/equipment/equipment-workspace'
import { db } from '@/lib/db'
import { EquipmentWithDetails } from '@/lib/types'

async function getEquipment(id: string): Promise<EquipmentWithDetails | null> {
  const equipment = await db.equipment.findUnique({
    where: { id },
    include: {
      organization: true,
      equipmentModel: true,
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

  return equipment as unknown as EquipmentWithDetails | null
}

async function getServiceOrdersForEquipment(equipmentId: string) {
  const orders = await db.serviceOrder.findMany({
    where: { equipmentId },
    include: {
      equipment: {
        select: {
          id: true,
          equipmentModel: true,
          serialNumber: true,
          assetNumber: true,
          department: true,
        },
      },
      organization: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
      timelineEvents: {
        include: {
          byUser: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  return orders
}

async function getEquipmentListForWizard() {
  return db.equipment.findMany({
    select: {
      equipmentModel: true,
      id: true,
      serialNumber: true,
      assetNumber: true,
      department: true,
      organizationId: true,
      organization: { select: { name: true } },
    },
    orderBy: { equipmentModel: { name: 'asc' } },
  })
}

async function getEngineers() {
  return db.user.findMany({
    where: { role: 'ENGINEER' },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
}

export default async function EquipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  const equipment = await getEquipment(id)

  if (!equipment) {
    notFound()
  }

  const [serviceOrders, equipmentList, engineers] = await Promise.all([
    getServiceOrdersForEquipment(id),
    getEquipmentListForWizard(),
    getEngineers(),
  ])

  return (
    <AppLayout user={user}>
      <EquipmentWorkspace
        equipment={equipment}
        serviceOrders={serviceOrders}
        equipmentList={equipmentList}
        engineers={engineers}
        currentUserId={user.id}
      />
    </AppLayout>
  )
}