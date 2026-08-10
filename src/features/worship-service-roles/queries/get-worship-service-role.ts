import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function getWorshipServiceRole(id: string) {
  await requirePermission("church.manage")

  return prisma.worshipServiceRole.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      sortOrder: true,
      isActive: true,
    },
  })
}

export { getWorshipServiceRole }
