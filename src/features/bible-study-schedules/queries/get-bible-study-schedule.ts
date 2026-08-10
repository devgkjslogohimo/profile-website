import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function getBibleStudySchedule(id: string) {
  await requirePermission("church.manage")

  return prisma.bibleStudySchedule.findUnique({
    where: {
      id,
    },
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
  })
}

export { getBibleStudySchedule }
