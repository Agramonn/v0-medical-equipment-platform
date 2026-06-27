import { AppLayout } from '@/components/app-layout'
import { EngineerDashboard } from '@/components/engineer/engineer-dashboard'
import { getCurrentUser } from '@/lib/get-current-user'

export default async function EngineerPage() {
  const user = await getCurrentUser();
  return (
    <AppLayout user={user}>
      <EngineerDashboard />
    </AppLayout>
  )
}
