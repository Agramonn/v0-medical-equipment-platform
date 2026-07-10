export type EquipmentWithOrganization = {
  id: string
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
  equipmentModel: {
    id: string
    name: string
    category: string
    manufacturer: string
    model: string
  }
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
  equipmentModel: EquipmentWithOrganization['equipmentModel'] & {
    manuals: ManualRecord[]
    spareParts: SparePartRecord[]
    contractCoverage: ContractCoverage[]
  }
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
  checklist: ChecklistResponse | null
  objectives: string | null
  activities: string | null
  signedDocumentUrl: string | null
  engineerSignedName: string | null
  engineerSignedAt: Date | null
  customerSignedName: string | null
  customerSignedAt: Date | null
  requiredTools: string[]
  requiredParts: string[]
  safetyRequirements: string | null
  customerNotes: string | null
  findings: string | null
  laborHours: number | null
  createdAt: Date
  equipment: {
    id: string
    serialNumber: string
    assetNumber: string
    department: string
    equipmentModel: {
      name: string
      manufacturer: string
      model: string
    }
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
  timelineEvents: {
    id: string
    label: string
    role: 'SUPERVISOR' | 'ENGINEER' | 'SYSTEM' | 'CUSTOMER'
    note: string | null
    createdAt: Date
    byUser: { id: string; name: string } | null
  }[]
}

export type EquipmentModel = {
  id: string
  name: string
  category: string
  manufacturer: string
  model: string
}

export type EquipmentOption = {
  id: string
  equipmentModel: EquipmentModel 
  serialNumber: string
  assetNumber: string
  department: string
  organizationId: string
  organization: { name: string }
}

export type ManualRecord = {
  id: string
  name: string
  category: string
  fileUrl: string | null
  pages: number | null
  createdAt: Date
}

export type SparePartRecord = {
  id: string
  partNumber: string
  description: string
  manufacturer: string
  supplier: string | null
  estimatedCost: number | null
  stock: number
  reorderLevel: number
}

export type ContractCoverage = {
  id: string
  contractNumber: string
  type: string
  status: string
  coverageType: string
  pmVisitsPerYear: number
  slaHours: number
  includesParts: boolean
  includesLabor: boolean
  endDate: Date
  
  contract: {
    id: string
    contractNumber: string
    type: string
    status: string
    endDate: Date
    client: {
      name: string
    }
  }
}

export type ChecklistTemplateItem = {
  id: string
  order: number
  section: string
  description: string
  expectedValue: string | null
  unit: string | null
  isCritical: boolean
  requiresEvidence: boolean
}

export type ChecklistTemplate = {
  id: string
  name: string
  serviceType: string
  version: string
  estimatedMinutes: number
  items: ChecklistTemplateItem[]
}

// Respuesta guardada por ítem al completar el checklist
export type ChecklistItemResponse = {
  itemId: string
  status: 'pass' | 'fail' | 'na' | 'pending'
  measuredValue?: string
  notes?: string
  completedAt?: string
}

// El checklist completo guardado en ServiceOrder.checklist (Json)
export type ChecklistResponse = {
  templateId: string
  templateVersion: string
  startedAt: string
  completedAt?: string
  completedBy: string
  items: ChecklistItemResponse[]
}