import { prisma } from "@/lib/db/prisma"

async function getSitePages() {
  return prisma.sitePage.findMany({
    select: {
      id: true,
      title: true,
      slug: true,

      status: true,
      publishedAt: true,

      showInNavigation: true,
      navigationLabel: true,
      navigationOrder: true,

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

export { getSitePages }
