import { AppLayout } from '@/components/app-layout'
import { HistoryContent } from '@/components/history/history-content'
import { getCurrentUser } from '@/lib/get-current-user'

export default async function HistoryPage() {
  const user = await getCurrentUser();

  return (
    <AppLayout user={user}>
      <HistoryContent />
    </AppLayout>
  )
}
