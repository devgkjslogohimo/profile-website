import { prisma } from "@/lib/db/prisma"

type FindOverlappingChurchPastorParams = {
  periodStart: Date
  periodEnd: Date | null
  excludeId?: string
}

async function findOverlappingChurchPastor({
  periodStart,
  periodEnd,
  excludeId,
}: FindOverlappingChurchPastorParams) {
  return prisma.churchPastor.findFirst({
    where: {
      ...(excludeId
        ? {
            NOT: {
              id: excludeId,
            },
          }
        : {}),
      periodStart: {
        lte: periodEnd ?? new Date("9999-12-31T00:00:00.000Z"),
      },
      OR: [
        {
          periodEnd: null,
        },
        {
          periodEnd: {
            gte: periodStart,
          },
        },
      ],
    },
    select: {
      id: true,
      fullName: true,
      periodStart: true,
      periodEnd: true,
    },
    orderBy: {
      periodStart: "desc",
    },
  })
}

export { findOverlappingChurchPastor }
