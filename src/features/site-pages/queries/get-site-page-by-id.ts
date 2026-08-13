import { prisma } from "@/lib/db/prisma"

async function getSitePageById(id: string) {
  return prisma.sitePage.findUnique({
    where: {
      id,
    },

    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

export { getSitePageById }
