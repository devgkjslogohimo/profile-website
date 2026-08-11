import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurchStatisticMetricCreateForm } from "@/features/church-statistics/components/church-statistic-metric-create-form"
import { DeleteChurchStatisticMetricButton } from "@/features/church-statistics/components/delete-church-statistic-metric-button"
import { ReorderChurchStatisticMetricButtons } from "@/features/church-statistics/components/reorder-church-statistic-metric-buttons"
import { ToggleChurchStatisticMetricStatus } from "@/features/church-statistics/components/toggle-church-statistic-metric-status"

type StatisticSnapshot = {
  id: string
  title: string
  asOfDate: Date
  notes: string | null
  isActive: boolean
}

type StatisticMetric = {
  id: string
  snapshotId: string
  category: string
  label: string
  value: number
  unit: string | null
  sortOrder: number
  isActive: boolean
}

type ChurchStatisticMetricManagerProps = {
  snapshot: StatisticSnapshot
  metrics: StatisticMetric[]
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

const numberFormatter = new Intl.NumberFormat("id-ID")

function groupMetrics(metrics: StatisticMetric[]) {
  const groups = new Map<string, StatisticMetric[]>()

  for (const metric of metrics) {
    const existingGroup = groups.get(metric.category)

    if (existingGroup) {
      existingGroup.push(metric)
      continue
    }

    groups.set(metric.category, [metric])
  }

  return Array.from(groups.entries())
}

function ChurchStatisticMetricManager({ snapshot, metrics }: ChurchStatisticMetricManagerProps) {
  const groups = groupMetrics(metrics)
  const activeCount = metrics.filter((metric) => metric.isActive).length

  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/statistik"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">Statistik Jemaat</p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            {snapshot.title}
          </h1>

          <Badge variant={snapshot.isActive ? "secondary" : "outline"}>
            {snapshot.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Data per {dateFormatter.format(snapshot.asOfDate)}
        </p>

        {snapshot.notes ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{snapshot.notes}</p>
        ) : null}

        <div className="mt-4">
          <Link
            href={`/admin/statistik/${snapshot.id}/edit`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
          >
            <Pencil />
            Edit Snapshot
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Data</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{metrics.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kategori</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{groups.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status Konten
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm font-medium">{activeCount} aktif</p>

            <p className="mt-1 text-xs text-muted-foreground">
              {metrics.length - activeCount} nonaktif
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <details>
            <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
              + Tambah Data Statistik
            </summary>

            <div className="mt-6 border-t pt-6">
              <ChurchStatisticMetricCreateForm snapshotId={snapshot.id} />
            </div>
          </details>
        </CardContent>
      </Card>

      {metrics.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm font-medium">Belum ada data statistik</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Tambahkan data statistik menggunakan formulir di atas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {groups.map(([category, categoryMetrics]) => (
            <section key={category} className="space-y-3">
              <div>
                <h2 className="font-serif text-xl font-semibold">{category}</h2>

                <p className="mt-1 text-sm text-muted-foreground">{categoryMetrics.length} data</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {categoryMetrics.map((metric, index) => (
                  <Card key={metric.id}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-medium">{metric.label}</p>

                          <p className="mt-2 text-2xl font-semibold">
                            {numberFormatter.format(metric.value)}
                            {metric.unit ? (
                              <span className="ml-1 text-sm font-normal text-muted-foreground">
                                {metric.unit}
                              </span>
                            ) : null}
                          </p>
                        </div>

                        <Badge variant={metric.isActive ? "secondary" : "outline"}>
                          {metric.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                        <ReorderChurchStatisticMetricButtons
                          id={metric.id}
                          label={metric.label}
                          canMoveUp={index > 0}
                          canMoveDown={index < categoryMetrics.length - 1}
                        />

                        <ToggleChurchStatisticMetricStatus
                          id={metric.id}
                          label={metric.label}
                          isActive={metric.isActive}
                        />

                        <Link
                          href={`/admin/statistik/${snapshot.id}/metric/${metric.id}/edit`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          Edit
                        </Link>

                        {!metric.isActive ? (
                          <DeleteChurchStatisticMetricButton id={metric.id} label={metric.label} />
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}

export { ChurchStatisticMetricManager }
