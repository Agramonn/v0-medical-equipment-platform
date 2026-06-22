import { AppLayout } from '@/components/app-layout'
import { ServiceOrdersContent } from '@/components/service-orders/service-orders-content'
<<<<<<< HEAD

export default function ServiceOrdersPage() {
  return (
    <AppLayout>
      <ServiceOrdersContent />
    </AppLayout>
  )
}
=======
import { db } from '@/lib/db'
import { ServiceOrderWithRelations } from '@/lib/types'

async function getServiceOrders(): Promise<ServiceOrderWithRelations[]> {
  const orders = await db.serviceOrder.findMany({
    include: {
      equipment: {
        select: {
          id: true,
          name: true,
          manufacturer: true,
          model: true,
          serialNumber: true,
          assetNumber: true,
          department: true,
        },
      },
      organization: {
        select: { id: true, name: true },
      },
      assignedTo: {
        select: { id: true, name: true },
      },
      createdBy: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return orders as ServiceOrderWithRelations[]
}

async function getEquipmentList() {
  return db.equipment.findMany({
    select: {
      id: true,
      name: true,
      manufacturer: true,
      model: true,
      serialNumber: true,
      assetNumber: true,
      department: true,
      organizationId: true,
      organization: { select: { name: true } },
    },
    orderBy: { name: 'asc' },
  })
}

async function getEngineers() {
  return db.user.findMany({
    where: { role: 'ENGINEER' },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
}

async function getSupervisor() {
  // TODO: replace with the real logged-in user once auth is implemented (Phase 2)
  return db.user.findFirst({
    where: { role: 'SUPERVISOR' },
    select: { id: true, name: true },
  })
}

export default async function ServiceOrdersPage() {
  const [orders, equipmentList, engineers, supervisor] = await Promise.all([
    getServiceOrders(),
    getEquipmentList(),
    getEngineers(),
    getSupervisor(),
  ])

  return (
    <AppLayout>
      <ServiceOrdersContent
        orders={orders}
        equipmentList={equipmentList}
        engineers={engineers}
        currentUserId={supervisor?.id ?? ''}
      />
    </AppLayout>
  )
}
>>>>>>> 9263d6b (Persistencia Equipos pendiente ordenes de servicio)
