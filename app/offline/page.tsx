import { AppLayout } from '@/components/app-layout'
import { OfflineContent } from '@/components/offline/offline-content'
import { getCurrentUser } from '@/lib/get-current-user'

export default async function OfflinePage() {
  const user = await getCurrentUser();

  return (
    <AppLayout user={user}>
      <OfflineContent />
    </AppLayout>
  )
}
