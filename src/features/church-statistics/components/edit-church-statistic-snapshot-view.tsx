import { ArrowLeft, BarChart3 } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurchStatisticSnapshotEditForm } from "@/features/church-statistics/components/church-statistic-snapshot-edit-form"

type EditChurchStatisticSnapshotViewProps = {
  snapshot: {
    id: string
    title: string
    asOfDate: string
    notes: string | null
    isActive: boolean
    metricCount: number
  }
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00.000Z`))
}

function EditChurchStatisticSnapshotView({ snapshot }: EditChurchStatisticSnapshotViewProps) {
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
            Edit Snapshot Statistik
          </h1>

          <Badge variant={snapshot.isActive ? "secondary" : "outline"}>
            {snapshot.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{snapshot.title}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Snapshot</CardTitle>
        </CardHeader>

        <CardContent>
          <ChurchStatisticSnapshotEditForm
            snapshot={{
              id: snapshot.id,
              title: snapshot.title,
              asOfDate: snapshot.asOfDate,
              notes: snapshot.notes,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Tanggal Statistik</p>

            <p className="mt-1 font-medium">{formatDate(snapshot.asOfDate)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>

            <p className="mt-1 font-medium">{snapshot.isActive ? "Aktif" : "Nonaktif"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Jumlah Data</p>

            <div className="mt-1 flex items-center gap-2 font-medium">
              <BarChart3 className="size-4" />
              {snapshot.metricCount}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export { EditChurchStatisticSnapshotView }
