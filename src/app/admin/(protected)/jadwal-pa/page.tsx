import { BibleStudyScheduleManager } from "@/features/bible-study-schedules/components/bible-study-schedule-manager"
import { getBibleStudySchedules } from "@/features/bible-study-schedules/queries/get-bible-study-schedules"

export default async function BibleStudySchedulesPage() {
  const schedules = await getBibleStudySchedules()

  return <BibleStudyScheduleManager schedules={schedules} />
}
