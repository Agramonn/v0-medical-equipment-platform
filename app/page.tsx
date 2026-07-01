import { AppLayout } from '@/components/app-layout'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { getCurrentUser } from '@/lib/get-current-user'

export default async function DashboardPage() {
  const user = await getCurrentUser();
  return (
    <AppLayout user={user}>
      <DashboardContent />
    </AppLayout>
  )
}
