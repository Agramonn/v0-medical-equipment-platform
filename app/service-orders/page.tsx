import { AppLayout } from '@/components/app-layout'
import { ServiceOrdersContent } from '@/components/service-orders/service-orders-content'
import { db } from '@/lib/db'
import { ServiceOrderWithRelations } from '@/lib/types'

async function getServiceOrders(): Promise<ServiceOrderWithRelations[]> {
  const orders = await db.serviceOrder.findMany({
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

  return orders as ServiceOrderWithRelations[]
}

async function getEquipmentList() {
  return db.equipment.findMany({
    select: {
      id: true,
      equipmentModel: true,
      serialNumber: true,
      assetNumber: true,
      department: true,
      organizationId: true,
      organization: { select: { name: true } },
    },
    orderBy: { equipmentModel : { name: 'asc' }},
  })
}

async function getEngineers() {
  return db.user.findMany({
    where: { role: 'ENGINEER' },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
}

import { getCurrentUser } from '@/lib/get-current-user'

export default async function ServiceOrdersPage() {
  const user = await getCurrentUser()
  const [orders, equipmentList, engineers] = await Promise.all([
    getServiceOrders(),
    getEquipmentList(),
    getEngineers(),
  ])

  return (
    <AppLayout user={user}>
      <ServiceOrdersContent
        orders={orders}
        equipmentList={equipmentList}
        engineers={engineers}
        currentUserId={user.id}
      />
    </AppLayout>
  )
}