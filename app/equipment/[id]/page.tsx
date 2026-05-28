import { AppLayout } from '@/components/app-layout'
import { EquipmentWorkspace } from '@/components/equipment/equipment-workspace'

export default function EquipmentPage({ params }: { params: { id: string } }) {
  return (
    <AppLayout>
      <EquipmentWorkspace equipmentId={params.id} />
    </AppLayout>
  )
}
