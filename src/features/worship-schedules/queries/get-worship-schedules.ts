import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function getWorshipSchedules() {
  await requirePermission("church.manage")

  return prisma.worshipSchedule.findMany({
    select: {
      id: true,
      date: true,
      isPublished: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      services: {
        select: {
          id: true,
          name: true,
          startsAt: true,
          sortOrder: true,

          _count: {
            select: {
              assignments: true,
            },
          },

          churchLocation: {
            select: {
              id: true,
              name: true,
              type: true,
              isActive: true,
            },
          },
        },
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            startsAt: "asc",
          },
        ],
      },
    },
    orderBy: {
      date: "desc",
    },
  })
}

export { getWorshipSchedules }
