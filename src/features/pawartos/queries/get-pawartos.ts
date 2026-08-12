import { prisma } from "@/lib/db/prisma"

async function getPawartos() {
  return prisma.pawartos.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: [
      {
        publicationDate: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  })
}

export { getPawartos }
