// Service Order domain model (biomedical service workflow)
//
// A Service Order (SO) is the official record proving what service was
// performed on a medical device. It is used for customer documentation,
// hospital audits, maintenance traceability, service evidence, contract
// compliance, and regulatory documentation.
//
// This file is the single source of truth for the SO workflow architecture.
// It is intentionally persistence-agnostic so it can later be backed by a
// real database without changing the UI contracts.

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

// Full lifecycle of a Service Order. This replaces the old simplistic
// task-oriented statuses (pending / in-progress / billed).
export type ServiceOrderStatus =
  | 'draft' // created by supervisor, not yet assigned
  | 'assigned' // engineer assigned, scheduled
  | 'in-progress' // engineer actively working on site
  | 'pending-parts' // blocked waiting for spare parts
  | 'pending-customer' // blocked waiting on customer (access, approval)
  | 'completed' // engineer submitted work for supervisor review
  | 'pending-signature' // approved, awaiting customer signature
  | 'closed' // signed off, archived official record

export interface ServiceOrderStatusMeta {
  label: string
  description: string
  // Tailwind classes for badge styling (themed tokens only).
  className: string
  // Who can move the order INTO this status.
  owner: 'supervisor' | 'engineer' | 'system'
}

export const serviceOrderStatusConfig: Record<
  ServiceOrderStatus,
  ServiceOrderStatusMeta
> = {
  draft: {
    label: 'Draft',
    description: 'Created but not yet assigned to an engineer.',
    className: 'bg-muted text-muted-foreground',
    owner: 'supervisor',
  },
  assigned: {
    label: 'Assigned',
    description: 'Assigned to an engineer and scheduled.',
    className: 'bg-secondary text-secondary-foreground',
    owner: 'supervisor',
  },
  'in-progress': {
    label: 'In Progress',
    description: 'Engineer is performing the service on site.',
    className: 'bg-primary/10 text-primary',
    owner: 'engineer',
  },
  'pending-parts': {
    label: 'Pending Parts',
    description: 'Work paused while waiting for spare parts.',
    className: 'bg-warning/10 text-warning',
    owner: 'engineer',
  },
  'pending-customer': {
    label: 'Pending Customer',
    description: 'Waiting on customer access, approval or information.',
    className: 'bg-warning/10 text-warning',
    owner: 'engineer',
  },
  completed: {
    label: 'Completed',
    description: 'Engineer submitted the work for supervisor review.',
    className: 'bg-success/10 text-success',
    owner: 'engineer',
  },
  'pending-signature': {
    label: 'Pending Signature',
    description: 'Approved by supervisor, awaiting customer signature.',
    className: 'bg-primary/10 text-primary',
    owner: 'supervisor',
  },
  closed: {
    label: 'Closed',
    description: 'Signed off. Official service record is archived.',
    className: 'bg-foreground/10 text-foreground',
    owner: 'supervisor',
  },
}

// Statuses considered "open" (work is not yet an archived record).
export const openStatuses: ServiceOrderStatus[] = [
  'draft',
  'assigned',
  'in-progress',
  'pending-parts',
  'pending-customer',
  'completed',
  'pending-signature',
]

// ---------------------------------------------------------------------------
// Service types
// ---------------------------------------------------------------------------

export type ServiceType =
  | 'Preventive Maintenance'
  | 'Corrective Maintenance'
  | 'Calibration'
  | 'Inspection'
  | 'Installation'

export interface ServiceTypeMeta {
  label: ServiceType
  short: string
  className: string
}

export const serviceTypeConfig: Record<ServiceType, ServiceTypeMeta> = {
  'Preventive Maintenance': {
    label: 'Preventive Maintenance',
    short: 'PM',
    className: 'border-primary/50 text-primary',
  },
  'Corrective Maintenance': {
    label: 'Corrective Maintenance',
    short: 'CM',
    className: 'border-destructive/50 text-destructive',
  },
  Calibration: {
    label: 'Calibration',
    short: 'CAL',
    className: 'border-secondary-foreground/40 text-secondary-foreground',
  },
  Inspection: {
    label: 'Inspection',
    short: 'INS',
    className: 'border-warning/50 text-warning',
  },
  Installation: {
    label: 'Installation',
    short: 'INST',
    className: 'border-success/50 text-success',
  },
}

export type ServicePriority = 'critical' | 'high' | 'medium' | 'low'

// ---------------------------------------------------------------------------
// Equipment snapshot
// ---------------------------------------------------------------------------

// A Service Order captures an immutable snapshot of the equipment at the time
// of service. This keeps the official record accurate even if the equipment
// record changes later.
export interface EquipmentSnapshot {
  equipmentId: string
  name: string
  manufacturer: string
  model: string
  serialNumber: string
  assetNumber: string
  hospital: string
  department: string
  contract: string
}

// ---------------------------------------------------------------------------
// Scope of work (Step 3)
// ---------------------------------------------------------------------------

export interface ChecklistTaskItem {
  id: string
  text: string
  done: boolean
}

export interface ScopeOfWork {
  objectives: string
  activities: string
  requiredTools: string[]
  requiredParts: string[]
  safetyRequirements: string
  customerNotes: string
  // Type-specific checklist that drives execution.
  checklist: ChecklistTaskItem[]
}

// Default checklists per service type. Used to seed the scope of work when a
// supervisor creates a new order.
export const checklistTemplates: Record<ServiceType, string[]> = {
  'Preventive Maintenance': [
    'Visual inspection of housing and labels',
    'Clean / replace air filters',
    'Electrical safety test',
    'Functional self-test',
    'Verify alarms and safety systems',
    'Update service sticker',
  ],
  'Corrective Maintenance': [
    'Reproduce reported fault',
    'Diagnose root cause',
    'Replace or repair faulty component',
    'Verify fault is resolved',
    'Functional verification test',
  ],
  Calibration: [
    'Connect calibrated reference instrument',
    'Record as-found values',
    'Adjust to within tolerance',
    'Record as-left values',
    'Issue calibration certificate',
  ],
  Inspection: [
    'Visual condition assessment',
    'Electrical safety inspection',
    'Verify accessories and consumables',
    'Document deficiencies',
  ],
  Installation: [
    'Verify site readiness and power',
    'Unpack and assemble unit',
    'Connect and configure',
    'Commissioning test',
    'Customer acceptance and training',
  ],
}

// ---------------------------------------------------------------------------
// Completion requirements (Step 4)
// ---------------------------------------------------------------------------

export interface CompletionRequirements {
  photos: boolean
  measurements: boolean
  checklist: boolean
  testResults: boolean
  partsUsage: boolean
  engineerNotes: boolean
  customerSignature: boolean
}

export const completionRequirementLabels: Record<
  keyof CompletionRequirements,
  string
> = {
  photos: 'Photos Required',
  measurements: 'Measurements Required',
  checklist: 'Checklist Required',
  testResults: 'Test Results Required',
  partsUsage: 'Parts Usage Required',
  engineerNotes: 'Engineer Notes Required',
  customerSignature: 'Customer Signature Required',
}

// ---------------------------------------------------------------------------
// Service documentation (evidence)
// ---------------------------------------------------------------------------

export interface PartUsed {
  partNumber: string
  description: string
  quantity: number
}

export interface Measurement {
  id: string
  label: string
  value: string
  unit: string
  expected?: string
  pass: boolean
}

export interface ServicePhoto {
  id: string
  caption: string
  // In a real implementation this would be a URL. Kept as a placeholder count
  // friendly structure for now.
  takenAt: string
}

export interface SignatureRecord {
  name: string
  role: string
  signedAt: string
}

export interface ServiceDocumentation {
  findings: string
  rootCause: string
  correctiveActions: string
  recommendations: string
  partsUsed: PartUsed[]
  laborHours: number
  measurements: Measurement[]
  photos: ServicePhoto[]
  attachments: string[]
  engineerSignature?: SignatureRecord
  customerSignature?: SignatureRecord
}

// ---------------------------------------------------------------------------
// Timeline / audit trail
// ---------------------------------------------------------------------------

export interface TimelineEvent {
  id: string
  label: string
  by: string
  role: 'supervisor' | 'engineer' | 'system' | 'customer'
  at: string
  note?: string
}

// ---------------------------------------------------------------------------
// Service Order
// ---------------------------------------------------------------------------

export interface ServiceOrder {
  id: string
  status: ServiceOrderStatus
  type: ServiceType
  priority: ServicePriority

  equipment: EquipmentSnapshot

  // Service information (Step 2)
  assignedEngineer: string | null
  scheduledDate: string
  estimatedHours: number
  serviceLocation: string

  scope: ScopeOfWork
  requirements: CompletionRequirements
  documentation: ServiceDocumentation

  createdBy: string
  createdAt: string
  closedAt?: string

  timeline: TimelineEvent[]

  // ---- Future Ticket module integration --------------------------------
  // Service Orders are designed so they can later be linked to a Ticket.
  // The relationship is Ticket -> Service Order (one ticket may spawn one or
  // more service orders). We only reserve the field now; the Ticket module is
  // NOT implemented yet. When the module lands, `ticketId` will reference a
  // record in a future `tickets` table / module.
  ticketId?: string | null
  // Origin of the order. Today everything is created manually by a supervisor.
  // Later, orders may originate from a customer ticket.
  origin: 'manual' | 'ticket'
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

function snapshot(partial: Partial<EquipmentSnapshot> & { equipmentId: string; name: string }): EquipmentSnapshot {
  return {
    manufacturer: 'Philips',
    model: 'Trilogy Evo',
    serialNumber: 'SN-2847-PHL-001',
    assetNumber: 'AST-100482',
    hospital: 'Central Hospital',
    department: 'ICU',
    contract: 'Full Service',
    ...partial,
  }
}

function emptyDocumentation(): ServiceDocumentation {
  return {
    findings: '',
    rootCause: '',
    correctiveActions: '',
    recommendations: '',
    partsUsed: [],
    laborHours: 0,
    measurements: [],
    photos: [],
    attachments: [],
  }
}

function scopeFor(type: ServiceType, overrides: Partial<ScopeOfWork> = {}): ScopeOfWork {
  return {
    objectives: '',
    activities: '',
    requiredTools: [],
    requiredParts: [],
    safetyRequirements: '',
    customerNotes: '',
    checklist: checklistTemplates[type].map((text, i) => ({
      id: `chk-${i}`,
      text,
      done: false,
    })),
    ...overrides,
  }
}

const defaultRequirements: CompletionRequirements = {
  photos: true,
  measurements: false,
  checklist: true,
  testResults: false,
  partsUsage: true,
  engineerNotes: true,
  customerSignature: true,
}

export const serviceOrders: ServiceOrder[] = [
  {
    id: 'OS-2024-001',
    status: 'in-progress',
    type: 'Corrective Maintenance',
    priority: 'high',
    equipment: snapshot({
      equipmentId: 'EQ-001',
      name: 'Ventilator V-2847',
      manufacturer: 'Philips',
      model: 'Trilogy Evo',
      serialNumber: 'SN-2847-PHL-001',
      assetNumber: 'AST-100482',
      hospital: 'Central Hospital',
      department: 'ICU',
      contract: 'Full Service',
    }),
    assignedEngineer: 'John Doe',
    scheduledDate: '2024-02-16',
    estimatedHours: 3,
    serviceLocation: 'Central Hospital - Building A, Floor 3',
    scope: scopeFor('Corrective Maintenance', {
      objectives: 'Resolve oxygen sensor calibration error E-101.',
      activities: 'Diagnose sensor circuit, replace oxygen sensor, recalibrate.',
      requiredTools: ['Oxygen Analyzer', 'Digital Multimeter'],
      requiredParts: ['Oxygen Sensor (PHI-OS-2847)'],
      safetyRequirements: 'Disconnect from patient. Lockout power before service.',
      customerNotes: 'Coordinate with ICU charge nurse before removing unit.',
    }),
    requirements: { ...defaultRequirements, measurements: true, testResults: true },
    documentation: {
      ...emptyDocumentation(),
      findings: 'Oxygen sensor reading drifted beyond 5% tolerance.',
      laborHours: 1.5,
    },
    createdBy: 'Sarah Connor',
    createdAt: '2024-02-15',
    origin: 'manual',
    ticketId: null,
    timeline: [
      { id: 't1', label: 'Service Order created', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-15 10:00' },
      { id: 't2', label: 'Assigned to John Doe', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-15 10:05' },
      { id: 't3', label: 'Service started', by: 'John Doe', role: 'engineer', at: '2024-02-16 09:00' },
    ],
  },
  {
    id: 'OS-2024-002',
    status: 'assigned',
    type: 'Preventive Maintenance',
    priority: 'medium',
    equipment: snapshot({
      equipmentId: 'EQ-002',
      name: 'MRI Scanner M-1204',
      manufacturer: 'Siemens',
      model: 'Magnetom Vida',
      serialNumber: 'SN-1204-SIE-002',
      assetNumber: 'AST-100511',
      hospital: 'Regional Medical Center',
      department: 'Radiology',
      contract: 'Preventive Only',
    }),
    assignedEngineer: 'Jane Smith',
    scheduledDate: '2024-02-18',
    estimatedHours: 4,
    serviceLocation: 'Regional Medical Center - Radiology',
    scope: scopeFor('Preventive Maintenance', {
      objectives: 'Quarterly preventive maintenance per manufacturer schedule.',
    }),
    requirements: defaultRequirements,
    documentation: emptyDocumentation(),
    createdBy: 'Sarah Connor',
    createdAt: '2024-02-14',
    origin: 'manual',
    ticketId: null,
    timeline: [
      { id: 't1', label: 'Service Order created', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-14 14:00' },
      { id: 't2', label: 'Assigned to Jane Smith', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-14 14:10' },
    ],
  },
  {
    id: 'OS-2024-003',
    status: 'pending-parts',
    type: 'Corrective Maintenance',
    priority: 'critical',
    equipment: snapshot({
      equipmentId: 'EQ-004',
      name: 'Defibrillator D-0892',
      manufacturer: 'Zoll',
      model: 'R Series',
      serialNumber: 'SN-0892-ZOL-004',
      assetNumber: 'AST-100620',
      hospital: 'Emergency Center',
      department: 'Emergency',
      contract: 'Full Service',
    }),
    assignedEngineer: 'Mike Johnson',
    scheduledDate: '2024-02-15',
    estimatedHours: 2,
    serviceLocation: 'Emergency Center - ER Bay 2',
    scope: scopeFor('Corrective Maintenance', {
      objectives: 'Battery not charging - urgent repair.',
      requiredParts: ['Battery Pack (PHI-BP-500)'],
    }),
    requirements: { ...defaultRequirements, testResults: true },
    documentation: {
      ...emptyDocumentation(),
      findings: 'Charging circuit fault confirmed. Replacement battery pack on order.',
      laborHours: 1,
    },
    createdBy: 'Sarah Connor',
    createdAt: '2024-02-15',
    origin: 'manual',
    ticketId: null,
    timeline: [
      { id: 't1', label: 'Service Order created', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-15 08:00' },
      { id: 't2', label: 'Assigned to Mike Johnson', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-15 08:05' },
      { id: 't3', label: 'Service started', by: 'Mike Johnson', role: 'engineer', at: '2024-02-15 09:30' },
      { id: 't4', label: 'Paused - waiting for battery pack', by: 'Mike Johnson', role: 'engineer', at: '2024-02-15 10:15', note: 'PHI-BP-500 out of stock, ETA 2 days' },
    ],
  },
  {
    id: 'OS-2024-004',
    status: 'completed',
    type: 'Calibration',
    priority: 'low',
    equipment: snapshot({
      equipmentId: 'EQ-005',
      name: 'CT Scanner CT-4521',
      manufacturer: 'GE Healthcare',
      model: 'Revolution',
      serialNumber: 'SN-4521-GE-005',
      assetNumber: 'AST-100702',
      hospital: 'Central Hospital',
      department: 'Radiology',
      contract: 'Full Service',
    }),
    assignedEngineer: 'John Doe',
    scheduledDate: '2024-02-12',
    estimatedHours: 5,
    serviceLocation: 'Central Hospital - Radiology',
    scope: scopeFor('Calibration', {
      objectives: 'Annual calibration and certification.',
    }),
    requirements: { ...defaultRequirements, measurements: true, testResults: true },
    documentation: {
      ...emptyDocumentation(),
      findings: 'All parameters within tolerance after adjustment.',
      correctiveActions: 'Adjusted dose calibration to reference standard.',
      laborHours: 4.5,
      measurements: [
        { id: 'm1', label: 'CT Dose Index', value: '12.1', unit: 'mGy', expected: '12 ±5%', pass: true },
        { id: 'm2', label: 'Slice thickness', value: '5.02', unit: 'mm', expected: '5 ±0.5', pass: true },
      ],
      partsUsed: [],
    },
    createdBy: 'Sarah Connor',
    createdAt: '2024-02-10',
    origin: 'manual',
    ticketId: null,
    timeline: [
      { id: 't1', label: 'Service Order created', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-10 11:00' },
      { id: 't2', label: 'Assigned to John Doe', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-10 11:05' },
      { id: 't3', label: 'Service started', by: 'John Doe', role: 'engineer', at: '2024-02-12 08:00' },
      { id: 't4', label: 'Work submitted for review', by: 'John Doe', role: 'engineer', at: '2024-02-12 13:00' },
    ],
  },
  {
    id: 'OS-2024-005',
    status: 'in-progress',
    type: 'Corrective Maintenance',
    priority: 'high',
    equipment: snapshot({
      equipmentId: 'EQ-006',
      name: 'Anesthesia Machine A-2134',
      manufacturer: 'Dräger',
      model: 'Perseus A500',
      serialNumber: 'SN-2134-DRA-006',
      assetNumber: 'AST-100744',
      hospital: 'Regional Medical Center',
      department: 'Surgery',
      contract: 'Full Service',
    }),
    assignedEngineer: 'Jane Smith',
    scheduledDate: '2024-02-14',
    estimatedHours: 3,
    serviceLocation: 'Regional Medical Center - OR 4',
    scope: scopeFor('Corrective Maintenance', {
      objectives: 'Flow sensor replacement.',
      requiredParts: ['Flow Sensor (PHI-FS-300)'],
    }),
    requirements: defaultRequirements,
    documentation: emptyDocumentation(),
    createdBy: 'Sarah Connor',
    createdAt: '2024-02-13',
    origin: 'manual',
    ticketId: null,
    timeline: [
      { id: 't1', label: 'Service Order created', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-13 09:00' },
      { id: 't2', label: 'Assigned to Jane Smith', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-13 09:10' },
      { id: 't3', label: 'Service started', by: 'Jane Smith', role: 'engineer', at: '2024-02-14 10:00' },
    ],
  },
  {
    id: 'OS-2024-006',
    status: 'closed',
    type: 'Corrective Maintenance',
    priority: 'medium',
    equipment: snapshot({
      equipmentId: 'EQ-007',
      name: 'Patient Monitor PM-8976',
      manufacturer: 'Philips',
      model: 'IntelliVue MX450',
      serialNumber: 'SN-8976-PHL-007',
      assetNumber: 'AST-100810',
      hospital: 'City Clinic',
      department: 'ICU',
      contract: 'Full Service',
    }),
    assignedEngineer: 'Mike Johnson',
    scheduledDate: '2024-02-09',
    estimatedHours: 2,
    serviceLocation: 'City Clinic - ICU',
    scope: scopeFor('Corrective Maintenance', {
      objectives: 'Display malfunction - LCD replacement.',
      requiredParts: ['LCD Panel'],
    }),
    requirements: defaultRequirements,
    documentation: {
      ...emptyDocumentation(),
      findings: 'Backlight failure on main display.',
      correctiveActions: 'Replaced LCD panel and verified display output.',
      recommendations: 'No further action required.',
      laborHours: 1.75,
      partsUsed: [{ partNumber: 'LCD-450', description: 'LCD Panel', quantity: 1 }],
      engineerSignature: { name: 'Mike Johnson', role: 'Field Engineer', signedAt: '2024-02-09 12:00' },
      customerSignature: { name: 'Dr. Alan Reyes', role: 'Biomedical Coordinator', signedAt: '2024-02-09 12:30' },
    },
    createdBy: 'Sarah Connor',
    createdAt: '2024-02-08',
    closedAt: '2024-02-10',
    origin: 'manual',
    ticketId: null,
    timeline: [
      { id: 't1', label: 'Service Order created', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-08 13:00' },
      { id: 't2', label: 'Assigned to Mike Johnson', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-08 13:05' },
      { id: 't3', label: 'Service started', by: 'Mike Johnson', role: 'engineer', at: '2024-02-09 10:00' },
      { id: 't4', label: 'Work submitted for review', by: 'Mike Johnson', role: 'engineer', at: '2024-02-09 12:00' },
      { id: 't5', label: 'Completion approved', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-09 15:00' },
      { id: 't6', label: 'Customer signed off', by: 'Dr. Alan Reyes', role: 'customer', at: '2024-02-09 12:30' },
      { id: 't7', label: 'Service Order closed', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-10 09:00' },
    ],
  },
  {
    id: 'OS-2024-007',
    status: 'pending-signature',
    type: 'Inspection',
    priority: 'low',
    equipment: snapshot({
      equipmentId: 'EQ-008',
      name: 'Infusion Pump IP-3421',
      manufacturer: 'B. Braun',
      model: 'Infusomat Space',
      serialNumber: 'SN-3421-BRA-008',
      assetNumber: 'AST-100866',
      hospital: 'Emergency Center',
      department: 'Emergency',
      contract: 'Preventive Only',
    }),
    assignedEngineer: 'John Doe',
    scheduledDate: '2024-02-13',
    estimatedHours: 1,
    serviceLocation: 'Emergency Center - ER',
    scope: scopeFor('Inspection', {
      objectives: 'Safety inspection and calibration check.',
    }),
    requirements: { ...defaultRequirements, customerSignature: true },
    documentation: {
      ...emptyDocumentation(),
      findings: 'Unit passed all safety inspection points.',
      laborHours: 0.75,
      engineerSignature: { name: 'John Doe', role: 'Field Engineer', signedAt: '2024-02-13 11:00' },
    },
    createdBy: 'Sarah Connor',
    createdAt: '2024-02-11',
    origin: 'manual',
    ticketId: null,
    timeline: [
      { id: 't1', label: 'Service Order created', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-11 10:00' },
      { id: 't2', label: 'Assigned to John Doe', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-11 10:05' },
      { id: 't3', label: 'Service started', by: 'John Doe', role: 'engineer', at: '2024-02-13 10:00' },
      { id: 't4', label: 'Work submitted for review', by: 'John Doe', role: 'engineer', at: '2024-02-13 11:00' },
      { id: 't5', label: 'Completion approved', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-13 14:00' },
    ],
  },
  {
    id: 'OS-2024-008',
    status: 'draft',
    type: 'Installation',
    priority: 'medium',
    equipment: snapshot({
      equipmentId: 'EQ-009',
      name: 'X-Ray Machine X-1567',
      manufacturer: 'Carestream',
      model: 'DRX-Evolution',
      serialNumber: 'SN-1567-CAR-009',
      assetNumber: 'AST-100921',
      hospital: 'Central Hospital',
      department: 'Radiology',
      contract: 'Full Service',
    }),
    assignedEngineer: null,
    scheduledDate: '2024-02-22',
    estimatedHours: 6,
    serviceLocation: 'Central Hospital - Radiology Suite 2',
    scope: scopeFor('Installation', {
      objectives: 'Install and commission new X-ray unit.',
    }),
    requirements: defaultRequirements,
    documentation: emptyDocumentation(),
    createdBy: 'Sarah Connor',
    createdAt: '2024-02-15',
    origin: 'manual',
    ticketId: null,
    timeline: [
      { id: 't1', label: 'Service Order created (draft)', by: 'Sarah Connor', role: 'supervisor', at: '2024-02-15 16:00' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getServiceOrdersForEquipment(equipmentId: string): ServiceOrder[] {
  return serviceOrders.filter((o) => o.equipment.equipmentId === equipmentId)
}

export const engineers = ['John Doe', 'Jane Smith', 'Mike Johnson'] as const

export const availableEquipment: EquipmentSnapshot[] = [
  {
    equipmentId: 'EQ-001',
    name: 'Ventilator V-2847',
    manufacturer: 'Philips',
    model: 'Trilogy Evo',
    serialNumber: 'SN-2847-PHL-001',
    assetNumber: 'AST-100482',
    hospital: 'Central Hospital',
    department: 'ICU',
    contract: 'Full Service',
  },
  {
    equipmentId: 'EQ-002',
    name: 'MRI Scanner M-1204',
    manufacturer: 'Siemens',
    model: 'Magnetom Vida',
    serialNumber: 'SN-1204-SIE-002',
    assetNumber: 'AST-100511',
    hospital: 'Regional Medical Center',
    department: 'Radiology',
    contract: 'Preventive Only',
  },
  {
    equipmentId: 'EQ-004',
    name: 'Defibrillator D-0892',
    manufacturer: 'Zoll',
    model: 'R Series',
    serialNumber: 'SN-0892-ZOL-004',
    assetNumber: 'AST-100620',
    hospital: 'Emergency Center',
    department: 'Emergency',
    contract: 'Full Service',
  },
  {
    equipmentId: 'EQ-005',
    name: 'CT Scanner CT-4521',
    manufacturer: 'GE Healthcare',
    model: 'Revolution',
    serialNumber: 'SN-4521-GE-005',
    assetNumber: 'AST-100702',
    hospital: 'Central Hospital',
    department: 'Radiology',
    contract: 'Full Service',
  },
]
