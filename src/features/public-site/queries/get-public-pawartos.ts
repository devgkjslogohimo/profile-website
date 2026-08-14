import { cache } from "react"

import { prisma } from "@/lib/db/prisma"

const getPublishedPawartos = cache(async () => {
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
})

const getPublishedPawartosBySlug = cache(async (slug: string) => {
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
})

const getLatestPublishedPawartos = cache(async () => {
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
})

const getPublishedPawartosYears = cache(async () => {
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
})

const getPublishedPawartosArchive = cache(async (year: number, month: number | null = null) => {
  if (!Number.isInteger(year)) {
    return []
  }

  if (month !== null && (!Number.isInteger(month) || month < 1 || month > 12)) {
    return []
  }

  const start =
    month === null ? new Date(Date.UTC(year, 0, 1)) : new Date(Date.UTC(year, month - 1, 1))

  const end =
    month === null ? new Date(Date.UTC(year + 1, 0, 1)) : new Date(Date.UTC(year, month, 1))

  return prisma.pawartos.findMany({
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
})

const getPublishedPawartosNavigationBySlug = cache(async (slug: string) => {
  const current = await getPublishedPawartosBySlug(slug)

  if (!current) {
    return null
  }

  const [previous, next] = await Promise.all([
    prisma.pawartos.findFirst({
      where: {
        status: "PUBLISHED",

        OR: [
          {
            publicationDate: {
              lt: current.publicationDate,
            },
          },
          {
            publicationDate: current.publicationDate,

            createdAt: {
              lt: current.createdAt,
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
              gt: current.publicationDate,
            },
          },
          {
            publicationDate: current.publicationDate,

            createdAt: {
              gt: current.createdAt,
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
    previous,
    next,
  }
})

const getRecentPublishedPawartos = cache(async (excludeSlug: string) => {
  return prisma.pawartos.findMany({
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
})

export {
  getLatestPublishedPawartos,
  getPublishedPawartos,
  getPublishedPawartosArchive,
  getPublishedPawartosBySlug,
  getPublishedPawartosNavigationBySlug,
  getPublishedPawartosYears,
  getRecentPublishedPawartos,
}
