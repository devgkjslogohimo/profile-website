import { BarChart3 } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurchStatisticSnapshotCreateForm } from "@/features/church-statistics/components/church-statistic-snapshot-create-form"
import { DeleteChurchStatisticSnapshotButton } from "@/features/church-statistics/components/delete-church-statistic-snapshot-button"
import { ToggleChurchStatisticSnapshotStatus } from "@/features/church-statistics/components/toggle-church-statistic-snapshot-status"

type ChurchStatisticSnapshotListItem = {
  id: string
  title: string
  asOfDate: Date
  notes: string | null
  isActive: boolean
  _count: {
    metrics: number
  }
}

type ChurchStatisticSnapshotManagerProps = {
  snapshots: ChurchStatisticSnapshotListItem[]
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function formatDate(date: Date) {
  return dateFormatter.format(date)
}

function ChurchStatisticSnapshotManager({ snapshots }: ChurchStatisticSnapshotManagerProps) {
  const activeCount = snapshots.filter((snapshot) => snapshot.isActive).length

  const inactiveCount = snapshots.length - activeCount

  const latestSnapshot = snapshots[0] ?? null

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Data Gereja</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Statistik Jemaat
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola snapshot dan data statistik jemaat GKJ Slogohimo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Snapshot
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-muted-foreground" />

              <p className="text-2xl font-semibold">{snapshots.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Snapshot Terbaru
            </CardTitle>
          </CardHeader>

          <CardContent>
            {latestSnapshot ? (
              <>
                <p className="text-sm font-semibold">{latestSnapshot.title}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(latestSnapshot.asOfDate)}
                </p>
              </>
            ) : (
              <p className="text-sm font-medium">Belum ada</p>
            )}
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

            <p className="mt-1 text-xs text-muted-foreground">{inactiveCount} nonaktif</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <details>
            <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
              + Tambah Snapshot Statistik
            </summary>

            <div className="mt-6 border-t pt-6">
              <ChurchStatisticSnapshotCreateForm />
            </div>
          </details>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-semibold">Daftar Snapshot</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Snapshot diurutkan berdasarkan tanggal statistik terbaru.
          </p>
        </div>

        {snapshots.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm font-medium">Belum ada snapshot statistik</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan snapshot menggunakan formulir di atas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {snapshots.map((snapshot) => (
              <Card key={snapshot.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <CardTitle className="wrap-break-word">{snapshot.title}</CardTitle>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Per {formatDate(snapshot.asOfDate)}
                      </p>
                    </div>

                    <Badge variant={snapshot.isActive ? "secondary" : "outline"}>
                      {snapshot.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {snapshot.notes ? (
                    <p className="text-sm text-muted-foreground">{snapshot.notes}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Belum ada catatan.</p>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="size-4 text-muted-foreground" />

                    <span>{snapshot._count.metrics} data statistik</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                    <Link
                      href={`/admin/statistik/${snapshot.id}`}
                      className={buttonVariants({
                        size: "sm",
                      })}
                    >
                      Kelola Data
                    </Link>

                    <Link
                      href={`/admin/statistik/${snapshot.id}/edit`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      Edit Snapshot
                    </Link>

                    <ToggleChurchStatisticSnapshotStatus
                      id={snapshot.id}
                      title={snapshot.title}
                      isActive={snapshot.isActive}
                    />

                    {!snapshot.isActive && snapshot._count.metrics === 0 ? (
                      <DeleteChurchStatisticSnapshotButton
                        id={snapshot.id}
                        title={snapshot.title}
                      />
                    ) : null}
                  </div>

                  {!snapshot.isActive && snapshot._count.metrics > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Snapshot tidak dapat dihapus karena masih memiliki data statistik.
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export { ChurchStatisticSnapshotManager }
