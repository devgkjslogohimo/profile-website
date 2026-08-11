import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurchStatisticMetricEditForm } from "@/features/church-statistics/components/church-statistic-metric-edit-form"

type EditChurchStatisticMetricViewProps = {
  snapshot: {
    id: string
    title: string
  }
  metric: {
    id: string
    snapshotId: string
    category: string
    label: string
    value: number
    unit: string | null
    isActive: boolean
  }
}

function EditChurchStatisticMetricView({ snapshot, metric }: EditChurchStatisticMetricViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href={`/admin/statistik/${snapshot.id}`}
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">{snapshot.title}</p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Edit Data Statistik
          </h1>

          <Badge variant={metric.isActive ? "secondary" : "outline"}>
            {metric.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {metric.category} · {metric.label}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Statistik</CardTitle>
        </CardHeader>

        <CardContent>
          <ChurchStatisticMetricEditForm
            metric={{
              id: metric.id,
              snapshotId: metric.snapshotId,
              category: metric.category,
              label: metric.label,
              value: metric.value,
              unit: metric.unit,
            }}
          />
        </CardContent>
      </Card>
    </main>
  )
}

export { EditChurchStatisticMetricView }
