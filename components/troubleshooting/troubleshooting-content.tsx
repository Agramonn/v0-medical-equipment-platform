'use client'

import * as React from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  FileText,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Play,
  Search,
  Wrench,
  Zap,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

// Mock troubleshooting data
const commonIssues = [
  {
    id: '1',
    equipment: 'Ventilator',
    brand: 'Philips',
    issue: 'Error Code E-101: Oxygen Sensor Calibration',
    severity: 'high',
    frequency: 'Common',
    estimatedTime: '30-60 min',
    steps: [
      { step: 1, title: 'Access Service Menu', description: 'Press and hold SERVICE button for 5 seconds', risk: 'low' },
      { step: 2, title: 'Navigate to Calibration', description: 'Select Sensors > O2 Sensor > Calibration', risk: 'low' },
      { step: 3, title: 'Run Auto-Calibration', description: 'Ensure room air reference, start calibration sequence', risk: 'medium' },
      { step: 4, title: 'Verify Results', description: 'Check readings: 20.9% ± 0.5% for room air', risk: 'low' },
      { step: 5, title: 'Replace if Failed', description: 'If calibration fails, replace sensor (Part: PHI-OS-2847)', risk: 'medium' },
    ],
  },
  {
    id: '2',
    equipment: 'MRI Scanner',
    brand: 'Siemens',
    issue: 'Cooling System Temperature Warning',
    severity: 'critical',
    frequency: 'Occasional',
    estimatedTime: '1-2 hours',
    steps: [
      { step: 1, title: 'Check Ambient Temperature', description: 'Verify room temperature is within 18-24°C range', risk: 'low' },
      { step: 2, title: 'Inspect Coolant Level', description: 'Check coolant reservoir level and top up if needed', risk: 'low' },
      { step: 3, title: 'Clean Air Filters', description: 'Remove and clean all HVAC filters around the magnet room', risk: 'low' },
      { step: 4, title: 'Check Chiller Operation', description: 'Verify chiller is running and temperatures are nominal', risk: 'medium' },
      { step: 5, title: 'Contact Siemens Support', description: 'If issue persists, escalate to Siemens field service', risk: 'high' },
    ],
  },
  {
    id: '3',
    equipment: 'Defibrillator',
    brand: 'Zoll',
    issue: 'Battery Not Charging',
    severity: 'high',
    frequency: 'Occasional',
    estimatedTime: '30-45 min',
    steps: [
      { step: 1, title: 'Inspect Battery Contacts', description: 'Check for corrosion or debris on battery terminals', risk: 'low' },
      { step: 2, title: 'Test with Known Good Battery', description: 'Install a confirmed working battery to isolate issue', risk: 'low' },
      { step: 3, title: 'Check Charger Cradle', description: 'Verify charger LED indicators and AC power supply', risk: 'low' },
      { step: 4, title: 'Replace Battery', description: 'If battery is faulty, replace with new unit', risk: 'low' },
      { step: 5, title: 'Replace Charger Board', description: 'If charger is faulty, replace charge controller PCB', risk: 'high' },
    ],
  },
]

const diagnosticChecklists = [
  {
    category: 'Pre-Service Safety',
    items: [
      { id: 's1', label: 'Equipment is powered off and unplugged', required: true },
      { id: 's2', label: 'Area is clear of patients and unauthorized personnel', required: true },
      { id: 's3', label: 'Personal protective equipment worn', required: true },
      { id: 's4', label: 'Service manual and tools available', required: false },
    ],
  },
  {
    category: 'Visual Inspection',
    items: [
      { id: 'v1', label: 'Check for physical damage or wear', required: true },
      { id: 'v2', label: 'Inspect cables and connections', required: true },
      { id: 'v3', label: 'Verify indicator lights and displays', required: true },
      { id: 'v4', label: 'Check for fluid leaks or contamination', required: true },
    ],
  },
  {
    category: 'Functional Testing',
    items: [
      { id: 'f1', label: 'Power-on self-test completed successfully', required: true },
      { id: 'f2', label: 'All alarms and alerts functioning', required: true },
      { id: 'f3', label: 'User interface responsive', required: true },
      { id: 'f4', label: 'Measured values within specification', required: true },
    ],
  },
]

function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>
    case 'high':
      return <Badge className="bg-warning text-warning-foreground">High</Badge>
    case 'medium':
      return <Badge variant="secondary">Medium</Badge>
    case 'low':
      return <Badge variant="outline">Low</Badge>
    default:
      return <Badge variant="outline">{severity}</Badge>
  }
}

function getRiskIndicator(risk: string) {
  switch (risk) {
    case 'high':
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="mr-1 size-3" />
          High Risk
        </Badge>
      )
    case 'medium':
      return (
        <Badge className="bg-warning text-warning-foreground text-xs">
          <AlertTriangle className="mr-1 size-3" />
          Caution
        </Badge>
      )
    default:
      return null
  }
}

function GuidedDiagnostic() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [checkedItems, setCheckedItems] = React.useState<string[]>([])
  const issue = commonIssues[0]

  const toggleItem = (id: string) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((item) => item !== id))
    } else {
      setCheckedItems([...checkedItems, id])
    }
  }

  const progress = (currentStep / issue.steps.length) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              Guided Diagnostic
            </CardTitle>
            <CardDescription>{issue.issue}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Step {currentStep + 1} of {issue.steps.length}</p>
            <p className="text-xs text-muted-foreground">Est. {issue.estimatedTime}</p>
          </div>
        </div>
        <Progress value={progress} className="h-2 mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Step */}
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
              {issue.steps[currentStep].step}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{issue.steps[currentStep].title}</h3>
                {getRiskIndicator(issue.steps[currentStep].risk)}
              </div>
              <p className="text-muted-foreground">{issue.steps[currentStep].description}</p>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous Step
          </Button>
          <div className="flex items-center gap-2">
            {issue.steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  'size-2 rounded-full transition-colors',
                  index === currentStep ? 'bg-primary' : 'bg-muted',
                  index < currentStep && 'bg-success'
                )}
              />
            ))}
          </div>
          {currentStep < issue.steps.length - 1 ? (
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              Next Step
              <ChevronRight className="ml-2 size-4" />
            </Button>
          ) : (
            <Button className="bg-success hover:bg-success/90">
              <CheckCircle2 className="mr-2 size-4" />
              Complete Diagnostic
            </Button>
          )}
        </div>

        {/* All Steps Overview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">All Steps</h4>
          <div className="space-y-1">
            {issue.steps.map((step, index) => (
              <div
                key={step.step}
                className={cn(
                  'flex items-center gap-3 rounded-lg p-2 transition-colors cursor-pointer',
                  index === currentStep && 'bg-accent',
                  index < currentStep && 'text-muted-foreground'
                )}
                onClick={() => setCurrentStep(index)}
              >
                <div className={cn(
                  'flex size-6 items-center justify-center rounded-full text-xs font-medium',
                  index < currentStep && 'bg-success text-success-foreground',
                  index === currentStep && 'bg-primary text-primary-foreground',
                  index > currentStep && 'bg-muted text-muted-foreground'
                )}>
                  {index < currentStep ? <CheckCircle2 className="size-4" /> : step.step}
                </div>
                <span className="text-sm">{step.title}</span>
                {getRiskIndicator(step.risk)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DiagnosticChecklist() {
  const [checkedItems, setCheckedItems] = React.useState<string[]>([])

  const toggleItem = (id: string) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((item) => item !== id))
    } else {
      setCheckedItems([...checkedItems, id])
    }
  }

  const totalItems = diagnosticChecklists.reduce((acc, cat) => acc + cat.items.length, 0)
  const progress = (checkedItems.length / totalItems) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">Diagnostic Checklist</CardTitle>
            <CardDescription>Complete all required checks before service</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold">{checkedItems.length}/{totalItems}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['Pre-Service Safety']} className="space-y-2">
          {diagnosticChecklists.map((category) => {
            const categoryCompleted = category.items.every((item) => checkedItems.includes(item.id))
            return (
              <AccordionItem key={category.category} value={category.category} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    {categoryCompleted ? (
                      <CheckCircle2 className="size-5 text-success" />
                    ) : (
                      <CircleDot className="size-5 text-muted-foreground" />
                    )}
                    <span>{category.category}</span>
                    <Badge variant="secondary" className="ml-2">
                      {category.items.filter((item) => checkedItems.includes(item.id)).length}/{category.items.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <Checkbox
                          id={item.id}
                          checked={checkedItems.includes(item.id)}
                          onCheckedChange={() => toggleItem(item.id)}
                        />
                        <label
                          htmlFor={item.id}
                          className={cn(
                            'text-sm cursor-pointer flex-1',
                            checkedItems.includes(item.id) && 'text-muted-foreground line-through'
                          )}
                        >
                          {item.label}
                        </label>
                        {item.required && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  )
}

export function TroubleshootingContent() {
  const [equipmentFilter, setEquipmentFilter] = React.useState<string>('all')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Troubleshooting</h1>
          <p className="text-muted-foreground">
            Guided diagnostics and step-by-step troubleshooting procedures
          </p>
        </div>
        <Button>
          <MessageSquare className="mr-2 size-4" />
          Ask AI Assistant
        </Button>
      </div>

      <Tabs defaultValue="guides" className="space-y-4">
        <TabsList>
          <TabsTrigger value="guides">Troubleshooting Guides</TabsTrigger>
          <TabsTrigger value="diagnostic">Guided Diagnostic</TabsTrigger>
          <TabsTrigger value="checklist">Checklists</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-4">
          {/* Search & Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search issues..." className="pl-9" />
                </div>
                <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Equipment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Equipment</SelectItem>
                    <SelectItem value="ventilator">Ventilators</SelectItem>
                    <SelectItem value="mri">MRI Scanners</SelectItem>
                    <SelectItem value="defibrillator">Defibrillators</SelectItem>
                    <SelectItem value="ct">CT Scanners</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Issue Cards */}
          <div className="grid gap-4 lg:grid-cols-2">
            {commonIssues.map((issue) => (
              <Card key={issue.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{issue.equipment}</Badge>
                      <Badge variant="secondary">{issue.brand}</Badge>
                    </div>
                    {getSeverityBadge(issue.severity)}
                  </div>
                  <CardTitle className="text-base mt-2">{issue.issue}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span>{issue.frequency}</span>
                    <span>•</span>
                    <span>{issue.steps.length} steps</span>
                    <span>•</span>
                    <span>{issue.estimatedTime}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {issue.steps.slice(0, 3).map((step) => (
                      <div key={step.step} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex size-5 items-center justify-center rounded-full bg-muted text-xs">
                          {step.step}
                        </div>
                        <span>{step.title}</span>
                      </div>
                    ))}
                    {issue.steps.length > 3 && (
                      <p className="text-sm text-muted-foreground pl-7">
                        +{issue.steps.length - 3} more steps...
                      </p>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Play className="mr-2 size-4" />
                    Start Troubleshooting
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="diagnostic">
          <GuidedDiagnostic />
        </TabsContent>

        <TabsContent value="checklist">
          <DiagnosticChecklist />
        </TabsContent>
      </Tabs>
    </div>
  )
}
