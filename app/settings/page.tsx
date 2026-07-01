import { AppLayout } from '@/components/app-layout'
import { SettingsContent } from '@/components/settings/settings-content'
import { getCurrentUser } from '@/lib/get-current-user'

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <AppLayout user={user}>
      <SettingsContent />
    </AppLayout>
  )
}
