import { WorshipScheduleManager } from "@/features/worship-schedules/components/worship-schedule-manager"
import { getWorshipSchedules } from "@/features/worship-schedules/queries/get-worship-schedules"

export default async function WorshipSchedulesPage() {
  const schedules = await getWorshipSchedules()

  return <WorshipScheduleManager schedules={schedules} />
}
