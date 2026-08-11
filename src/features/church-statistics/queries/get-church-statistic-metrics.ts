import { prisma } from "@/lib/db/prisma"

async function getChurchStatisticMetrics(snapshotId: string) {
  return prisma.churchStatisticMetric.findMany({
    where: {
      snapshotId,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  })
}

export { getChurchStatisticMetrics }
