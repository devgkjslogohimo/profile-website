import { prisma } from "@/lib/db/prisma"

async function getNews() {
  return prisma.news.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImageUrl: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,

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

    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  })
}

export { getNews }
