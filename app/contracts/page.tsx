import { AppLayout } from '@/components/app-layout'
import { ContractsContent } from '@/components/contracts/contracts-content'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/get-current-user'

async function getContracts() {
  return db.contract.findMany({
    include: {
      client: {
        select: { id: true, name: true, city: true, state: true },
      },
      equipmentCoverage: {
        include: {
          equipmentModel: {
            select: { id: true, name: true, manufacturer: true, model: true, category: true },
          },
        },
      },
    },
    orderBy: { endDate: 'asc' },
  })
}

async function getOrganizations() {
  return db.organization.findMany({
    select: { id: true, name: true, city: true, state: true },
    orderBy: { name: 'asc' },
  })
}

// Equipos agrupados por organización — para el wizard de contratos
async function getEquipmentByOrganization() {
  const equipment = await db.equipment.findMany({
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
    },
    orderBy: [
      { organizationId: 'asc' },
      { equipmentModel: { name: 'asc' } },
    ],
  })
  return equipment
}

export type ContractWithRelations = Awaited<ReturnType<typeof getContracts>>[number]
export type EquipmentForContract = Awaited<ReturnType<typeof getEquipmentByOrganization>>[number]

export default async function ContractsPage() {
  const [user, contracts, organizations, equipmentByOrg] = await Promise.all([
    getCurrentUser(),
    getContracts(),
    getOrganizations(),
    getEquipmentByOrganization(),
  ])

  return (
    <AppLayout user={user}>
      <ContractsContent
        contracts={contracts}
        organizations={organizations}
        equipmentByOrg={equipmentByOrg}
      />
    </AppLayout>
  )
}