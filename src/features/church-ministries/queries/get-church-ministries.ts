import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function getChurchMinistries() {
  await requirePermission("church.manage")

  return prisma.churchMinistry.findMany({
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

export { getChurchMinistries }
