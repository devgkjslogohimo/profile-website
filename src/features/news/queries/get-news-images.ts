import { prisma } from "@/lib/db/prisma"

async function getNewsImages(newsId: string) {
  return prisma.newsImage.findMany({
    where: {
      newsId,
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

export { getNewsImages }
