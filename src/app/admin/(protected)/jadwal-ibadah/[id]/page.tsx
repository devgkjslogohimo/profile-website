import { notFound } from "next/navigation"

import { getActiveChurchLocations } from "@/features/church-locations/queries/get-active-church-locations"
import { WorshipScheduleDetail } from "@/features/worship-schedules/components/worship-schedule-detail"
import { getWorshipSchedule } from "@/features/worship-schedules/queries/get-worship-schedule"
import { getActiveWorshipServiceRoles } from "@/features/worship-service-roles/queries/get-active-worship-service-roles"

export default async function WorshipSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [schedule, locations, roles] = await Promise.all([
    getWorshipSchedule(id),
    getActiveChurchLocations(),
    getActiveWorshipServiceRoles(),
  ])

  if (!schedule) {
    notFound()
  }

  return <WorshipScheduleDetail schedule={schedule} locations={locations} roles={roles} />
}
