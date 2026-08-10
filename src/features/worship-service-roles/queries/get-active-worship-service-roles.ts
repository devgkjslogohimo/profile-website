import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function getActiveWorshipServiceRoles() {
  await requirePermission("church.manage")

  return prisma.worshipServiceRole.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      sortOrder: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  })
}

export { getActiveWorshipServiceRoles }
