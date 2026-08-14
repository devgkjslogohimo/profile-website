import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_ANNOUNCEMENT_REVALIDATE_SECONDS = 300

async function findPublicBannerAnnouncements() {
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
}

const getCachedPublicBannerAnnouncements = unstable_cache(
  findPublicBannerAnnouncements,
  ["public-banner-announcements-v1"],
  {
    revalidate: PUBLIC_ANNOUNCEMENT_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.announcements],
  }
)

const getPublicBannerAnnouncements = cache(async () => {
  return getCachedPublicBannerAnnouncements()
})

export { getPublicBannerAnnouncements }
