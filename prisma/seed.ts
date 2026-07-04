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
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env')
}

const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter } as any)

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

async function main() {
  console.log('🌱 Starting seed...')

  // Limpieza en el orden correcto para respetar las foreign keys
  await prisma.serviceOrderTimelineEvent.deleteMany()
  await prisma.serviceHistory.deleteMany()
  await prisma.serviceOrder.deleteMany()
  await prisma.contractEquipment.deleteMany()
  await prisma.equipment.deleteMany()
  await prisma.manual.deleteMany()
  await prisma.contract.deleteMany()
  await prisma.warranty.deleteMany()
  await prisma.equipmentModel.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()


  // ── Users ─────────────────────────────────────────────────
  const supervisorHash = await hashPassword('supervisor123')
  const engineerHash = await hashPassword('engineer123')

  const supervisor = await prisma.user.create({
    data: {
      name: 'Sarah Connor',
      email: 'sarah.connor@biosupp.mx',
      password: supervisorHash,
      role: UserRole.SUPERVISOR,
    },
  })

  const engineer1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@biosupp.mx',
      password: engineerHash,
      role: UserRole.ENGINEER,
    },
  })

  const engineer2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@biosupp.mx',
      password: engineerHash,
      role: UserRole.ENGINEER,
    },
  })

  const engineer3 = await prisma.user.create({
    data: {
      name: 'Mike Johnson',
      email: 'mike.johnson@biosupp.mx',
      password: engineerHash,
      role: UserRole.ENGINEER,
    },
  })

  console.log('✅ Users created')

  // ── Organizations ─────────────────────────────────────────
  const hospitalCentral = await prisma.organization.create({
    data: {
      name: 'Hospital General de México',
      type: 'STATE_HOSPITAL',
      address: 'Dr. Balmis 148, Doctores',
      city: 'Ciudad de México',
      state: 'CDMX',
      phone: '55 2789 2000',
      email: 'contacto@hgm.salud.gob.mx',
      website: 'www.hgm.salud.gob.mx',
      contacts: {
        create: [
          {
            name: 'Dr. Roberto Fuentes',
            role: 'Chief of Biomedical Engineering',
            email: 'r.fuentes@hgm.salud.gob.mx',
            phone: '55 2789 2001',
            isPrimary: true,
          },
          {
            name: 'Lic. Carmen Vidal',
            role: 'Procurement Manager',
            email: 'c.vidal@hgm.salud.gob.mx',
            phone: '55 2789 2002',
            isPrimary: false,
          },
        ],
      },
    },
  })

  const clinicaRegional = await prisma.organization.create({
    data: {
      name: 'Clínica Regional del Norte',
      type: 'IMSS',
      address: 'Av. Constitución 1900, Centro',
      city: 'Monterrey',
      state: 'Nuevo León',
      phone: '81 8346 1000',
      email: 'contacto@imss-mty.gob.mx',
      contacts: {
        create: [
          {
            name: 'Ing. Marco Téllez',
            role: 'Biomedical Engineer',
            email: 'm.tellez@imss.gob.mx',
            phone: '81 8346 1050',
            isPrimary: true,
          },
        ],
      },
    },
  })

  const hospitalCivil = await prisma.organization.create({
    data: {
      name: 'Hospital Civil de Guadalajara',
      type: 'STATE_HOSPITAL',
      address: 'Calle Hospital 278, El Retiro',
      city: 'Guadalajara',
      state: 'Jalisco',
      phone: '33 3030 5000',
      email: 'biomedica@hcg.gob.mx',
      contacts: {
        create: [
          {
            name: 'Dra. Sofía Herrera',
            role: 'Hospital Director',
            email: 's.herrera@hcg.gob.mx',
            phone: '33 3030 5001',
            isPrimary: true,
          },
          {
            name: 'Ing. Pablo Mora',
            role: 'Maintenance Supervisor',
            email: 'p.mora@hcg.gob.mx',
            phone: '33 3030 5020',
            isPrimary: false,
          },
        ],
      },
    },
  })

  console.log('✅ Organizations created')

  // ── Equipment Models (El Catálogo) ────────────────────────
  const modelVentilador = await prisma.equipmentModel.create({
    data: {
      name: 'Ventilator',
      category: 'Respiratory Therapy',
      manufacturer: 'Philips',
      model: 'Trilogy Evo',
    },
  })

  const modelMonitor = await prisma.equipmentModel.create({
    data: {
      name: 'Patient Monitor',
      category: 'Monitoring',
      manufacturer: 'GE Healthcare',
      model: 'CARESCAPE B650',
    },
  })

  const modelEcografo = await prisma.equipmentModel.create({
    data: {
      name: 'Ultrasound System',
      category: 'Imaging',
      manufacturer: 'Siemens',
      model: 'ACUSON P500',
    },
  })

  const modelDesfibrilador = await prisma.equipmentModel.create({
    data: {
      name: 'Defibrillator',
      category: 'Cardiology',
      manufacturer: 'Zoll',
      model: 'R Series',
    },
  })

  console.log('✅ Equipment Models created')

  // ── Equipment Units (Las unidades físicas) ────────────────
  const ventilador = await prisma.equipment.create({
    data: {
      equipmentModelId: modelVentilador.id,
      organizationId: hospitalCentral.id,
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
    },
  })

  const monitor = await prisma.equipment.create({
    data: {
      equipmentModelId: modelMonitor.id,
      organizationId: hospitalCentral.id,
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
    },
  })

  const ecografo = await prisma.equipment.create({
    data: {
      equipmentModelId: modelEcografo.id,
      organizationId: clinicaRegional.id,
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
    },
  })

  const desfibrilador = await prisma.equipment.create({
    data: {
      equipmentModelId: modelDesfibrilador.id,
      organizationId: hospitalCivil.id,
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
    },
  })

  console.log('✅ Equipment Units created')

  // ── Service Orders ────────────────────────────────────────
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

  // ── Service History ───────────────────────────────────────
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

  // ── Contracts ──────────────────────────────────────────────
  console.log('🌱 Creating contracts...')

  const contract1 = await prisma.contract.create({
    data: {
      contractNumber: 'LPN-HGM-2024-001',
      type: 'PUBLIC_BID',
      status: 'ACTIVE',
      clientId: hospitalCentral.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      totalValue: 850000,
      currency: 'MXN',
      notes: 'Preventive and corrective maintenance contract awarded through public bidding. Includes ICU ventilators and patient monitors.',
    },
  })

  const contract2 = await prisma.contract.create({
    data: {
      contractNumber: 'COMOD-CRN-2024-003',
      type: 'LOAN_AGREEMENT',
      status: 'ACTIVE',
      clientId: clinicaRegional.id,
      startDate: new Date('2024-03-15'),
      endDate: new Date('2027-03-14'),
      totalValue: null, // Loan agreement — equipment is provided, not sold
      currency: 'MXN',
      notes: 'Loan agreement for a Siemens ultrasound system. The hospital pays for consumables while we maintain the equipment.',
    },
  })

  const contract3 = await prisma.contract.create({
    data: {
      contractNumber: 'PRIV-HCG-2024-007',
      type: 'PRIVATE',
      status: 'ACTIVE',
      clientId: hospitalCivil.id,
      startDate: new Date('2024-01-20'),
      endDate: new Date('2025-01-19'),
      totalValue: 120000,
      currency: 'MXN',
      notes: 'Private maintenance contract for a defibrillator under extended warranty.',
    },
  })

  // Equipment coverage by contract
  await prisma.contractEquipment.createMany({
    data: [
      {
        contractId: contract1.id,
        equipmentModelId: ventilador.equipmentModelId,
        coverageType: 'FULL_SERVICE',
        pmVisitsPerYear: 4,
        slaHours: 24,
        includesParts: true,
        includesLabor: true,
      },
      {
        contractId: contract1.id,
        equipmentModelId: monitor.equipmentModelId,
        coverageType: 'PREVENTIVE_ONLY',
        pmVisitsPerYear: 2,
        slaHours: 48,
        includesParts: false,
        includesLabor: true,
      },
      {
        contractId: contract2.id,
        equipmentModelId: ecografo.equipmentModelId,
        coverageType: 'LOAN_AGREEMENT',
        pmVisitsPerYear: 2,
        slaHours: 72,
        includesParts: false,
        includesLabor: true,
        notes: 'Includes 2 preventive maintenance visits per year. Transducers are not included.',
      },
      {
        contractId: contract3.id,
        equipmentModelId: desfibrilador.equipmentModelId,
        coverageType: 'WARRANTY',
        pmVisitsPerYear: 1,
        slaHours: 48,
        includesParts: true,
        includesLabor: true,
      },
    ],
  })

  // Warranties by physical equipment unit
  await prisma.warranty.createMany({
    data: [
      {
        equipmentId: ventilador.id,
        providerType: 'MANUFACTURER',
        providerName: 'Philips Healthcare',
        startDate: new Date('2022-03-10'),
        endDate: new Date('2026-03-10'),
        coverageType: 'PARTS_AND_LABOR',
        notes: '4-year extended manufacturer warranty.',
      },
      {
        equipmentId: desfibrilador.id,
        providerType: 'BOTH',
        providerName: 'Zoll Medical / BioSupp',
        startDate: new Date('2023-01-20'),
        endDate: new Date('2025-01-20'),
        coverageType: 'PARTS_AND_LABOR',
        notes: '2-year manufacturer warranty. Distributor provides additional labor coverage.',
      },
    ],
  })

  console.log('✅ Contracts and warranties created')

  console.log('✅ Service history created')
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