import { prisma } from "@/lib/db/prisma"

async function getAnnouncements() {
  return prisma.announcement.findMany({
    select: {
      id: true,
      title: true,
      slug: true,

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
    },

    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  })
}

export { getAnnouncements }
