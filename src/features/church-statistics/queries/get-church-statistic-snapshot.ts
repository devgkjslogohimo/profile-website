import { prisma } from "@/lib/db/prisma"

async function getChurchStatisticSnapshot(id: string) {
  return prisma.churchStatisticSnapshot.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          metrics: true,
        },
      },
    },
  })
}

export { getChurchStatisticSnapshot }
