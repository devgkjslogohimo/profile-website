import { prisma } from "@/lib/db/prisma"

async function getNewsImageById(id: string) {
  return prisma.newsImage.findUnique({
    where: {
      id,
    },

    include: {
      news: {
        select: {
          id: true,
          title: true,
          slug: true,
          authorId: true,
          status: true,
        },
      },
    },
  })
}

export { getNewsImageById }
