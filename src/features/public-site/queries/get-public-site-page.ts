import { cache } from "react"

import { prisma } from "@/lib/db/prisma"

const getPublishedSitePageBySlug = cache(async (slug: string) => {
  return prisma.sitePage.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      publishedAt: true,
      updatedAt: true,

      author: {
        select: {
          name: true,
        },
      },
    },
  })
})

export { getPublishedSitePageBySlug }
