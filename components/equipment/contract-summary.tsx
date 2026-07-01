'use client'

import { FileText } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// TODO: Connect to real Contract/PMPlan/Warranty models once the
// Contracts module is built (Phase: Contracts Management).
export function ContractSummary({ contractType }: { contractType: string | null }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileText className="size-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Contract Summary</CardTitle>
            <CardDescription>Maintenance coverage &amp; obligations</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed p-4 text-center">
          <p className="text-sm font-medium">
            {contractType ?? 'No contract on record'}
          </p>
          <p className="text-xs text-muted-foreground">
            Detailed contract tracking is coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
