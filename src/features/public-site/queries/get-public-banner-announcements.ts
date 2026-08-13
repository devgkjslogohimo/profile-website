import { cache } from "react"

import { prisma } from "@/lib/db/prisma"

const getPublicBannerAnnouncements = cache(async () => {
  const now = new Date()

  return prisma.announcement.findMany({
    where: {
      status: "PUBLISHED",

      publishedAt: {
        not: null,
      },

      displayUntil: {
        gt: now,
      },
    },

    select: {
      id: true,
      title: true,
      slug: true,
    },

    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    take: 5,
  })
})

export { getPublicBannerAnnouncements }
