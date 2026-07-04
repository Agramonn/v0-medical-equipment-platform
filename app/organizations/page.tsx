import { AppLayout } from '@/components/app-layout'
import { OrganizationsContent } from '@/components/organizations/organizations-content'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/get-current-user'

async function getOrganizations() {
  return db.organization.findMany({
    include: {
      contacts: {
        orderBy: { isPrimary: 'desc' },
      },
      contracts: {
        select: {
          id: true,
          contractNumber: true,
          type: true,
          status: true,
          endDate: true,
        },
      },
      _count: {
        select: { equipment: true },
      },
    },
    orderBy: { name: 'asc' },
  })
}

export type OrganizationWithRelations = Awaited<ReturnType<typeof getOrganizations>>[number]

export default async function OrganizationsPage() {
  const [user, organizations] = await Promise.all([
    getCurrentUser(),
    getOrganizations(),
  ])

  return (
    <AppLayout user={user}>
      <OrganizationsContent organizations={organizations} />
    </AppLayout>
  )
}