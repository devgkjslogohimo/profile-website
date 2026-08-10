import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function getBibleStudySchedules() {
  await requirePermission("church.manage")

  return prisma.bibleStudySchedule.findMany({
    select: {
      id: true,
      groupName: true,
      dayOfWeek: true,
      startTime: true,
      location: true,
      leaderName: true,
      notes: true,
      sortOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [
      {
        dayOfWeek: "asc",
      },
      {
        sortOrder: "asc",
      },
      {
        groupName: "asc",
      },
    ],
  })
}

export { getBibleStudySchedules }
