import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function getWorshipSchedule(id: string) {
  await requirePermission("church.manage")

  return prisma.worshipSchedule.findUnique({
    where: {
      id,
    },
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
          churchLocationId: true,
          churchLocation: {
            select: {
              id: true,
              name: true,
              type: true,
              isActive: true,
            },
          },
          assignments: {
            select: {
              id: true,
              personName: true,
              sortOrder: true,
              worshipServiceRoleId: true,
              worshipServiceRole: {
                select: {
                  id: true,
                  name: true,
                  sortOrder: true,
                  isActive: true,
                },
              },
            },
            orderBy: {
              sortOrder: "asc",
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
  })
}

export { getWorshipSchedule }
