// Mock data and types for the Ticket workflow module.
//
// Workflow architecture overview
// --------------------------------
// A Ticket represents a *service request* that exists BEFORE a Service Order.
// Three creation paths feed the Service Order pipeline:
//   1. Equipment      -> "Create <type> Service Order" directly from an asset
//   2. Ticket         -> a request is reviewed, approved, then converted to a Service Order
//   3. Automated      -> future scheduled/predictive maintenance (placeholder only)
//
// This file intentionally uses in-memory mock data only. No persistence,
// authentication, or database layer is implemented yet — the goal is to lock
// in the correct workflow and data shape first.

export type TicketType =
  | 'corrective'
  | 'preventive-request'
  | 'calibration-request'
  | 'installation-request'
  | 'inspection-request'
  | 'technical-support'

export type TicketStatus =
  | 'new'
  | 'under-review'
  | 'approved'
  | 'rejected'
  | 'converted'

export type TicketPriority = 'critical' | 'high' | 'medium' | 'low'

export type RequesterRole =
  | 'Hospital Staff'
  | 'Field Engineer'
  | 'Customer'
  | 'Technical Support'

export interface TicketAttachment {
  id: string
  name: string
  type: string
  size: string
}

export interface Ticket {
  id: string
  ticketNumber: string
  title: string
  description: string
  // Related equipment is optional — some requests come in before the asset
  // is identified (e.g. a general technical support question).
  equipmentId?: string
  equipmentName?: string
  hospital?: string
  department?: string
  requester: string
  requesterRole: RequesterRole
  priority: TicketPriority
  type: TicketType
  status: TicketStatus
  attachments: TicketAttachment[]
  createdAt: string
  updatedAt: string
  // Populated once a supervisor converts the ticket into a service order.
  convertedOrderId?: string
  assignee?: string
}

export const ticketTypeConfig: Record<
  TicketType,
  { label: string; shortLabel: string; serviceOrderType: string }
> = {
  corrective: {
    label: 'Corrective Maintenance',
    shortLabel: 'Corrective',
    serviceOrderType: 'Corrective',
  },
  'preventive-request': {
    label: 'Preventive Maintenance Request',
    shortLabel: 'Preventive',
    serviceOrderType: 'Preventive',
  },
  'calibration-request': {
    label: 'Calibration Request',
    shortLabel: 'Calibration',
    serviceOrderType: 'Calibration',
  },
  'installation-request': {
    label: 'Installation Request',
    shortLabel: 'Installation',
    serviceOrderType: 'Installation',
  },
  'inspection-request': {
    label: 'Inspection Request',
    shortLabel: 'Inspection',
    serviceOrderType: 'Inspection',
  },
  'technical-support': {
    label: 'Technical Support',
    shortLabel: 'Support',
    serviceOrderType: 'Technical Support',
  },
}

export const ticketStatusConfig: Record<
  TicketStatus,
  { label: string; className: string }
> = {
  new: { label: 'New', className: 'bg-primary/10 text-primary' },
  'under-review': {
    label: 'Under Review',
    className: 'bg-warning/10 text-warning',
  },
  approved: { label: 'Approved', className: 'bg-success/10 text-success' },
  rejected: {
    label: 'Rejected',
    className: 'bg-destructive/10 text-destructive',
  },
  converted: {
    label: 'Converted to SO',
    className: 'bg-muted text-muted-foreground',
  },
}

export const ticketPriorityConfig: Record<
  TicketPriority,
  { label: string; className: string }
> = {
  critical: {
    label: 'Critical',
    className: 'bg-destructive text-destructive-foreground',
  },
  high: { label: 'High', className: 'bg-warning text-warning-foreground' },
  medium: { label: 'Medium', className: 'bg-secondary text-secondary-foreground' },
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
}

export const tickets: Ticket[] = [
  {
    id: 'TK-001',
    ticketNumber: 'TKT-2024-001',
    title: 'Ventilator alarm intermittently silent',
    description:
      'ICU staff report that the audible alarm on the ventilator occasionally fails to sound when triggered. Needs investigation before next shift.',
    equipmentId: 'EQ-001',
    equipmentName: 'Ventilator V-2847',
    hospital: 'Central Hospital',
    department: 'ICU',
    requester: 'Dr. Amelia Reyes',
    requesterRole: 'Hospital Staff',
    priority: 'high',
    type: 'corrective',
    status: 'new',
    attachments: [
      { id: 'a1', name: 'alarm-log.pdf', type: 'PDF', size: '240 KB' },
    ],
    createdAt: '2024-02-26',
    updatedAt: '2024-02-26',
  },
  {
    id: 'TK-002',
    ticketNumber: 'TKT-2024-002',
    title: 'Flow sensor reading drift discovered during PM',
    description:
      'While performing scheduled preventive maintenance I noticed the flow sensor drifting beyond tolerance. Recommend corrective service before the unit returns to use.',
    equipmentId: 'EQ-001',
    equipmentName: 'Ventilator V-2847',
    hospital: 'Central Hospital',
    department: 'ICU',
    requester: 'Mike Johnson',
    requesterRole: 'Field Engineer',
    priority: 'critical',
    type: 'corrective',
    status: 'under-review',
    attachments: [],
    createdAt: '2024-02-25',
    updatedAt: '2024-02-26',
  },
  {
    id: 'TK-003',
    ticketNumber: 'TKT-2024-003',
    title: 'Annual calibration due for infusion pumps',
    description:
      'Requesting calibration for the infusion pump fleet ahead of the annual accreditation audit.',
    equipmentId: 'EQ-008',
    equipmentName: 'Infusion Pump IP-3421',
    hospital: 'Emergency Center',
    department: 'Emergency',
    requester: 'Sarah Lin',
    requesterRole: 'Customer',
    priority: 'medium',
    type: 'calibration-request',
    status: 'approved',
    attachments: [],
    createdAt: '2024-02-22',
    updatedAt: '2024-02-24',
    assignee: 'Jane Smith',
  },
  {
    id: 'TK-004',
    ticketNumber: 'TKT-2024-004',
    title: 'New patient monitor installation request',
    description:
      'Cardiology has received two new patient monitors that require installation and commissioning.',
    equipmentName: 'Patient Monitor PM-9100',
    hospital: 'Regional Medical Center',
    department: 'Cardiology',
    requester: 'Facilities Team',
    requesterRole: 'Customer',
    priority: 'low',
    type: 'installation-request',
    status: 'new',
    attachments: [],
    createdAt: '2024-02-26',
    updatedAt: '2024-02-26',
  },
  {
    id: 'TK-005',
    ticketNumber: 'TKT-2024-005',
    title: 'Defibrillator self-test failing intermittently',
    description:
      'Emergency department reports the defibrillator occasionally fails its automated self-test. Urgent review required.',
    equipmentId: 'EQ-004',
    equipmentName: 'Defibrillator D-0892',
    hospital: 'Emergency Center',
    department: 'Emergency',
    requester: 'Night Shift Lead',
    requesterRole: 'Hospital Staff',
    priority: 'critical',
    type: 'corrective',
    status: 'new',
    attachments: [],
    createdAt: '2024-02-27',
    updatedAt: '2024-02-27',
  },
  {
    id: 'TK-006',
    ticketNumber: 'TKT-2024-006',
    title: 'Quarterly inspection request for surgery suite',
    description:
      'Requesting safety inspection of the anesthesia machines in the surgery suite as part of the quarterly compliance cycle.',
    equipmentId: 'EQ-006',
    equipmentName: 'Anesthesia Machine A-2134',
    hospital: 'Regional Medical Center',
    department: 'Surgery',
    requester: 'Compliance Office',
    requesterRole: 'Customer',
    priority: 'medium',
    type: 'inspection-request',
    status: 'under-review',
    attachments: [],
    createdAt: '2024-02-24',
    updatedAt: '2024-02-25',
  },
  {
    id: 'TK-007',
    ticketNumber: 'TKT-2024-007',
    title: 'Software guidance needed for monitor firmware',
    description:
      'Need technical guidance on the recommended firmware version for the patient monitor before applying an update.',
    equipmentId: 'EQ-007',
    equipmentName: 'Patient Monitor PM-8976',
    hospital: 'City Clinic',
    department: 'ICU',
    requester: 'Biomed Tech',
    requesterRole: 'Technical Support',
    priority: 'low',
    type: 'technical-support',
    status: 'rejected',
    attachments: [],
    createdAt: '2024-02-20',
    updatedAt: '2024-02-21',
  },
  {
    id: 'TK-008',
    ticketNumber: 'TKT-2024-008',
    title: 'CT scanner cooling warning during PM',
    description:
      'During preventive maintenance the engineer logged a cooling subsystem warning. Converted to a corrective service order for follow-up.',
    equipmentId: 'EQ-005',
    equipmentName: 'CT Scanner CT-4521',
    hospital: 'Central Hospital',
    department: 'Radiology',
    requester: 'John Doe',
    requesterRole: 'Field Engineer',
    priority: 'high',
    type: 'corrective',
    status: 'converted',
    attachments: [],
    createdAt: '2024-02-18',
    updatedAt: '2024-02-19',
    convertedOrderId: 'OS-2024-004',
    assignee: 'John Doe',
  },
]

// Tickets related to a specific piece of equipment (used by the Equipment
// Service Overview widget).
export function getTicketsForEquipment(equipmentId: string): Ticket[] {
  return tickets.filter((t) => t.equipmentId === equipmentId)
}

export type TicketQueue = Exclude<TicketStatus, 'converted'>

export function getTicketCounts() {
  return tickets.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] ?? 0) + 1
      return acc
    },
    {} as Record<TicketStatus, number>,
  )
}
