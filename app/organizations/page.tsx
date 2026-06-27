import { AppLayout } from '@/components/app-layout'
import { OrganizationsContent } from '@/components/organizations/organizations-content'
import { getCurrentUser } from '@/lib/get-current-user'

export default async function OrganizationsPage() {
  const user = await getCurrentUser();

  return (
    <AppLayout user={user}>
      <OrganizationsContent />
    </AppLayout>
  )
}
