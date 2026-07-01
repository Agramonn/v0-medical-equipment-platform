import { AppLayout } from '@/components/app-layout'
import { EngineerCalendar } from '@/components/engineer/engineer-calendar'
import { getCurrentUser } from '@/lib/get-current-user'

export default async function EngineerCalendarPage() {
  const user = await getCurrentUser();
  return (
    <AppLayout user={user}>
      <EngineerCalendar />
    </AppLayout>
  )
}
