import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpdateBibleStudyScheduleForm } from "@/features/bible-study-schedules/components/update-bible-study-schedule-form"
import {
  type BibleStudyDayOfWeek,
  dayOfWeekLabels,
} from "@/features/bible-study-schedules/lib/day-of-week"

type EditBibleStudyScheduleViewProps = {
  schedule: {
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
}

function EditBibleStudyScheduleView({ schedule }: EditBibleStudyScheduleViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/jadwal-pa"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">Jadwal PA</p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Edit Jadwal PA
          </h1>

          <Badge variant={schedule.isActive ? "secondary" : "outline"}>
            {schedule.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{schedule.groupName}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Jadwal</CardTitle>
        </CardHeader>

        <CardContent>
          <UpdateBibleStudyScheduleForm schedule={schedule} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Hari</p>
            <p className="mt-1 font-medium">{dayOfWeekLabels[schedule.dayOfWeek]}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Urutan</p>
            <p className="mt-1 font-medium">{schedule.sortOrder}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="mt-1 font-medium">{schedule.isActive ? "Aktif" : "Nonaktif"}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export { EditBibleStudyScheduleView }
