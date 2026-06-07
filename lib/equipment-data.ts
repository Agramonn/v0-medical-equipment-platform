// Mock data and types for the Equipment module (Phase 4)

export type EquipmentStatus =
  | 'operational'
  | 'maintenance'
  | 'out-of-service'
  | 'needs-attention'

export interface EquipmentRecord {
  id: string
  name: string
  category: string
  manufacturer: string
  model: string
  serialNumber: string
  assetNumber: string
  location: string
  department: string
  hospital: string
  installationDate: string
  purchaseDate: string
  warranty: {
    provider: string
    expiresOn: string
    type: string
  }
  contractType: string
  // Links the equipment to its maintenance-obligation source of truth.
  contractEquipmentId: string
  status: EquipmentStatus
  lastService: string
  nextService: string
  hoursUsed: number
  maxHours: number
}

export const equipmentData: EquipmentRecord = {
  id: 'EQ-001',
  name: 'Ventilator V-2847',
  category: 'Respiratory Therapy',
  manufacturer: 'Philips',
  model: 'Trilogy Evo',
  serialNumber: 'SN-2847-PHL-001',
  assetNumber: 'AST-100482',
  location: 'Central Hospital - Building A, Floor 3',
  department: 'ICU',
  hospital: 'Central Hospital',
  installationDate: '2022-03-10',
  purchaseDate: '2022-02-18',
  warranty: {
    provider: 'Philips Healthcare',
    expiresOn: '2026-02-18',
    type: 'Extended (4 years)',
  },
  // Equipment id used to look up contract coverage, warranties and PM plans
  // in lib/contract-data.ts (the maintenance obligation source of truth).
  contractEquipmentId: 'EQ-001',
  contractType: 'Full Service',
  status: 'operational',
  lastService: '2024-01-15',
  nextService: '2024-04-15',
  hoursUsed: 8432,
  maxHours: 15000,
}

export const statusConfig: Record<
  EquipmentStatus,
  { label: string; className: string }
> = {
  operational: { label: 'Operational', className: 'bg-success/10 text-success' },
  maintenance: { label: 'In Maintenance', className: 'bg-primary/10 text-primary' },
  'needs-attention': {
    label: 'Needs Attention',
    className: 'bg-warning/10 text-warning',
  },
  'out-of-service': {
    label: 'Out of Service',
    className: 'bg-destructive/10 text-destructive',
  },
}

export interface RecentActivity {
  id: string
  type: 'Corrective' | 'Preventive' | 'Calibration'
  title: string
  date: string
  engineer: string
}

export const recentActivity: RecentActivity[] = [
  {
    id: 'RA-001',
    type: 'Corrective',
    title: 'Oxygen sensor calibration drift corrected',
    date: '2024-02-15',
    engineer: 'John Doe',
  },
  {
    id: 'RA-002',
    type: 'Preventive',
    title: 'Quarterly preventive maintenance completed',
    date: '2024-01-15',
    engineer: 'Mike Johnson',
  },
  {
    id: 'RA-003',
    type: 'Calibration',
    title: 'Tidal volume calibration verified',
    date: '2023-12-20',
    engineer: 'Jane Smith',
  },
]

export interface AiRecommendation {
  id: string
  severity: 'high' | 'medium' | 'low'
  title: string
  detail: string
  source: string
}

export const aiRecommendations: AiRecommendation[] = [
  {
    id: 'AI-001',
    severity: 'high',
    title: 'Schedule oxygen sensor replacement',
    detail:
      'Service history shows 2 calibration drifts in the last 90 days. The service manual recommends proactive sensor replacement after recurring drift events to avoid unplanned downtime.',
    source: 'Service Manual §7.3 + Service History',
  },
  {
    id: 'AI-002',
    severity: 'medium',
    title: 'Review ICU environmental conditions',
    detail:
      'Dust accumulation was cited as a root cause in a recent flow sensor incident. Consider verifying room filtration and ambient particulate levels.',
    source: 'Incident TH-002 + Maintenance Guide',
  },
  {
    id: 'AI-003',
    severity: 'low',
    title: 'Battery pack approaching service interval',
    detail:
      'The battery pack was last replaced in June 2023. The manufacturer recommends evaluation every 18 months for ICU-grade ventilators.',
    source: 'Manufacturer Bulletin TB-2023-09',
  },
]

export interface ChecklistItem {
  id: string
  text: string
  status: 'pass' | 'fail' | 'pending'
  notes?: string
  expectedValue?: string
  hasEvidence?: boolean
}

export interface ChecklistCategory {
  id: string
  category: string
  items: ChecklistItem[]
}

export const recommendedTools = [
  'Digital Multimeter',
  'Oxygen Analyzer',
  'Pressure Gauge / Manometer',
  'Electrical Safety Analyzer',
  'Calibrated Test Lung',
  'Torque Screwdriver Set',
]

export const checklistData: ChecklistCategory[] = [
  {
    id: '1',
    category: 'Visual Inspection',
    items: [
      { id: '1.1', text: 'Check external housing for damage', status: 'pass' },
      { id: '1.2', text: 'Verify all labels are legible', status: 'pass' },
      { id: '1.3', text: 'Inspect power cord for damage', status: 'pending' },
      { id: '1.4', text: 'Check filter condition', status: 'pending' },
    ],
  },
  {
    id: '2',
    category: 'Electrical Checks',
    items: [
      { id: '2.1', text: 'Ground resistance test', status: 'pass', expectedValue: '< 0.2 Ω' },
      { id: '2.2', text: 'Earth leakage current', status: 'pending', expectedValue: '< 500 µA' },
      { id: '2.3', text: 'Insulation resistance', status: 'pending', expectedValue: '> 2 MΩ' },
    ],
  },
  {
    id: '3',
    category: 'Mechanical Checks',
    items: [
      { id: '3.1', text: 'Inspect hinges and latches', status: 'pending' },
      { id: '3.2', text: 'Verify mounting stability', status: 'pending' },
      { id: '3.3', text: 'Check tubing connectors for wear', status: 'pending' },
    ],
  },
  {
    id: '4',
    category: 'Functional Checks',
    items: [
      { id: '4.1', text: 'Power on/off test', status: 'pass' },
      { id: '4.2', text: 'Self-test verification', status: 'pending' },
      { id: '4.3', text: 'Alarm testing', status: 'pending' },
    ],
  },
  {
    id: '5',
    category: 'Calibration Checks',
    items: [
      { id: '5.1', text: 'Oxygen sensor calibration', status: 'pending', expectedValue: '21-100%' },
      { id: '5.2', text: 'Flow sensor calibration', status: 'pending' },
    ],
  },
  {
    id: '6',
    category: 'Performance Verification',
    items: [
      { id: '6.1', text: 'Verify tidal volume accuracy (±10%)', status: 'pending', expectedValue: '300-700 mL' },
      { id: '6.2', text: 'Check respiratory rate range', status: 'pending', expectedValue: '4-60 bpm' },
      { id: '6.3', text: 'Verify FiO2 accuracy', status: 'pending', expectedValue: '21-100%' },
      { id: '6.4', text: 'Pressure relief test', status: 'pending', expectedValue: '≤ 60 cmH₂O' },
    ],
  },
  {
    id: '7',
    category: 'Safety Checks',
    items: [
      { id: '7.1', text: 'Verify alarm audibility', status: 'pending' },
      { id: '7.2', text: 'Backup battery autonomy test', status: 'pending', expectedValue: '≥ 60 min' },
      { id: '7.3', text: 'Emergency ventilation mode', status: 'pending' },
    ],
  },
]

export interface SparePart {
  partNumber: string
  description: string
  manufacturer: string
  compatibleModels: string[]
  stock: number
  reorderLevel: number
  estimatedCost: number
  supplier: string
}

export const partsData: SparePart[] = [
  {
    partNumber: 'PHI-OS-2847',
    description: 'Oxygen Sensor',
    manufacturer: 'Philips',
    compatibleModels: ['Trilogy Evo', 'Trilogy 200'],
    stock: 4,
    reorderLevel: 6,
    estimatedCost: 189.0,
    supplier: 'Philips Healthcare',
  },
  {
    partNumber: 'PHI-FL-100',
    description: 'Air Inlet Filter',
    manufacturer: 'Philips',
    compatibleModels: ['Trilogy Evo'],
    stock: 45,
    reorderLevel: 20,
    estimatedCost: 12.5,
    supplier: 'MedSupply Co.',
  },
  {
    partNumber: 'PHI-BP-500',
    description: 'Battery Pack (Li-Ion)',
    manufacturer: 'Philips',
    compatibleModels: ['Trilogy Evo', 'Trilogy 202'],
    stock: 8,
    reorderLevel: 4,
    estimatedCost: 320.0,
    supplier: 'Philips Healthcare',
  },
  {
    partNumber: 'PHI-TU-200',
    description: 'Patient Tubing Set',
    manufacturer: 'Philips',
    compatibleModels: ['Trilogy Evo'],
    stock: 100,
    reorderLevel: 30,
    estimatedCost: 28.75,
    supplier: 'MedSupply Co.',
  },
  {
    partNumber: 'PHI-FS-300',
    description: 'Flow Sensor',
    manufacturer: 'Philips',
    compatibleModels: ['Trilogy Evo', 'Trilogy 200'],
    stock: 2,
    reorderLevel: 5,
    estimatedCost: 245.0,
    supplier: 'Philips Healthcare',
  },
]

export interface Manual {
  id: string
  name: string
  category:
    | 'Operator Manual'
    | 'Service Manual'
    | 'Technical Bulletin'
    | 'Calibration Procedure'
    | 'Schematic'
    | 'Regulatory Document'
  type: string
  size: string
  pages: number
  updatedOn: string
}

export const manualsData: Manual[] = [
  { id: 'M-1', name: 'Service Manual', category: 'Service Manual', type: 'PDF', size: '28.7 MB', pages: 342, updatedOn: '2023-11-02' },
  { id: 'M-2', name: 'Operator Manual', category: 'Operator Manual', type: 'PDF', size: '12.4 MB', pages: 128, updatedOn: '2023-09-14' },
  { id: 'M-3', name: 'Calibration Procedure - Oxygen Sensor', category: 'Calibration Procedure', type: 'PDF', size: '4.2 MB', pages: 45, updatedOn: '2024-01-08' },
  { id: 'M-4', name: 'Technical Bulletin #TB-2024-01', category: 'Technical Bulletin', type: 'PDF', size: '1.1 MB', pages: 8, updatedOn: '2024-01-20' },
  { id: 'M-5', name: 'Pneumatic & Electrical Schematics', category: 'Schematic', type: 'PDF', size: '8.9 MB', pages: 24, updatedOn: '2022-06-30' },
  { id: 'M-6', name: 'FDA 510(k) Clearance Documentation', category: 'Regulatory Document', type: 'PDF', size: '2.3 MB', pages: 56, updatedOn: '2021-12-01' },
]

export interface HistoryRecord {
  id: string
  date: string
  type:
    | 'Preventive'
    | 'Corrective'
    | 'Calibration'
    | 'Repair'
    | 'Software Update'
  engineer: string
  summary: string
  detail: string
  partsReplaced: string[]
  serviceTime: string
  photos: number
}

export const historyData: HistoryRecord[] = [
  {
    id: 'TH-001',
    date: '2024-02-15',
    type: 'Corrective',
    engineer: 'John Doe',
    summary: 'Oxygen sensor calibration drift beyond limits',
    detail: 'Sensor replaced with new unit. Calibration completed successfully and verified against reference analyzer.',
    partsReplaced: ['Oxygen Sensor (PHI-OS-2847)'],
    serviceTime: '2.5 hours',
    photos: 3,
  },
  {
    id: 'TH-002',
    date: '2024-01-15',
    type: 'Preventive',
    engineer: 'Mike Johnson',
    summary: 'Quarterly preventive maintenance',
    detail: 'All systems operational. Air filter replaced as scheduled. Full safety checklist passed.',
    partsReplaced: ['Air Inlet Filter (PHI-FL-100)'],
    serviceTime: '1.5 hours',
    photos: 4,
  },
  {
    id: 'TH-003',
    date: '2023-12-20',
    type: 'Calibration',
    engineer: 'Jane Smith',
    summary: 'Tidal volume calibration verification',
    detail: 'Tidal volume verified within ±5% across full range. No adjustments required.',
    partsReplaced: [],
    serviceTime: '1 hour',
    photos: 2,
  },
  {
    id: 'TH-004',
    date: '2023-11-05',
    type: 'Software Update',
    engineer: 'John Doe',
    summary: 'Firmware updated to v4.2.1',
    detail: 'Applied manufacturer firmware update addressing alarm latency. Post-update validation completed.',
    partsReplaced: [],
    serviceTime: '0.75 hours',
    photos: 1,
  },
  {
    id: 'TH-005',
    date: '2023-09-10',
    type: 'Repair',
    engineer: 'Jane Smith',
    summary: 'Flow sensor inconsistent readings',
    detail: 'Flow sensor cleaned and recalibrated. Root cause: dust accumulation from environment.',
    partsReplaced: ['Flow Sensor (PHI-FS-300)'],
    serviceTime: '2 hours',
    photos: 2,
  },
]
