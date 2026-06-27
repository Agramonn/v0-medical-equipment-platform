import { AppLayout } from '@/components/app-layout'
import { getCurrentUser } from '@/lib/get-current-user'
import { ChatContent } from '@/components/chat/chat-content'

export default async function ChatPage() {
  const user = await getCurrentUser()
  return (
    <AppLayout user={user}>
      <ChatContent />
    </AppLayout>
  )
}
