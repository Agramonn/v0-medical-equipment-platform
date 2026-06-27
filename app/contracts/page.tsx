import { AppLayout } from '@/components/app-layout'
import { ContractsContent } from '@/components/contracts/contracts-content'
import { getCurrentUser } from '@/lib/get-current-user'

export default async function ContractsPage() {
  const user = await getCurrentUser();

  return (
    <AppLayout user={user}>
      <ContractsContent />
    </AppLayout>
  )
}
