import { AppLayout } from '@/components/app-layout'
import { TroubleshootingContent } from '@/components/troubleshooting/troubleshooting-content'
import { getCurrentUser } from '@/lib/get-current-user'

export default async function TroubleshootingPage() {
  const user = await getCurrentUser();

  return (
    <AppLayout user={user}>
      <TroubleshootingContent />
    </AppLayout>
  )
}
