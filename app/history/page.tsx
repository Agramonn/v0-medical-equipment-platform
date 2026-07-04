import { AppLayout } from '@/components/app-layout'
import { HistoryContent } from '@/components/history/history-content'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/get-current-user'

async function getServiceHistory() {
  return db.serviceHistory.findMany({
    include: {
      equipment: {
        select: {
          id: true,
          serialNumber: true,
          department: true,
          equipmentModel: {
            select: {
              name: true,
              manufacturer: true,
              model: true,
            },
          },
          organization: {
            select: { name: true, city: true },
          },
        },
      },
      engineer: {
        select: { id: true, name: true },
      },
      serviceOrder: {
        select: { id: true, orderNumber: true, type: true },
      },
    },
    orderBy: { date: 'desc' },
  })
}

async function getEngineers() {
  return db.user.findMany({
    where: { role: 'ENGINEER' },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
}

export type ServiceHistoryWithRelations = Awaited<ReturnType<typeof getServiceHistory>>[number]

export default async function HistoryPage() {
  const [user, history, engineers] = await Promise.all([
    getCurrentUser(),
    getServiceHistory(),
    getEngineers(),
  ])

  return (
    <AppLayout user={user}>
      <HistoryContent history={history} engineers={engineers} />
    </AppLayout>
  )
}