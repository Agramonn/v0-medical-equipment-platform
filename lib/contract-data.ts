// Contract Management, Warranty Tracking & Preventive Maintenance Planning
// (Phase 2 business layer).
//
// CORE BUSINESS RULE
// ------------------
// Preventive Maintenance does NOT originate from Service Orders.
// Service Orders are *execution records* — they prove what was done.
//
// Maintenance OBLIGATIONS originate from:
//   - Contracts            (commercial agreement with a customer)
//   - Warranties           (manufacturer / company coverage on equipment)
//   - Service Agreements   (modeled here as a Contract coverage type)
//   - Maintenance Plans    (PM Plans derived from contract line items)
//
// The flow is:
//   Customer Organization
//        └── Contract (coverage type, dates, status)
//                └── Contract Line Item (equipment + PM/calibration frequency + SLA)
//                        └── PM Plan (schedule: last PM, next PM, upcoming count)
//                                └── (FUTURE) auto-generated Service Order
//
// This file is intentionally persistence-agnostic so it can later be backed
// by a real database without changing any UI contracts.

// ---------------------------------------------------------------------------
// Customer Organizations
// ---------------------------------------------------------------------------

export type CustomerType =
  | 'Hospital'
  | 'Clinic'
  | 'Government'
  | 'Distributor'
  | 'Private Customer'

export type OrganizationStatus = 'active' | 'inactive' | 'prospect'

export interface CustomerContact {
  id: string
  name: string
  role: string
  email: string
  phone: string
}

export interface CustomerOrganization {
  id: string
  name: string
  type: CustomerType
  address: string
  city: string
  status: OrganizationStatus
  contacts: CustomerContact[]
  // Convenience aggregate for list views (denormalized; computed elsewhere later).
  equipmentCount: number
}

export const customerTypeConfig: Record<
  CustomerType,
  { label: CustomerType; className: string }
> = {
  Hospital: { label: 'Hospital', className: 'bg-primary/10 text-primary' },
  Clinic: { label: 'Clinic', className: 'bg-secondary text-secondary-foreground' },
  Government: { label: 'Government', className: 'bg-warning/10 text-warning' },
  Distributor: { label: 'Distributor', className: 'bg-success/10 text-success' },
  'Private Customer': {
    label: 'Private Customer',
    className: 'bg-muted text-muted-foreground',
  },
}

// ---------------------------------------------------------------------------
// Contracts
// ---------------------------------------------------------------------------

// Coverage type defines WHAT services must occur and how they are paid for.
export type CoverageType =
  | 'Manufacturer Warranty'
  | 'Company Warranty'
  | 'Full Service Contract'
  | 'PM Only Contract'
  | 'Calibration Contract'
  | 'Time and Materials'

export type ContractStatus = 'active' | 'expiring-soon' | 'expired' | 'suspended'

export const coverageTypeConfig: Record<
  CoverageType,
  { label: CoverageType; short: string; className: string }
> = {
  'Manufacturer Warranty': {
    label: 'Manufacturer Warranty',
    short: 'OEM Warranty',
    className: 'bg-secondary text-secondary-foreground',
  },
  'Company Warranty': {
    label: 'Company Warranty',
    short: 'Company Warranty',
    className: 'bg-secondary text-secondary-foreground',
  },
  'Full Service Contract': {
    label: 'Full Service Contract',
    short: 'Full Service',
    className: 'bg-primary/10 text-primary',
  },
  'PM Only Contract': {
    label: 'PM Only Contract',
    short: 'PM Only',
    className: 'bg-success/10 text-success',
  },
  'Calibration Contract': {
    label: 'Calibration Contract',
    short: 'Calibration',
    className: 'bg-warning/10 text-warning',
  },
  'Time and Materials': {
    label: 'Time and Materials',
    short: 'T&M',
    className: 'bg-muted text-muted-foreground',
  },
}

export const contractStatusConfig: Record<
  ContractStatus,
  { label: string; className: string }
> = {
  active: { label: 'Active', className: 'bg-success/10 text-success' },
  'expiring-soon': { label: 'Expiring Soon', className: 'bg-warning/10 text-warning' },
  expired: { label: 'Expired', className: 'bg-destructive/10 text-destructive' },
  suspended: { label: 'Suspended', className: 'bg-muted text-muted-foreground' },
}

// How often a service obligation recurs.
export type MaintenanceFrequency =
  | 'Monthly'
  | 'Quarterly'
  | 'Semiannual'
  | 'Annual'
  | 'Custom'

// Number of times per year each frequency implies (used to derive schedules).
export const frequencyPerYear: Record<MaintenanceFrequency, number> = {
  Monthly: 12,
  Quarterly: 4,
  Semiannual: 2,
  Annual: 1,
  Custom: 0,
}

// A covered piece of equipment within a contract. This is where the
// maintenance obligation is actually DEFINED.
export interface ContractLineItem {
  id: string
  contractId: string
  equipmentId: string
  equipmentName: string
  // Obligations defined by the contract:
  pmFrequency: MaintenanceFrequency
  calibrationFrequency: MaintenanceFrequency | 'None'
  coverageType: CoverageType
  includedVisits: number // visits included per year
  // Service Level Agreement (response/coverage commitment).
  sla: string // e.g. "24h response", "Next business day"
  partsCoverage: 'Full Parts Coverage' | 'Labor Only' | 'Parts at Cost'
}

export interface Contract {
  id: string
  contractNumber: string
  customerId: string
  customerName: string
  startDate: string
  endDate: string
  status: ContractStatus
  coverageType: CoverageType
  notes: string
  value: number
  slaCompliance: number
  lineItems: ContractLineItem[]
}

// ---------------------------------------------------------------------------
// Warranty Tracking (per equipment)
// ---------------------------------------------------------------------------

export type WarrantyState = 'active' | 'expiring-soon' | 'expired'

export interface ManufacturerWarranty {
  startDate: string
  endDate: string
  oemProvider: string
}

export interface CompanyWarranty {
  startDate: string
  endDate: string
  coverageDetails: string
}

export interface EquipmentWarranty {
  equipmentId: string
  manufacturer: ManufacturerWarranty | null
  company: CompanyWarranty | null
}

// ---------------------------------------------------------------------------
// Preventive Maintenance Plans
// ---------------------------------------------------------------------------
//
// A PM Plan is the *schedule* derived from a contract line item. It is the
// bridge between a commercial obligation (contract) and execution records
// (service orders). PM Plans are what will LATER auto-generate Service Orders.

export type PmPlanType = 'Preventive Maintenance' | 'Calibration'

export interface PmPlan {
  id: string
  // Origin of the obligation — every PM plan MUST trace back to a contract.
  contractId: string
  contractNumber: string
  lineItemId: string
  equipmentId: string
  equipmentName: string
  customerName: string
  planType: PmPlanType
  frequency: MaintenanceFrequency
  lastServiceDate: string | null
  nextDueDate: string
  // How many obligations remain in the current contract period.
  upcomingPmCount: number
  // FUTURE ARCHITECTURE: when a PM plan generates a service order, the
  // generated SO id is recorded here. Generation is NOT implemented yet.
  generatedServiceOrderIds: string[]
  // Whether this plan is eligible to auto-generate a service order now.
  // (Used by the future scheduler; computed via isDueForGeneration().)
  autoGenerateEnabled: boolean
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const customerOrganizations: CustomerOrganization[] = [
  {
    id: 'ORG-001',
    name: 'Central Hospital',
    type: 'Hospital',
    address: '500 Medical Plaza Dr',
    city: 'New York, NY',
    status: 'active',
    equipmentCount: 438,
    contacts: [
      {
        id: 'C-001',
        name: 'Dr. Sarah Johnson',
        role: 'Chief Medical Officer',
        email: 'sjohnson@centralhospital.com',
        phone: '+1 (555) 111-1111',
      },
      {
        id: 'C-002',
        name: 'Robert Lin',
        role: 'Biomedical Manager',
        email: 'rlin@centralhospital.com',
        phone: '+1 (555) 111-2222',
      },
    ],
  },
  {
    id: 'ORG-002',
    name: 'Regional Medical Center',
    type: 'Hospital',
    address: '1200 Health Sciences Blvd',
    city: 'Los Angeles, CA',
    status: 'active',
    equipmentCount: 616,
    contacts: [
      {
        id: 'C-003',
        name: 'Mike Chen',
        role: 'Biomedical Director',
        email: 'mchen@regionalmed.com',
        phone: '+1 (555) 222-2222',
      },
    ],
  },
  {
    id: 'ORG-003',
    name: 'City Clinic',
    type: 'Clinic',
    address: '88 Downtown Ave',
    city: 'Chicago, IL',
    status: 'active',
    equipmentCount: 291,
    contacts: [
      {
        id: 'C-004',
        name: 'Emily Davis',
        role: 'Operations Manager',
        email: 'edavis@cityclinic.com',
        phone: '+1 (555) 333-3333',
      },
    ],
  },
  {
    id: 'ORG-004',
    name: 'State Health Department',
    type: 'Government',
    address: '1 Capitol Mall',
    city: 'Sacramento, CA',
    status: 'active',
    equipmentCount: 154,
    contacts: [
      {
        id: 'C-005',
        name: 'James Wilson',
        role: 'Procurement Lead',
        email: 'jwilson@statehealth.gov',
        phone: '+1 (555) 444-4444',
      },
    ],
  },
  {
    id: 'ORG-005',
    name: 'MedEquip Distributors',
    type: 'Distributor',
    address: '4500 Industrial Pkwy',
    city: 'Houston, TX',
    status: 'active',
    equipmentCount: 87,
    contacts: [
      {
        id: 'C-006',
        name: 'Laura Gomez',
        role: 'Account Manager',
        email: 'lgomez@medequipdist.com',
        phone: '+1 (555) 555-5555',
      },
    ],
  },
]

export const contracts: Contract[] = [
  {
    id: 'CTR-001',
    contractNumber: 'CT-2023-0142',
    customerId: 'ORG-001',
    customerName: 'Central Hospital',
    startDate: '2024-01-01',
    endDate: '2027-12-31',
    status: 'active',
    coverageType: 'Full Service Contract',
    notes: 'Full service coverage across ICU and surgical equipment.',
    value: 450000,
    slaCompliance: 98.5,
    lineItems: [
      {
        id: 'LI-001',
        contractId: 'CTR-001',
        equipmentId: 'EQ-001',
        equipmentName: 'Ventilator V-2847',
        pmFrequency: 'Quarterly',
        calibrationFrequency: 'Annual',
        coverageType: 'Full Service Contract',
        includedVisits: 4,
        sla: '24h response',
        partsCoverage: 'Full Parts Coverage',
      },
      {
        id: 'LI-002',
        contractId: 'CTR-001',
        equipmentId: 'EQ-014',
        equipmentName: 'Infusion Pump IP-560',
        pmFrequency: 'Semiannual',
        calibrationFrequency: 'Annual',
        coverageType: 'Full Service Contract',
        includedVisits: 2,
        sla: '24h response',
        partsCoverage: 'Full Parts Coverage',
      },
    ],
  },
  {
    id: 'CTR-002',
    contractNumber: 'CT-2022-0098',
    customerId: 'ORG-002',
    customerName: 'Regional Medical Center',
    startDate: '2023-06-01',
    endDate: '2027-05-31',
    status: 'active',
    coverageType: 'PM Only Contract',
    notes: 'Preventive maintenance only. Repairs billed as Time & Materials.',
    value: 180000,
    slaCompliance: 96.2,
    lineItems: [
      {
        id: 'LI-003',
        contractId: 'CTR-002',
        equipmentId: 'EQ-022',
        equipmentName: 'MRI Scanner MX-3T',
        pmFrequency: 'Monthly',
        calibrationFrequency: 'Quarterly',
        coverageType: 'PM Only Contract',
        includedVisits: 12,
        sla: 'Next business day',
        partsCoverage: 'Labor Only',
      },
    ],
  },
  {
    id: 'CTR-003',
    contractNumber: 'CT-2024-0011',
    customerId: 'ORG-003',
    customerName: 'City Clinic',
    startDate: '2024-08-01',
    endDate: '2026-08-01',
    status: 'expiring-soon',
    coverageType: 'Calibration Contract',
    notes: 'Annual calibration program for laboratory analyzers.',
    value: 64000,
    slaCompliance: 99.1,
    lineItems: [
      {
        id: 'LI-004',
        contractId: 'CTR-003',
        equipmentId: 'EQ-031',
        equipmentName: 'Blood Analyzer BA-200',
        pmFrequency: 'Semiannual',
        calibrationFrequency: 'Quarterly',
        coverageType: 'Calibration Contract',
        includedVisits: 4,
        sla: '48h response',
        partsCoverage: 'Parts at Cost',
      },
    ],
  },
  {
    id: 'CTR-004',
    contractNumber: 'CT-2024-0033',
    customerId: 'ORG-004',
    customerName: 'State Health Department',
    startDate: '2025-03-01',
    endDate: '2028-02-28',
    status: 'active',
    coverageType: 'Company Warranty',
    notes: 'Company warranty bundled with equipment purchase.',
    value: 0,
    slaCompliance: 100,
    lineItems: [
      {
        id: 'LI-005',
        contractId: 'CTR-004',
        equipmentId: 'EQ-040',
        equipmentName: 'Defibrillator DF-90',
        pmFrequency: 'Annual',
        calibrationFrequency: 'None',
        coverageType: 'Company Warranty',
        includedVisits: 1,
        sla: 'Next business day',
        partsCoverage: 'Full Parts Coverage',
      },
    ],
  },
  {
    id: 'CTR-005',
    contractNumber: 'CT-2021-0077',
    customerId: 'ORG-005',
    customerName: 'MedEquip Distributors',
    startDate: '2021-03-01',
    endDate: '2024-02-29',
    status: 'expired',
    coverageType: 'Time and Materials',
    notes: 'Expired distributor agreement pending renewal.',
    value: 95000,
    slaCompliance: 94.5,
    lineItems: [],
  },
]

// PM Plans are DERIVED from contract line items. Each one traces back to its
// originating contract — this enforces the rule that PM cannot exist without
// a commercial obligation behind it.
export const pmPlans: PmPlan[] = [
  {
    id: 'PM-001',
    contractId: 'CTR-001',
    contractNumber: 'CT-2023-0142',
    lineItemId: 'LI-001',
    equipmentId: 'EQ-001',
    equipmentName: 'Ventilator V-2847',
    customerName: 'Central Hospital',
    planType: 'Preventive Maintenance',
    frequency: 'Quarterly',
    lastServiceDate: '2026-04-15',
    nextDueDate: '2026-07-15',
    upcomingPmCount: 3,
    generatedServiceOrderIds: [],
    autoGenerateEnabled: true,
  },
  {
    id: 'PM-002',
    contractId: 'CTR-001',
    contractNumber: 'CT-2023-0142',
    lineItemId: 'LI-001',
    equipmentId: 'EQ-001',
    equipmentName: 'Ventilator V-2847',
    customerName: 'Central Hospital',
    planType: 'Calibration',
    frequency: 'Annual',
    lastServiceDate: '2023-12-20',
    nextDueDate: '2024-12-20',
    upcomingPmCount: 1,
    generatedServiceOrderIds: [],
    autoGenerateEnabled: true,
  },
  {
    id: 'PM-003',
    contractId: 'CTR-001',
    contractNumber: 'CT-2023-0142',
    lineItemId: 'LI-002',
    equipmentId: 'EQ-014',
    equipmentName: 'Infusion Pump IP-560',
    customerName: 'Central Hospital',
    planType: 'Preventive Maintenance',
    frequency: 'Semiannual',
    lastServiceDate: '2024-02-01',
    nextDueDate: '2024-08-01',
    upcomingPmCount: 2,
    generatedServiceOrderIds: [],
    autoGenerateEnabled: true,
  },
  {
    id: 'PM-004',
    contractId: 'CTR-002',
    contractNumber: 'CT-2022-0098',
    lineItemId: 'LI-003',
    equipmentId: 'EQ-022',
    equipmentName: 'MRI Scanner MX-3T',
    customerName: 'Regional Medical Center',
    planType: 'Preventive Maintenance',
    frequency: 'Monthly',
    lastServiceDate: '2024-02-10',
    nextDueDate: '2024-03-10',
    upcomingPmCount: 12,
    generatedServiceOrderIds: [],
    autoGenerateEnabled: true,
  },
  {
    id: 'PM-005',
    contractId: 'CTR-003',
    contractNumber: 'CT-2024-0011',
    lineItemId: 'LI-004',
    equipmentId: 'EQ-031',
    equipmentName: 'Blood Analyzer BA-200',
    customerName: 'City Clinic',
    planType: 'Calibration',
    frequency: 'Quarterly',
    lastServiceDate: '2024-01-05',
    nextDueDate: '2024-04-05',
    upcomingPmCount: 4,
    generatedServiceOrderIds: [],
    autoGenerateEnabled: false,
  },
  {
    id: 'PM-006',
    contractId: 'CTR-004',
    contractNumber: 'CT-2024-0033',
    lineItemId: 'LI-005',
    equipmentId: 'EQ-040',
    equipmentName: 'Defibrillator DF-90',
    customerName: 'State Health Department',
    planType: 'Preventive Maintenance',
    frequency: 'Annual',
    lastServiceDate: null,
    nextDueDate: '2024-09-01',
    upcomingPmCount: 1,
    generatedServiceOrderIds: [],
    autoGenerateEnabled: true,
  },
]

// Per-equipment warranty records (manufacturer + company coverage).
export const equipmentWarranties: EquipmentWarranty[] = [
  {
    equipmentId: 'EQ-001',
    manufacturer: {
      startDate: '2022-02-18',
      endDate: '2026-02-18',
      oemProvider: 'Philips Healthcare',
    },
    company: {
      startDate: '2026-02-19',
      endDate: '2027-02-18',
      coverageDetails: 'Extended labor & parts coverage after OEM warranty.',
    },
  },
]

// ---------------------------------------------------------------------------
// Derived helpers (persistence-agnostic business logic)
// ---------------------------------------------------------------------------

const DAY = 1000 * 60 * 60 * 24

export function daysUntil(dateStr: string, from: Date = new Date()): number {
  const target = new Date(dateStr).getTime()
  return Math.round((target - from.getTime()) / DAY)
}

// Warranty state from an end date (expiring soon = within 60 days).
export function getWarrantyState(
  endDate: string | null | undefined,
  from: Date = new Date(),
): WarrantyState | null {
  if (!endDate) return null
  const remaining = daysUntil(endDate, from)
  if (remaining < 0) return 'expired'
  if (remaining <= 60) return 'expiring-soon'
  return 'active'
}

export const warrantyStateConfig: Record<
  WarrantyState,
  { label: string; className: string }
> = {
  active: { label: 'Active Warranty', className: 'bg-success/10 text-success' },
  'expiring-soon': {
    label: 'Expiring Soon',
    className: 'bg-warning/10 text-warning',
  },
  expired: { label: 'Expired Warranty', className: 'bg-destructive/10 text-destructive' },
}

export function getContractById(id: string): Contract | undefined {
  return contracts.find((c) => c.id === id)
}

export function getOrganizationById(id: string): CustomerOrganization | undefined {
  return customerOrganizations.find((o) => o.id === id)
}

// Find the active contract that covers a given equipment id.
export function getActiveContractForEquipment(
  equipmentId: string,
): { contract: Contract; lineItem: ContractLineItem } | null {
  for (const contract of contracts) {
    if (contract.status === 'expired' || contract.status === 'suspended') continue
    const lineItem = contract.lineItems.find((li) => li.equipmentId === equipmentId)
    if (lineItem) return { contract, lineItem }
  }
  return null
}

export function getWarrantyForEquipment(
  equipmentId: string,
): EquipmentWarranty | undefined {
  return equipmentWarranties.find((w) => w.equipmentId === equipmentId)
}

export function getPmPlansForEquipment(equipmentId: string): PmPlan[] {
  return pmPlans.filter((p) => p.equipmentId === equipmentId)
}

export function getPmPlansForContract(contractId: string): PmPlan[] {
  return pmPlans.filter((p) => p.contractId === contractId)
}

// ---------------------------------------------------------------------------
// FUTURE ARCHITECTURE: PM Plan -> Service Order generation
// ---------------------------------------------------------------------------
//
// Generation is NOT implemented yet. These pure helpers prepare the workflow
// so a future scheduler (cron / server action) can:
//   1. find plans that are due,
//   2. build a Service Order draft from the plan + contract obligation,
//   3. record the generated SO id back on the plan.
//
// The UI already surfaces this readiness via the PM Plans table.

// A plan is "due for generation" when it is enabled and within the lead window.
export function isDueForGeneration(
  plan: PmPlan,
  leadDays = 14,
  from: Date = new Date(),
): boolean {
  if (!plan.autoGenerateEnabled) return false
  return daysUntil(plan.nextDueDate, from) <= leadDays
}

// Shape a future Service Order draft will take. This intentionally mirrors the
// fields the SO module already understands (serviceType, equipment, origin).
export interface PmGeneratedServiceOrderDraft {
  serviceType: PmPlanType
  equipmentId: string
  equipmentName: string
  customerName: string
  contractId: string
  pmPlanId: string
  scheduledDate: string
  origin: 'pm-plan'
}

// Pure transform — does NOT persist anything. Ready for the future scheduler.
export function buildServiceOrderDraftFromPlan(
  plan: PmPlan,
): PmGeneratedServiceOrderDraft {
  return {
    serviceType: plan.planType,
    equipmentId: plan.equipmentId,
    equipmentName: plan.equipmentName,
    customerName: plan.customerName,
    contractId: plan.contractId,
    pmPlanId: plan.id,
    scheduledDate: plan.nextDueDate,
    origin: 'pm-plan',
  }
}
