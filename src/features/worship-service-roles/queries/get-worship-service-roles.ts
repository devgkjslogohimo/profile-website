import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function getWorshipServiceRoles() {
  await requirePermission("church.manage")

  return prisma.worshipServiceRole.findMany({
    select: {
      id: true,
      name: true,
      sortOrder: true,
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  })
}

export { getWorshipServiceRoles }
