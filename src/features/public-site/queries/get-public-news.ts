import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_NEWS_REVALIDATE_SECONDS = 300
const PUBLIC_NEWS_PAGE_SIZE = 9

function serializePublishedAt<T extends { publishedAt: Date | null }>(item: T) {
  return {
    ...item,
    publishedAt: item.publishedAt?.toISOString() ?? null,
  }
}

function hydratePublishedAt<T extends { publishedAt: string | null }>(item: T) {
  return {
    ...item,
    publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
  }
}

async function findPublishedNews() {
  return prisma.news.findMany({
    where: {
      status: "PUBLISHED",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImageUrl: true,
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

const getCachedPublishedNews = unstable_cache(
  async () => {
    const items = await findPublishedNews()

    return items.map(serializePublishedAt)
  },
  ["public-published-news-v2"],
  {
    revalidate: PUBLIC_NEWS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.news],
  }
)

const getPublishedNews = cache(async () => {
  const items = await getCachedPublishedNews()

  return items.map(hydratePublishedAt)
})

async function findHomepagePublishedNews() {
  return prisma.news.findMany({
    where: {
      status: "PUBLISHED",

      publishedAt: {
        not: null,
      },
    },

    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImageUrl: true,
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

    take: 3,
  })
}

const getCachedHomepagePublishedNews = unstable_cache(
  async () => {
    const items = await findHomepagePublishedNews()

    return items.map(serializePublishedAt)
  },
  ["public-homepage-published-news-v1"],
  {
    revalidate: PUBLIC_NEWS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.news],
  }
)

const getHomepagePublishedNews = cache(async () => {
  const items = await getCachedHomepagePublishedNews()

  return items.map(hydratePublishedAt)
})

async function findPublishedNewsBySlug(slug: string) {
  return prisma.news.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImageUrl: true,
      publishedAt: true,

      author: {
        select: {
          name: true,
        },
      },

      images: {
        select: {
          id: true,
          googleDriveUrl: true,
          altText: true,
          caption: true,
          sortOrder: true,
        },

        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      },
    },
  })
}

const getCachedPublishedNewsBySlug = unstable_cache(
  async (slug: string) => {
    const item = await findPublishedNewsBySlug(slug)

    return item ? serializePublishedAt(item) : null
  },
  ["public-published-news-by-slug-v2"],
  {
    revalidate: PUBLIC_NEWS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.news],
  }
)

const getPublishedNewsBySlug = cache(async (slug: string) => {
  const item = await getCachedPublishedNewsBySlug(slug)

  return item ? hydratePublishedAt(item) : null
})

async function findPublishedNewsPage(requestedPage: number, query: string) {
  const where = {
    status: "PUBLISHED" as const,

    ...(query
      ? {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              excerpt: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  }

  const total = await prisma.news.count({
    where,
  })

  if (total === 0) {
    return {
      items: [],
      total: 0,
      page: 1,
      totalPages: 1,
      pageSize: PUBLIC_NEWS_PAGE_SIZE,
      query,
    }
  }

  const totalPages = Math.ceil(total / PUBLIC_NEWS_PAGE_SIZE)

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, totalPages) : 1

  const items = await prisma.news.findMany({
    where,

    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImageUrl: true,
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

    skip: (page - 1) * PUBLIC_NEWS_PAGE_SIZE,

    take: PUBLIC_NEWS_PAGE_SIZE,
  })

  return {
    items,
    total,
    page,
    totalPages,
    pageSize: PUBLIC_NEWS_PAGE_SIZE,
    query,
  }
}

const getCachedPublishedNewsPage = unstable_cache(
  async (requestedPage: number) => {
    const result = await findPublishedNewsPage(requestedPage, "")

    return {
      ...result,
      items: result.items.map(serializePublishedAt),
    }
  },
  ["public-published-news-page-v2"],
  {
    revalidate: PUBLIC_NEWS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.news],
  }
)

const getPublishedNewsPage = cache(async (requestedPage: number = 1, searchQuery: string = "") => {
  const query = searchQuery.trim().slice(0, 80)

  /*
   * Search bebas sengaja tidak masuk persistent cache.
   *
   * Ini mencegah query string arbitrary membuat jumlah
   * persistent cache key terus bertambah.
   */
  if (query) {
    return findPublishedNewsPage(requestedPage, query)
  }

  const result = await getCachedPublishedNewsPage(requestedPage)

  return {
    ...result,
    items: result.items.map(hydratePublishedAt),
  }
})

async function findRecentPublishedNews(excludeSlug: string) {
  return prisma.news.findMany({
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
      excerpt: true,
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

const getCachedRecentPublishedNews = unstable_cache(
  async (excludeSlug: string) => {
    const items = await findRecentPublishedNews(excludeSlug)

    return items.map(serializePublishedAt)
  },
  ["public-recent-published-news-v2"],
  {
    revalidate: PUBLIC_NEWS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.news],
  }
)

const getRecentPublishedNews = cache(async (excludeSlug: string) => {
  const items = await getCachedRecentPublishedNews(excludeSlug)

  return items.map(hydratePublishedAt)
})

export {
  getHomepagePublishedNews,
  getPublishedNews,
  getPublishedNewsBySlug,
  getPublishedNewsPage,
  getRecentPublishedNews,
}
