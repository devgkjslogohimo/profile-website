import { CalendarDays } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateScheduleForm } from "@/features/worship-schedules/components/create-schedule-form"
import { DeleteScheduleButton } from "@/features/worship-schedules/components/delete-schedule-button"
import { formatPublishedAt, formatScheduleDate } from "@/features/worship-schedules/lib/format"

type WorshipScheduleListItem = {
  id: string
  date: Date
  isPublished: boolean
  publishedAt: Date | null
  services: {
    id: string
    name: string
    startsAt: Date
    sortOrder: number
    churchLocation: {
      id: string
      name: string
      type: "CHURCH" | "PEPANTHAN"
      isActive: boolean
    }
    _count: {
      assignments: number
    }
  }[]
}

type WorshipScheduleManagerProps = {
  schedules: WorshipScheduleListItem[]
}

function WorshipScheduleManager({ schedules }: WorshipScheduleManagerProps) {
  const publishedCount = schedules.filter((schedule) => schedule.isPublished).length
  const draftCount = schedules.length - publishedCount

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Data Gereja</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Jadwal Ibadah
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola tanggal, lokasi, jam, dan publikasi jadwal ibadah GKJ Slogohimo beserta pepanthan.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Jadwal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{schedules.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dipublikasikan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{publishedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{draftCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Jadwal</CardTitle>
          <p className="text-sm text-muted-foreground">
            Buat satu paket jadwal untuk satu tanggal.
          </p>
        </CardHeader>

        <CardContent>
          <CreateScheduleForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Jadwal</CardTitle>
          <p className="text-sm text-muted-foreground">
            Jadwal terbaru ditampilkan terlebih dahulu.
          </p>
        </CardHeader>

        <CardContent>
          {schedules.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <CalendarDays className="mx-auto size-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">Belum ada jadwal ibadah</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan tanggal jadwal menggunakan formulir di atas.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {schedules.map((schedule) => {
                const label = formatScheduleDate(schedule.date)

                const assignmentCount = schedule.services.reduce(
                  (total, service) => total + service._count.assignments,
                  0
                )

                return (
                  <div
                    key={schedule.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{label}</p>

                        <Badge variant={schedule.isPublished ? "secondary" : "outline"}>
                          {schedule.isPublished ? "Terbit" : "Draft"}
                        </Badge>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {schedule.services.length} ibadah · {assignmentCount} petugas
                      </p>

                      {schedule.publishedAt ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Terakhir terbit {formatPublishedAt(schedule.publishedAt)} WIB
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {!schedule.isPublished ? (
                        <DeleteScheduleButton id={schedule.id} label={label} />
                      ) : null}

                      <Link
                        href={`/admin/jadwal-ibadah/${schedule.id}`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Kelola
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export { WorshipScheduleManager }
