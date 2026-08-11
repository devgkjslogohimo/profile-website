import { prisma } from "@/lib/db/prisma"

async function getChurchStatisticMetric(id: string) {
  return prisma.churchStatisticMetric.findUnique({
    where: {
      id,
    },
  })
}

export { getChurchStatisticMetric }
