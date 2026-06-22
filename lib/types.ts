export type EquipmentWithOrganization = {
  id: string
  name: string
  category: string
  manufacturer: string
  model: string
  serialNumber: string
  assetNumber: string
  department: string
  location: string
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'NEEDS_ATTENTION'
  contractType: string | null
  installDate: Date
  purchaseDate: Date
  lastServiceDate: Date | null
  nextServiceDate: Date | null
  hoursUsed: number
  maxHours: number
  organization: {
    id: string
    name: string
    city: string
    state: string
  }
}

export type ServiceHistoryRecord = {
  id: string
  date: Date
  summary: string
  detail: string | null
  partsReplaced: string[]
  serviceTime: number | null
  findings: string | null
  engineer: {
    id: string
    name: string
  }
}

export type EquipmentWithDetails = EquipmentWithOrganization & {
  serviceHistory: ServiceHistoryRecord[]
}

export type ServiceOrderWithRelations = {
  id: string
  orderNumber: string
  type: 'PREVENTIVE_MAINTENANCE' | 'CORRECTIVE_MAINTENANCE' | 'CALIBRATION' | 'INSPECTION' | 'INSTALLATION'
  status: 'DRAFT' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_PARTS' | 'PENDING_CUSTOMER' | 'COMPLETED' | 'PENDING_SIGNATURE' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  description: string | null
  scheduledAt: Date | null
  estimatedHours: number | null
  serviceLocation: string | null
  completedAt: Date | null
  closedAt: Date | null
  objectives: string | null
  activities: string | null
  requiredTools: string[]
  requiredParts: string[]
  safetyRequirements: string | null
  customerNotes: string | null
  findings: string | null
  laborHours: number | null
  createdAt: Date
  equipment: {
    id: string
    name: string
    manufacturer: string
    model: string
    serialNumber: string
    assetNumber: string
    department: string
  }
  organization: {
    id: string
    name: string
  }
  assignedTo: {
    id: string
    name: string
  } | null
  createdBy: {
    id: string
    name: string
  }
}