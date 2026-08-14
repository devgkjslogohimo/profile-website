import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_ANNOUNCEMENT_REVALIDATE_SECONDS = 300
const PUBLIC_ANNOUNCEMENT_PAGE_SIZE = 10

function serializePublishedAt<T extends { publishedAt: Date | null }>(
  item: T
): Omit<T, "publishedAt"> & { publishedAt: string | null } {
  const { publishedAt, ...rest } = item

  return {
    ...rest,
    publishedAt: publishedAt?.toISOString() ?? null,
  }
}

function hydratePublishedAt<T extends { publishedAt: string | null }>(
  item: T
): Omit<T, "publishedAt"> & { publishedAt: Date | null } {
  const { publishedAt, ...rest } = item

  return {
    ...rest,
    publishedAt: publishedAt ? new Date(publishedAt) : null,
  }
}

async function findPublishedAnnouncements() {
  return prisma.announcement.findMany({
    where: {
      status: "PUBLISHED",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
    },

    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  })
}

const getCachedPublishedAnnouncements = unstable_cache(
  async () => {
    const items = await findPublishedAnnouncements()

    return items.map(serializePublishedAt)
  },
  ["public-published-announcements-v1"],
  {
    revalidate: PUBLIC_ANNOUNCEMENT_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.announcements],
  }
)

const getPublishedAnnouncements = cache(async () => {
  const items = await getCachedPublishedAnnouncements()

  return items.map(hydratePublishedAt)
})

async function findPublishedAnnouncementBySlug(slug: string) {
  return prisma.announcement.findFirst({
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
    },
  })
}

const getCachedPublishedAnnouncementBySlug = unstable_cache(
  async (slug: string) => {
    const announcement = await findPublishedAnnouncementBySlug(slug)

    return announcement ? serializePublishedAt(announcement) : null
  },
  ["public-published-announcement-by-slug-v1"],
  {
    revalidate: PUBLIC_ANNOUNCEMENT_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.announcements],
  }
)

const getPublishedAnnouncementBySlug = cache(async (slug: string) => {
  const announcement = await getCachedPublishedAnnouncementBySlug(slug)

  return announcement ? hydratePublishedAt(announcement) : null
})

async function findPublishedAnnouncementsPage(requestedPage: number, query: string) {
  const where = {
    status: "PUBLISHED" as const,

    ...(query
      ? {
          title: {
            contains: query,
            mode: "insensitive" as const,
          },
        }
      : {}),
  }

  const total = await prisma.announcement.count({
    where,
  })

  if (total === 0) {
    return {
      items: [],
      total: 0,
      page: 1,
      totalPages: 1,
      pageSize: PUBLIC_ANNOUNCEMENT_PAGE_SIZE,
      query,
    }
  }

  const totalPages = Math.ceil(total / PUBLIC_ANNOUNCEMENT_PAGE_SIZE)

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, totalPages) : 1

  const items = await prisma.announcement.findMany({
    where,

    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
    },

    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    skip: (page - 1) * PUBLIC_ANNOUNCEMENT_PAGE_SIZE,

    take: PUBLIC_ANNOUNCEMENT_PAGE_SIZE,
  })

  return {
    items,
    total,
    page,
    totalPages,
    pageSize: PUBLIC_ANNOUNCEMENT_PAGE_SIZE,
    query,
  }
}

const getCachedPublishedAnnouncementsPage = unstable_cache(
  async (requestedPage: number) => {
    const result = await findPublishedAnnouncementsPage(requestedPage, "")

    return {
      ...result,
      items: result.items.map(serializePublishedAt),
    }
  },
  ["public-published-announcements-page-v1"],
  {
    revalidate: PUBLIC_ANNOUNCEMENT_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.announcements],
  }
)

const getPublishedAnnouncementsPage = cache(
  async (requestedPage: number = 1, searchQuery: string = "") => {
    const query = searchQuery.trim().slice(0, 80)

    /*
     * Pencarian bebas sengaja tidak dimasukkan ke persistent cache
     * agar cache key tidak berkembang tanpa batas.
     */
    if (query) {
      return findPublishedAnnouncementsPage(requestedPage, query)
    }

    const result = await getCachedPublishedAnnouncementsPage(requestedPage)

    return {
      ...result,
      items: result.items.map(hydratePublishedAt),
    }
  }
)

async function findRecentPublishedAnnouncements(excludeSlug: string) {
  return prisma.announcement.findMany({
    where: {
      status: "PUBLISHED",

      slug: {
        not: excludeSlug,
      },
    },

    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
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

const getCachedRecentPublishedAnnouncements = unstable_cache(
  async (excludeSlug: string) => {
    const items = await findRecentPublishedAnnouncements(excludeSlug)

    return items.map(serializePublishedAt)
  },
  ["public-recent-published-announcements-v1"],
  {
    revalidate: PUBLIC_ANNOUNCEMENT_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.announcements],
  }
)

const getRecentPublishedAnnouncements = cache(async (excludeSlug: string) => {
  const items = await getCachedRecentPublishedAnnouncements(excludeSlug)

  return items.map(hydratePublishedAt)
})

export {
  getPublishedAnnouncementBySlug,
  getPublishedAnnouncements,
  getPublishedAnnouncementsPage,
  getRecentPublishedAnnouncements,
}
