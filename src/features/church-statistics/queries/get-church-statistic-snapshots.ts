import { prisma } from "@/lib/db/prisma"

async function getChurchStatisticSnapshots() {
  return prisma.churchStatisticSnapshot.findMany({
    include: {
      _count: {
        select: {
          metrics: true,
        },
      },
    },
    orderBy: [
      {
        asOfDate: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  })
}

export { getChurchStatisticSnapshots }
