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

async function getServiceOrdersForEquipment(equipmentId: string) {
  const orders = await db.serviceOrder.findMany({
    where: { equipmentId },
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
      organization: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return orders
}

async function getEquipmentListForWizard() {
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

export default async function EquipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const equipment = await getEquipment(id)

  if (!equipment) {
    notFound()
  }

  const [serviceOrders, equipmentList, engineers, supervisor] = await Promise.all([
    getServiceOrdersForEquipment(id),
    getEquipmentListForWizard(),
    getEngineers(),
    getSupervisor(),
  ])

  return (
    <AppLayout>
      <EquipmentWorkspace
        equipment={equipment}
        serviceOrders={serviceOrders}
        equipmentList={equipmentList}
        engineers={engineers}
        currentUserId={supervisor?.id ?? ''}
      />
    </AppLayout>
  )
}