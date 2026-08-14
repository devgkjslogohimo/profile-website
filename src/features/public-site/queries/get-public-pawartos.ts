import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_PAWARTOS_REVALIDATE_SECONDS = 300

async function findPublishedPawartos() {
  return prisma.pawartos.findMany({
    where: {
      status: "PUBLISHED",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      publicationDate: true,
      description: true,
      googleDriveUrl: true,
      publishedAt: true,
    },

    orderBy: [
      {
        publicationDate: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  })
}

const getCachedPublishedPawartos = unstable_cache(
  async () => {
    const items = await findPublishedPawartos()

    return items.map((item) => ({
      ...item,
      publicationDate: item.publicationDate.toISOString(),
      publishedAt: item.publishedAt?.toISOString() ?? null,
    }))
  },
  ["public-published-pawartos-v1"],
  {
    revalidate: PUBLIC_PAWARTOS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.pawartos],
  }
)

const getPublishedPawartos = cache(async () => {
  const items = await getCachedPublishedPawartos()

  return items.map((item) => ({
    ...item,
    publicationDate: new Date(item.publicationDate),
    publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
  }))
})

async function findPublishedPawartosBySlug(slug: string) {
  return prisma.pawartos.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      publicationDate: true,
      description: true,
      googleDriveUrl: true,
      publishedAt: true,
      createdAt: true,
    },
  })
}

const getCachedPublishedPawartosBySlug = unstable_cache(
  async (slug: string) => {
    const pawartos = await findPublishedPawartosBySlug(slug)

    if (!pawartos) {
      return null
    }

    return {
      ...pawartos,
      publicationDate: pawartos.publicationDate.toISOString(),
      publishedAt: pawartos.publishedAt?.toISOString() ?? null,
      createdAt: pawartos.createdAt.toISOString(),
    }
  },
  ["public-published-pawartos-by-slug-v1"],
  {
    revalidate: PUBLIC_PAWARTOS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.pawartos],
  }
)

const getPublishedPawartosBySlug = cache(async (slug: string) => {
  const pawartos = await getCachedPublishedPawartosBySlug(slug)

  if (!pawartos) {
    return null
  }

  return {
    ...pawartos,
    publicationDate: new Date(pawartos.publicationDate),
    publishedAt: pawartos.publishedAt ? new Date(pawartos.publishedAt) : null,
    createdAt: new Date(pawartos.createdAt),
  }
})

async function findLatestPublishedPawartos() {
  return prisma.pawartos.findFirst({
    where: {
      status: "PUBLISHED",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      publicationDate: true,
      description: true,
      googleDriveUrl: true,
      publishedAt: true,
    },

    orderBy: [
      {
        publicationDate: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  })
}

const getCachedLatestPublishedPawartos = unstable_cache(
  async () => {
    const pawartos = await findLatestPublishedPawartos()

    if (!pawartos) {
      return null
    }

    return {
      ...pawartos,
      publicationDate: pawartos.publicationDate.toISOString(),
      publishedAt: pawartos.publishedAt?.toISOString() ?? null,
    }
  },
  ["public-latest-published-pawartos-v1"],
  {
    revalidate: PUBLIC_PAWARTOS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.pawartos],
  }
)

const getLatestPublishedPawartos = cache(async () => {
  const pawartos = await getCachedLatestPublishedPawartos()

  if (!pawartos) {
    return null
  }

  return {
    ...pawartos,
    publicationDate: new Date(pawartos.publicationDate),
    publishedAt: pawartos.publishedAt ? new Date(pawartos.publishedAt) : null,
  }
})

const getCachedPublishedPawartosYears = unstable_cache(
  async () => {
    const items = await prisma.pawartos.findMany({
      where: {
        status: "PUBLISHED",
      },

      select: {
        publicationDate: true,
      },

      orderBy: {
        publicationDate: "desc",
      },
    })

    return [...new Set(items.map((item) => item.publicationDate.getUTCFullYear()))]
  },
  ["public-published-pawartos-years-v1"],
  {
    revalidate: PUBLIC_PAWARTOS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.pawartos],
  }
)

const getPublishedPawartosYears = cache(async () => {
  return getCachedPublishedPawartosYears()
})

const getCachedPublishedPawartosArchive = unstable_cache(
  async (year: number, month: number | null) => {
    const start =
      month === null ? new Date(Date.UTC(year, 0, 1)) : new Date(Date.UTC(year, month - 1, 1))

    const end =
      month === null ? new Date(Date.UTC(year + 1, 0, 1)) : new Date(Date.UTC(year, month, 1))

    const items = await prisma.pawartos.findMany({
      where: {
        status: "PUBLISHED",

        publicationDate: {
          gte: start,
          lt: end,
        },
      },

      select: {
        id: true,
        title: true,
        slug: true,
        publicationDate: true,
        description: true,
      },

      orderBy: [
        {
          publicationDate: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    })

    return items.map((item) => ({
      ...item,
      publicationDate: item.publicationDate.toISOString(),
    }))
  },
  ["public-published-pawartos-archive-v1"],
  {
    revalidate: PUBLIC_PAWARTOS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.pawartos],
  }
)

const getPublishedPawartosArchive = cache(async (year: number, month: number | null = null) => {
  if (!Number.isInteger(year)) {
    return []
  }

  if (month !== null && (!Number.isInteger(month) || month < 1 || month > 12)) {
    return []
  }

  const items = await getCachedPublishedPawartosArchive(year, month)

  return items.map((item) => ({
    ...item,
    publicationDate: new Date(item.publicationDate),
  }))
})

const getCachedPublishedPawartosNavigationBySlug = unstable_cache(
  async (slug: string) => {
    const current = await getCachedPublishedPawartosBySlug(slug)

    if (!current) {
      return null
    }

    const publicationDate = new Date(current.publicationDate)
    const createdAt = new Date(current.createdAt)

    const [previous, next] = await Promise.all([
      prisma.pawartos.findFirst({
        where: {
          status: "PUBLISHED",

          OR: [
            {
              publicationDate: {
                lt: publicationDate,
              },
            },
            {
              publicationDate,

              createdAt: {
                lt: createdAt,
              },
            },
          ],
        },

        select: {
          id: true,
          title: true,
          slug: true,
          publicationDate: true,
        },

        orderBy: [
          {
            publicationDate: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      }),

      prisma.pawartos.findFirst({
        where: {
          status: "PUBLISHED",

          OR: [
            {
              publicationDate: {
                gt: publicationDate,
              },
            },
            {
              publicationDate,

              createdAt: {
                gt: createdAt,
              },
            },
          ],
        },

        select: {
          id: true,
          title: true,
          slug: true,
          publicationDate: true,
        },

        orderBy: [
          {
            publicationDate: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      }),
    ])

    return {
      previous: previous
        ? {
            ...previous,
            publicationDate: previous.publicationDate.toISOString(),
          }
        : null,

      next: next
        ? {
            ...next,
            publicationDate: next.publicationDate.toISOString(),
          }
        : null,
    }
  },
  ["public-published-pawartos-navigation-v1"],
  {
    revalidate: PUBLIC_PAWARTOS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.pawartos],
  }
)

const getPublishedPawartosNavigationBySlug = cache(async (slug: string) => {
  const navigation = await getCachedPublishedPawartosNavigationBySlug(slug)

  if (!navigation) {
    return null
  }

  return {
    previous: navigation.previous
      ? {
          ...navigation.previous,
          publicationDate: new Date(navigation.previous.publicationDate),
        }
      : null,

    next: navigation.next
      ? {
          ...navigation.next,
          publicationDate: new Date(navigation.next.publicationDate),
        }
      : null,
  }
})

const getCachedRecentPublishedPawartos = unstable_cache(
  async (excludeSlug: string) => {
    const items = await prisma.pawartos.findMany({
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
        publicationDate: true,
      },

      orderBy: [
        {
          publicationDate: "desc",
        },
        {
          createdAt: "desc",
        },
      ],

      take: 5,
    })

    return items.map((item) => ({
      ...item,
      publicationDate: item.publicationDate.toISOString(),
    }))
  },
  ["public-recent-published-pawartos-v1"],
  {
    revalidate: PUBLIC_PAWARTOS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.pawartos],
  }
)

const getRecentPublishedPawartos = cache(async (excludeSlug: string) => {
  const items = await getCachedRecentPublishedPawartos(excludeSlug)

  return items.map((item) => ({
    ...item,
    publicationDate: new Date(item.publicationDate),
  }))
})

const getCachedHomepagePublishedPawartos = unstable_cache(
  async () => {
    const items = await prisma.pawartos.findMany({
      where: {
        status: "PUBLISHED",
      },

      select: {
        id: true,
        title: true,
        slug: true,
        publicationDate: true,
        description: true,
      },

      orderBy: [
        {
          publicationDate: "desc",
        },
        {
          createdAt: "desc",
        },
      ],

      take: 3,
    })

    return items.map((item) => ({
      ...item,
      publicationDate: item.publicationDate.toISOString(),
    }))
  },
  ["public-homepage-pawartos-v1"],
  {
    revalidate: PUBLIC_PAWARTOS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.pawartos],
  }
)

const getHomepagePublishedPawartos = cache(async () => {
  const items = await getCachedHomepagePublishedPawartos()

  return items.map((item) => ({
    ...item,
    publicationDate: new Date(item.publicationDate),
  }))
})

export {
  getHomepagePublishedPawartos,
  getLatestPublishedPawartos,
  getPublishedPawartos,
  getPublishedPawartosArchive,
  getPublishedPawartosBySlug,
  getPublishedPawartosNavigationBySlug,
  getPublishedPawartosYears,
  getRecentPublishedPawartos,
}
