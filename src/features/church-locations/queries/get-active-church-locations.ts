import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function getActiveChurchLocations() {
  await requirePermission("church.manage")

  return prisma.churchLocation.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      type: true,
      sortOrder: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  })
}

export { getActiveChurchLocations }
