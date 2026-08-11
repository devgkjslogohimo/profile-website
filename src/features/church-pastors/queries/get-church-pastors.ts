import { prisma } from "@/lib/db/prisma"

export async function getChurchPastors() {
  return prisma.churchPastor.findMany({
    orderBy: [
      {
        periodStart: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  })
}
