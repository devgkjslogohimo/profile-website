import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_SITE_PAGE_REVALIDATE_SECONDS = 300

function serializeSitePageDates<
  T extends {
    publishedAt: Date | null
    updatedAt: Date
  },
>(item: T) {
  return {
    ...item,
    publishedAt: item.publishedAt?.toISOString() ?? null,
    updatedAt: item.updatedAt.toISOString(),
  }
}

function hydrateSitePageDates<
  T extends {
    publishedAt: string | null
    updatedAt: string
  },
>(item: T) {
  return {
    ...item,
    publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
    updatedAt: new Date(item.updatedAt),
  }
}

async function findPublishedSitePageBySlug(slug: string) {
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
}

const getCachedPublishedSitePageBySlug = unstable_cache(
  async (slug: string) => {
    const item = await findPublishedSitePageBySlug(slug)

    return item ? serializeSitePageDates(item) : null
  },
  ["public-published-site-page-by-slug-v1"],
  {
    revalidate: PUBLIC_SITE_PAGE_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.sitePages],
  }
)

const getPublishedSitePageBySlug = cache(async (slug: string) => {
  const item = await getCachedPublishedSitePageBySlug(slug)

  return item ? hydrateSitePageDates(item) : null
})

export { getPublishedSitePageBySlug }
