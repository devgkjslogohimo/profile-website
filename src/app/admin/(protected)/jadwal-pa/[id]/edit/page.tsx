import { notFound } from "next/navigation"

import { EditBibleStudyScheduleView } from "@/features/bible-study-schedules/components/edit-bible-study-schedule-view"
import { getBibleStudySchedule } from "@/features/bible-study-schedules/queries/get-bible-study-schedule"

export default async function EditBibleStudySchedulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const schedule = await getBibleStudySchedule(id)

  if (!schedule) {
    notFound()
  }

  return <EditBibleStudyScheduleView schedule={schedule} />
}
