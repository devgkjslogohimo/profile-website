import { cache } from "react"

import { prisma } from "@/lib/db/prisma"

const getPublishedAgendas = cache(async () => {
  return prisma.agenda.findMany({
    where: {
      status: "PUBLISHED",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      startsAt: true,
      endsAt: true,
      location: true,
      googleMapsUrl: true,
      coverImageUrl: true,
    },

    orderBy: {
      startsAt: "desc",
    },
  })
})

const getPublishedAgendaBySlug = cache(async (slug: string) => {
  return prisma.agenda.findFirst({
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

      startsAt: true,
      endsAt: true,

      location: true,
      googleMapsUrl: true,

      coverImageUrl: true,
      publishedAt: true,
    },
  })
})

const PUBLIC_UPCOMING_AGENDA_LIMIT = 9

const agendaArchiveYearFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000

function createWibMonthBoundary(year: number, monthIndex: number) {
  return new Date(Date.UTC(year, monthIndex, 1) - WIB_OFFSET_MS)
}

const getUpcomingPublishedAgendas = cache(async () => {
  const now = new Date()

  const where = {
    status: "PUBLISHED" as const,

    OR: [
      {
        startsAt: {
          gte: now,
        },
      },
      {
        endsAt: {
          gte: now,
        },
      },
    ],
  }

  const [items, total] = await Promise.all([
    prisma.agenda.findMany({
      where,

      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        startsAt: true,
        endsAt: true,
        location: true,
        googleMapsUrl: true,
        coverImageUrl: true,
      },

      orderBy: {
        startsAt: "asc",
      },

      take: PUBLIC_UPCOMING_AGENDA_LIMIT,
    }),

    prisma.agenda.count({
      where,
    }),
  ])

  return {
    items,
    total,
  }
})

const getLatestCompletedPublishedAgenda = cache(async () => {
  const now = new Date()

  return prisma.agenda.findFirst({
    where: {
      status: "PUBLISHED",

      startsAt: {
        lt: now,
      },

      OR: [
        {
          endsAt: null,
        },
        {
          endsAt: {
            lt: now,
          },
        },
      ],
    },

    select: {
      id: true,
      startsAt: true,
    },

    orderBy: {
      startsAt: "desc",
    },
  })
})

const getPublishedAgendaArchiveYears = cache(async () => {
  const now = new Date()

  const items = await prisma.agenda.findMany({
    where: {
      status: "PUBLISHED",

      startsAt: {
        lt: now,
      },

      OR: [
        {
          endsAt: null,
        },
        {
          endsAt: {
            lt: now,
          },
        },
      ],
    },

    select: {
      startsAt: true,
    },

    orderBy: {
      startsAt: "desc",
    },
  })

  return [...new Set(items.map((item) => Number(agendaArchiveYearFormatter.format(item.startsAt))))]
})

const getPublishedAgendaArchive = cache(
  async (year: number, month: number | null = null, searchQuery: string = "") => {
    if (!Number.isInteger(year)) {
      return []
    }

    if (month !== null && (!Number.isInteger(month) || month < 1 || month > 12)) {
      return []
    }

    const query = searchQuery.trim().slice(0, 80)
    const now = new Date()

    const rangeStart =
      month === null ? createWibMonthBoundary(year, 0) : createWibMonthBoundary(year, month - 1)

    const rangeEnd =
      month === null ? createWibMonthBoundary(year + 1, 0) : createWibMonthBoundary(year, month)

    return prisma.agenda.findMany({
      where: {
        status: "PUBLISHED",

        AND: [
          {
            startsAt: {
              gte: rangeStart,
              lt: rangeEnd,
            },
          },
          {
            startsAt: {
              lt: now,
            },
          },
          {
            OR: [
              {
                endsAt: null,
              },
              {
                endsAt: {
                  lt: now,
                },
              },
            ],
          },

          ...(query
            ? [
                {
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
                    {
                      location: {
                        contains: query,
                        mode: "insensitive" as const,
                      },
                    },
                  ],
                },
              ]
            : []),
        ],
      },

      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        startsAt: true,
        endsAt: true,
        location: true,
      },

      orderBy: {
        startsAt: "desc",
      },
    })
  }
)

const getRecentUpcomingPublishedAgendas = cache(async (excludeSlug: string) => {
  const now = new Date()

  return prisma.agenda.findMany({
    where: {
      status: "PUBLISHED",

      slug: {
        not: excludeSlug,
      },

      OR: [
        {
          startsAt: {
            gte: now,
          },
        },
        {
          endsAt: {
            gte: now,
          },
        },
      ],
    },

    select: {
      id: true,
      title: true,
      slug: true,
      startsAt: true,
      endsAt: true,
      location: true,
    },

    orderBy: {
      startsAt: "asc",
    },

    take: 5,
  })
})

export {
  getLatestCompletedPublishedAgenda,
  getPublishedAgendaArchive,
  getPublishedAgendaArchiveYears,
  getPublishedAgendaBySlug,
  getPublishedAgendas,
  getRecentUpcomingPublishedAgendas,
  getUpcomingPublishedAgendas,
}
