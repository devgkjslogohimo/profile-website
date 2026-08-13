import { prisma } from "@/lib/db/prisma"

async function getNewsById(id: string) {
  return prisma.news.findUnique({
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

      _count: {
        select: {
          images: true,
        },
      },
    },
  })
}

export { getNewsById }
