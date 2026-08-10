import { Clock, MapPin, UserRound } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateBibleStudyScheduleForm } from "@/features/bible-study-schedules/components/create-bible-study-schedule-form"
import {
  type BibleStudyDayOfWeek,
  dayOfWeekLabels,
} from "@/features/bible-study-schedules/lib/day-of-week"

import { DeleteBibleStudyScheduleButton } from "./delete-bible-study-schedule-button"
import { ReorderBibleStudyScheduleButtons } from "./reorder-bible-study-schedule-buttons"
import { ToggleBibleStudyScheduleStatus } from "./toggle-bible-study-schedule-status"

type BibleStudyScheduleListItem = {
  id: string
  groupName: string
  dayOfWeek: BibleStudyDayOfWeek
  startTime: string
  location: string | null
  leaderName: string | null
  notes: string | null
  sortOrder: number
  isActive: boolean
}

type BibleStudyScheduleManagerProps = {
  schedules: BibleStudyScheduleListItem[]
}

function BibleStudyScheduleManager({ schedules }: BibleStudyScheduleManagerProps) {
  const activeCount = schedules.filter((schedule) => schedule.isActive).length
  const inactiveCount = schedules.length - activeCount

  const schedulesByDay = Object.entries(
    schedules.reduce<Partial<Record<BibleStudyDayOfWeek, BibleStudyScheduleListItem[]>>>(
      (groups, schedule) => {
        groups[schedule.dayOfWeek] ??= []
        groups[schedule.dayOfWeek]?.push(schedule)

        return groups
      },
      {}
    )
  ) as Array<[BibleStudyDayOfWeek, BibleStudyScheduleListItem[]]>

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Data Gereja</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Jadwal PA
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola jadwal Pendalaman Alkitab kelompok, waktu pelaksanaan, lokasi, dan pemimpin PA.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Kelompok
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{schedules.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aktif</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{activeCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nonaktif</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{inactiveCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <details>
            <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
              + Tambah Jadwal PA
            </summary>

            <div className="mt-6 border-t pt-6">
              <CreateBibleStudyScheduleForm />
            </div>
          </details>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-semibold">Daftar Jadwal PA</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {activeCount} dari {schedules.length} kelompok aktif
          </p>
        </div>

        {schedules.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm font-medium">Belum ada Jadwal PA</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan kelompok PA menggunakan formulir di atas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {schedulesByDay.map(([dayOfWeek, daySchedules]) => (
              <section key={dayOfWeek} className="space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold">{dayOfWeekLabels[dayOfWeek]}</h3>

                  <p className="text-sm text-muted-foreground">{daySchedules.length} kelompok</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {daySchedules.map((schedule, scheduleIndex) => (
                    <Card key={schedule.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <CardTitle>{schedule.groupName}</CardTitle>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="outline">{dayOfWeekLabels[schedule.dayOfWeek]}</Badge>
                              <Badge variant={schedule.isActive ? "secondary" : "outline"}>
                                {schedule.isActive ? "Aktif" : "Nonaktif"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-muted-foreground" />
                            <span>{schedule.startTime} WIB</span>
                          </div>
                          {schedule.location ? (
                            <div className="flex items-start gap-2">
                              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                              <span>{schedule.location}</span>
                            </div>
                          ) : null}
                          {schedule.leaderName ? (
                            <div className="flex items-center gap-2">
                              <UserRound className="size-4 text-muted-foreground" />
                              <span>{schedule.leaderName}</span>
                            </div>
                          ) : null}
                        </div>
                        {schedule.notes ? (
                          <p className="rounded-xl bg-muted/30 p-3 text-sm text-muted-foreground">
                            {schedule.notes}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-2 border-t pt-4">
                          <ReorderBibleStudyScheduleButtons
                            id={schedule.id}
                            groupName={schedule.groupName}
                            canMoveUp={scheduleIndex > 0}
                            canMoveDown={scheduleIndex < daySchedules.length - 1}
                          />
                          <ToggleBibleStudyScheduleStatus
                            id={schedule.id}
                            groupName={schedule.groupName}
                            isActive={schedule.isActive}
                          />
                          {!schedule.isActive ? (
                            <DeleteBibleStudyScheduleButton
                              id={schedule.id}
                              groupName={schedule.groupName}
                            />
                          ) : null}
                          <Link
                            href={`/admin/jadwal-pa/${schedule.id}/edit`}
                            className={buttonVariants({
                              variant: "outline",
                              size: "sm",
                            })}
                          >
                            Edit
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export { BibleStudyScheduleManager }
