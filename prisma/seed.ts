import 'dotenv/config'
import {
  PrismaClient,
  EquipmentStatus,
  ServiceOrderType,
  ServiceOrderStatus,
  ServiceOrderOrigin,
  TimelineRole,
  Priority,
  UserRole,
} from '../lib/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env')
}

const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('🌱 Starting seed...')

  await prisma.serviceOrderTimelineEvent.deleteMany()
  await prisma.serviceHistory.deleteMany()
  await prisma.serviceOrder.deleteMany()
  await prisma.equipment.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  // ── Users ─────────────────────────────────────────────────
  const supervisor = await prisma.user.create({
    data: {
      name: 'Sarah Connor',
      email: 'sarah.connor@biosupp.mx',
      role: UserRole.SUPERVISOR,
    },
  })

  const engineer1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@biosupp.mx',
      role: UserRole.ENGINEER,
    },
  })

  const engineer2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@biosupp.mx',
      role: UserRole.ENGINEER,
    },
  })

  const engineer3 = await prisma.user.create({
    data: {
      name: 'Mike Johnson',
      email: 'mike.johnson@biosupp.mx',
      role: UserRole.ENGINEER,
    },
  })

  console.log('✅ Users created')

  // ── Organizations ─────────────────────────────────────────
  const hospitalCentral = await prisma.organization.create({
    data: {
      name: 'Hospital General de México',
      city: 'Ciudad de México',
      state: 'CDMX',
    },
  })

  const clinicaRegional = await prisma.organization.create({
    data: {
      name: 'Clínica Regional del Norte',
      city: 'Monterrey',
      state: 'Nuevo León',
    },
  })

  const hospitalCivil = await prisma.organization.create({
    data: {
      name: 'Hospital Civil de Guadalajara',
      city: 'Guadalajara',
      state: 'Jalisco',
    },
  })

  console.log('✅ Organizations created')

  // ── Equipment ─────────────────────────────────────────────
  const ventilador = await prisma.equipment.create({
    data: {
      name: 'Ventilator V-2847',
      category: 'Respiratory Therapy',
      manufacturer: 'Philips',
      model: 'Trilogy Evo',
      serialNumber: 'SN-2847-PHL-001',
      assetNumber: 'AST-100482',
      department: 'ICU',
      location: 'Hospital General de México - Building A, Floor 3',
      status: EquipmentStatus.OPERATIONAL,
      installDate: new Date('2022-03-10'),
      purchaseDate: new Date('2022-02-18'),
      lastServiceDate: new Date('2024-01-15'),
      nextServiceDate: new Date('2024-04-15'),
      hoursUsed: 8432,
      maxHours: 15000,
      contractType: 'Full Service',
      organizationId: hospitalCentral.id,
    },
  })

  const monitor = await prisma.equipment.create({
    data: {
      name: 'Patient Monitor MP-4521',
      category: 'Monitoring',
      manufacturer: 'GE Healthcare',
      model: 'CARESCAPE B650',
      serialNumber: 'SN-4521-GE-002',
      assetNumber: 'AST-100483',
      department: 'Emergency',
      location: 'Hospital General de México - Emergency',
      status: EquipmentStatus.NEEDS_ATTENTION,
      installDate: new Date('2021-06-15'),
      purchaseDate: new Date('2021-05-20'),
      lastServiceDate: new Date('2023-12-10'),
      nextServiceDate: new Date('2024-03-10'),
      hoursUsed: 12500,
      maxHours: 20000,
      contractType: 'Preventive Only',
      organizationId: hospitalCentral.id,
    },
  })

  const ecografo = await prisma.equipment.create({
    data: {
      name: 'Ultrasound EC-1204',
      category: 'Imaging',
      manufacturer: 'Siemens',
      model: 'ACUSON P500',
      serialNumber: 'SN-1204-SIE-003',
      assetNumber: 'AST-200101',
      department: 'Radiology',
      location: 'Clínica Regional del Norte - Floor 2',
      status: EquipmentStatus.MAINTENANCE,
      installDate: new Date('2020-09-01'),
      purchaseDate: new Date('2020-08-10'),
      lastServiceDate: new Date('2024-02-01'),
      nextServiceDate: new Date('2024-05-01'),
      hoursUsed: 5200,
      maxHours: 25000,
      contractType: 'Full Service',
      organizationId: clinicaRegional.id,
    },
  })

  const desfibrilador = await prisma.equipment.create({
    data: {
      name: 'Defibrillator D-0892',
      category: 'Cardiology',
      manufacturer: 'Zoll',
      model: 'R Series',
      serialNumber: 'SN-0892-ZOL-004',
      assetNumber: 'AST-300201',
      department: 'Emergency',
      location: 'Hospital Civil de Guadalajara - Emergency',
      status: EquipmentStatus.OPERATIONAL,
      installDate: new Date('2023-01-20'),
      purchaseDate: new Date('2023-01-05'),
      lastServiceDate: new Date('2024-01-20'),
      nextServiceDate: new Date('2024-07-20'),
      hoursUsed: 1200,
      maxHours: 10000,
      contractType: 'Warranty',
      organizationId: hospitalCivil.id,
    },
  })

  console.log('✅ Equipment created')

  // ── Service Orders (covering different lifecycle stages) ──

  // OS-001: in progress, corrective, high priority
  const order1 = await prisma.serviceOrder.create({
    data: {
      type: ServiceOrderType.CORRECTIVE_MAINTENANCE,
      status: ServiceOrderStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      title: 'Resolve oxygen sensor calibration error E-101',
      description: 'Diagnose sensor circuit, replace oxygen sensor, recalibrate.',
      scheduledAt: new Date('2024-02-16'),
      estimatedHours: 3,
      serviceLocation: 'Hospital General de México - Building A, Floor 3',
      objectives: 'Resolve oxygen sensor calibration error E-101.',
      activities: 'Diagnose sensor circuit, replace oxygen sensor, recalibrate.',
      requiredTools: ['Oxygen Analyzer', 'Digital Multimeter'],
      requiredParts: ['Oxygen Sensor (PHI-OS-2847)'],
      safetyRequirements: 'Disconnect from patient. Lockout power before service.',
      customerNotes: 'Coordinate with ICU charge nurse before removing unit.',
      requirements: {
        photos: true,
        measurements: true,
        checklist: true,
        testResults: true,
        partsUsage: true,
        engineerNotes: true,
        customerSignature: true,
      },
      findings: 'Oxygen sensor reading drifted beyond 5% tolerance.',
      laborHours: 1.5,
      equipmentId: ventilador.id,
      organizationId: hospitalCentral.id,
      assignedToId: engineer1.id,
      createdById: supervisor.id,
      origin: ServiceOrderOrigin.MANUAL,
    },
  })

  await prisma.serviceOrderTimelineEvent.createMany({
    data: [
      { serviceOrderId: order1.id, label: 'Service Order created', role: TimelineRole.SUPERVISOR, byUserId: supervisor.id },
      { serviceOrderId: order1.id, label: 'Assigned to John Doe', role: TimelineRole.SUPERVISOR, byUserId: supervisor.id },
      { serviceOrderId: order1.id, label: 'Service started', role: TimelineRole.ENGINEER, byUserId: engineer1.id },
    ],
  })

  // OS-002: assigned, preventive, medium priority
  const order2 = await prisma.serviceOrder.create({
    data: {
      type: ServiceOrderType.PREVENTIVE_MAINTENANCE,
      status: ServiceOrderStatus.ASSIGNED,
      priority: Priority.MEDIUM,
      title: 'Quarterly preventive maintenance',
      description: 'Quarterly preventive maintenance per manufacturer schedule.',
      scheduledAt: new Date('2024-02-18'),
      estimatedHours: 4,
      serviceLocation: 'Hospital General de México - Emergency',
      objectives: 'Quarterly preventive maintenance per manufacturer schedule.',
      requirements: {
        photos: true,
        measurements: false,
        checklist: true,
        testResults: false,
        partsUsage: true,
        engineerNotes: true,
        customerSignature: true,
      },
      equipmentId: monitor.id,
      organizationId: hospitalCentral.id,
      assignedToId: engineer2.id,
      createdById: supervisor.id,
      origin: ServiceOrderOrigin.MANUAL,
    },
  })

  await prisma.serviceOrderTimelineEvent.createMany({
    data: [
      { serviceOrderId: order2.id, label: 'Service Order created', role: TimelineRole.SUPERVISOR, byUserId: supervisor.id },
      { serviceOrderId: order2.id, label: 'Assigned to Jane Smith', role: TimelineRole.SUPERVISOR, byUserId: supervisor.id },
    ],
  })

  // OS-003: pending parts, corrective, critical
  const order3 = await prisma.serviceOrder.create({
    data: {
      type: ServiceOrderType.CORRECTIVE_MAINTENANCE,
      status: ServiceOrderStatus.PENDING_PARTS,
      priority: Priority.CRITICAL,
      title: 'Battery not charging - urgent repair',
      scheduledAt: new Date('2024-02-15'),
      estimatedHours: 2,
      serviceLocation: 'Hospital Civil de Guadalajara - Emergency',
      objectives: 'Battery not charging - urgent repair.',
      requiredParts: ['Battery Pack (PHI-BP-500)'],
      requirements: {
        photos: true,
        measurements: false,
        checklist: true,
        testResults: true,
        partsUsage: true,
        engineerNotes: true,
        customerSignature: true,
      },
      findings: 'Charging circuit fault confirmed. Replacement battery pack on order.',
      laborHours: 1,
      equipmentId: desfibrilador.id,
      organizationId: hospitalCivil.id,
      assignedToId: engineer3.id,
      createdById: supervisor.id,
      origin: ServiceOrderOrigin.MANUAL,
    },
  })

  await prisma.serviceOrderTimelineEvent.createMany({
    data: [
      { serviceOrderId: order3.id, label: 'Service Order created', role: TimelineRole.SUPERVISOR, byUserId: supervisor.id },
      { serviceOrderId: order3.id, label: 'Assigned to Mike Johnson', role: TimelineRole.SUPERVISOR, byUserId: supervisor.id },
      { serviceOrderId: order3.id, label: 'Service started', role: TimelineRole.ENGINEER, byUserId: engineer3.id },
      { serviceOrderId: order3.id, label: 'Paused - waiting for battery pack', role: TimelineRole.ENGINEER, byUserId: engineer3.id, note: 'PHI-BP-500 out of stock, ETA 2 days' },
    ],
  })

  // OS-004: draft, installation, no engineer assigned yet
  const order4 = await prisma.serviceOrder.create({
    data: {
      type: ServiceOrderType.INSTALLATION,
      status: ServiceOrderStatus.DRAFT,
      priority: Priority.MEDIUM,
      title: 'Install and commission new ultrasound unit',
      scheduledAt: new Date('2024-02-22'),
      estimatedHours: 6,
      serviceLocation: 'Clínica Regional del Norte - Floor 2',
      objectives: 'Install and commission new ultrasound unit.',
      requirements: {
        photos: true,
        measurements: false,
        checklist: true,
        testResults: false,
        partsUsage: true,
        engineerNotes: true,
        customerSignature: true,
      },
      equipmentId: ecografo.id,
      organizationId: clinicaRegional.id,
      createdById: supervisor.id,
      origin: ServiceOrderOrigin.MANUAL,
    },
  })

  await prisma.serviceOrderTimelineEvent.create({
    data: {
      serviceOrderId: order4.id,
      label: 'Service Order created (draft)',
      role: TimelineRole.SUPERVISOR,
      byUserId: supervisor.id,
    },
  })

  console.log('✅ Service Orders created')

  // ── Service History (linked to completed orders where relevant) ──
  await prisma.serviceHistory.create({
    data: {
      type: ServiceOrderType.PREVENTIVE_MAINTENANCE,
      date: new Date('2024-01-15'),
      summary: 'Quarterly preventive maintenance completed',
      detail: 'All systems operational. Air filter replaced as scheduled. Full safety checklist passed.',
      partsReplaced: ['Air Inlet Filter (PHI-FL-100)'],
      serviceTime: 1.5,
      findings: 'No critical findings. Battery at 87% capacity.',
      equipmentId: ventilador.id,
      engineerId: engineer1.id,
    },
  })

  await prisma.serviceHistory.create({
    data: {
      type: ServiceOrderType.CORRECTIVE_MAINTENANCE,
      date: new Date('2024-02-15'),
      summary: 'Oxygen sensor calibration drift corrected',
      detail: 'Sensor replaced with new unit. Calibration completed successfully and verified against reference analyzer.',
      partsReplaced: ['Oxygen Sensor (PHI-OS-2847)'],
      serviceTime: 2.5,
      findings: '2 drift events in 90 days — consider proactive replacement at next PM.',
      equipmentId: ventilador.id,
      engineerId: engineer1.id,
      serviceOrderId: order1.id,
    },
  })

  await prisma.serviceHistory.create({
    data: {
      type: ServiceOrderType.CALIBRATION,
      date: new Date('2023-12-10'),
      summary: 'Tidal volume calibration verification',
      detail: 'Tidal volume verified within ±5% across full range. No adjustments required.',
      partsReplaced: [],
      serviceTime: 1.0,
      findings: 'Calibration within specifications.',
      equipmentId: ventilador.id,
      engineerId: engineer2.id,
    },
  })

  console.log('✅ Service History created')
  console.log('🎉 Seed completed successfully')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
