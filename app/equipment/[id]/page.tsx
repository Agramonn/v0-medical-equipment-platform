import { notFound } from 'next/navigation'
import { AppLayout } from '@/components/app-layout'
import { EquipmentWorkspace } from '@/components/equipment/equipment-workspace'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/get-current-user'
import { EquipmentWithDetails, ChecklistTemplate } from '@/lib/types'

async function getEquipment(id: string): Promise<EquipmentWithDetails | null> {
  const equipment = await db.equipment.findUnique({
    where: { id },
    include: {
      organization: true,
      serviceHistory: {
        include: {
          engineer: { select: { id: true, name: true } },
        },
        orderBy: { date: 'desc' },
      },
      equipmentModel: {
        include: {
          manuals: { orderBy: { name: 'asc' } },
          spareParts: { orderBy: { description: 'asc' } },
          contractCoverage: {
            include: {
              contract: {
                select: {
                  id: true,
                  contractNumber: true,
                  type: true,
                  status: true,
                  endDate: true,
                  client: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  })
  return equipment as unknown as EquipmentWithDetails | null
}

async function getServiceOrdersForEquipment(equipmentId: string) {
  return db.serviceOrder.findMany({
    where: { equipmentId },
    include: {
      equipment: {
        select: {
          id: true,
          serialNumber: true,
          assetNumber: true,
          department: true,
          equipmentModel: {
            select: {
              id: true,
              name: true,
              manufacturer: true,
              model: true,
            },
          },
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
    orderBy: { createdAt: 'desc' },
  })
}

async function getChecklistTemplates(
  equipmentModelId: string
): Promise<ChecklistTemplate[]> {
  const templates = await db.checklistTemplate.findMany({
    where: { equipmentModelId },
    include: {
      items: { orderBy: { order: 'asc' } },
    },
  })
  return templates as ChecklistTemplate[]
}

async function getEquipmentListForWizard() {
  return db.equipment.findMany({
    select: {
      id: true,
      serialNumber: true,
      assetNumber: true,
      department: true,
      organizationId: true,
      equipmentModelId: true,
      equipmentModel: {
        select: {
          id: true,
          name: true,
          manufacturer: true,
          model: true,
          category: true,
        },
      },
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

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  const equipment = await getEquipment(id)

  if (!equipment) notFound()

  const [serviceOrders, equipmentList, engineers, templates] = await Promise.all([
    getServiceOrdersForEquipment(id),
    getEquipmentListForWizard(),
    getEngineers(),
    getChecklistTemplates(equipment.equipmentModel.id),
  ])

  return (
    <AppLayout user={user}>
      <EquipmentWorkspace
        equipment={equipment}
        serviceOrders={serviceOrders as any}
        equipmentList={equipmentList}
        engineers={engineers}
        currentUserId={user.id}
        currentUserRole={user.role as 'SUPERVISOR' | 'ENGINEER'}
        checklistTemplates={templates}
      />
    </AppLayout>
  )
}