import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function getChurchMinistry(id: string) {
  await requirePermission("church.manage")

  return prisma.churchMinistry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      summary: true,
      description: true,
      imageUrl: true,
      sortOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export { getChurchMinistry }
