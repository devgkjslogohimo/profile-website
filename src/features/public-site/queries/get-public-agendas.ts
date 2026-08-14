import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_AGENDA_REVALIDATE_SECONDS = 300
const PUBLIC_UPCOMING_AGENDA_LIMIT = 9

const agendaArchiveYearFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000

function createWibMonthBoundary(year: number, monthIndex: number) {
  return new Date(Date.UTC(year, monthIndex, 1) - WIB_OFFSET_MS)
}

function serializeAgendaDates<
  T extends {
    startsAt: Date
    endsAt?: Date | null
  },
>(
  item: T
): Omit<T, "startsAt" | "endsAt"> & {
  startsAt: string
  endsAt: string | null
} {
  const { startsAt, endsAt, ...rest } = item

  return {
    ...rest,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt?.toISOString() ?? null,
  }
}

function hydrateAgendaDates<
  T extends {
    startsAt: string
    endsAt: string | null
  },
>(
  item: T
): Omit<T, "startsAt" | "endsAt"> & {
  startsAt: Date
  endsAt: Date | null
} {
  const { startsAt, endsAt, ...rest } = item

  return {
    ...rest,
    startsAt: new Date(startsAt),
    endsAt: endsAt ? new Date(endsAt) : null,
  }
}

async function findPublishedAgendas() {
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
}

const getCachedPublishedAgendas = unstable_cache(
  async () => {
    const items = await findPublishedAgendas()

    return items.map(serializeAgendaDates)
  },
  ["public-published-agendas-v1"],
  {
    revalidate: PUBLIC_AGENDA_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.agendas],
  }
)

const getPublishedAgendas = cache(async () => {
  const items = await getCachedPublishedAgendas()

  return items.map(hydrateAgendaDates)
})

async function findPublishedAgendaBySlug(slug: string) {
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
}

const getCachedPublishedAgendaBySlug = unstable_cache(
  async (slug: string) => {
    const agenda = await findPublishedAgendaBySlug(slug)

    if (!agenda) {
      return null
    }

    return {
      ...serializeAgendaDates(agenda),
      publishedAt: agenda.publishedAt?.toISOString() ?? null,
    }
  },
  ["public-published-agenda-by-slug-v1"],
  {
    revalidate: PUBLIC_AGENDA_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.agendas],
  }
)

const getPublishedAgendaBySlug = cache(async (slug: string) => {
  const agenda = await getCachedPublishedAgendaBySlug(slug)

  if (!agenda) {
    return null
  }

  const hydrated = hydrateAgendaDates(agenda)

  return {
    ...hydrated,
    publishedAt: agenda.publishedAt ? new Date(agenda.publishedAt) : null,
  }
})

async function findUpcomingPublishedAgendas() {
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
}

const getCachedUpcomingPublishedAgendas = unstable_cache(
  async () => {
    const result = await findUpcomingPublishedAgendas()

    return {
      ...result,
      items: result.items.map(serializeAgendaDates),
    }
  },
  ["public-upcoming-published-agendas-v1"],
  {
    revalidate: PUBLIC_AGENDA_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.agendas],
  }
)

const getUpcomingPublishedAgendas = cache(async () => {
  const result = await getCachedUpcomingPublishedAgendas()

  return {
    ...result,
    items: result.items.map(hydrateAgendaDates),
  }
})

async function findHomepagePublishedAgendas() {
  const now = new Date()

  return prisma.agenda.findMany({
    where: {
      status: "PUBLISHED",

      startsAt: {
        gte: now,
      },
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
      startsAt: "asc",
    },

    take: 3,
  })
}

const getCachedHomepagePublishedAgendas = unstable_cache(
  async () => {
    const items = await findHomepagePublishedAgendas()

    return items.map(serializeAgendaDates)
  },
  ["public-homepage-published-agendas-v1"],
  {
    revalidate: PUBLIC_AGENDA_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.agendas],
  }
)

const getHomepagePublishedAgendas = cache(async () => {
  const items = await getCachedHomepagePublishedAgendas()

  return items.map(hydrateAgendaDates)
})

async function findLatestCompletedPublishedAgenda() {
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
}

const getCachedLatestCompletedPublishedAgenda = unstable_cache(
  async () => {
    const agenda = await findLatestCompletedPublishedAgenda()

    if (!agenda) {
      return null
    }

    return {
      ...agenda,
      startsAt: agenda.startsAt.toISOString(),
    }
  },
  ["public-latest-completed-published-agenda-v1"],
  {
    revalidate: PUBLIC_AGENDA_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.agendas],
  }
)

const getLatestCompletedPublishedAgenda = cache(async () => {
  const agenda = await getCachedLatestCompletedPublishedAgenda()

  if (!agenda) {
    return null
  }

  return {
    ...agenda,
    startsAt: new Date(agenda.startsAt),
  }
})

async function findPublishedAgendaArchiveYears() {
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
}

const getCachedPublishedAgendaArchiveYears = unstable_cache(
  findPublishedAgendaArchiveYears,
  ["public-published-agenda-archive-years-v1"],
  {
    revalidate: PUBLIC_AGENDA_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.agendas],
  }
)

const getPublishedAgendaArchiveYears = cache(async () => {
  return getCachedPublishedAgendaArchiveYears()
})

async function findPublishedAgendaArchive(year: number, month: number | null, query: string) {
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

const getCachedPublishedAgendaArchive = unstable_cache(
  async (year: number, month: number | null) => {
    const items = await findPublishedAgendaArchive(year, month, "")

    return items.map(serializeAgendaDates)
  },
  ["public-published-agenda-archive-v1"],
  {
    revalidate: PUBLIC_AGENDA_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.agendas],
  }
)

const getPublishedAgendaArchive = cache(
  async (year: number, month: number | null = null, searchQuery: string = "") => {
    if (!Number.isInteger(year)) {
      return []
    }

    if (month !== null && (!Number.isInteger(month) || month < 1 || month > 12)) {
      return []
    }

    const query = searchQuery.trim().slice(0, 80)

    /*
     * Search bebas tidak masuk persistent cache agar key cache
     * tidak berkembang berdasarkan input pengguna.
     */
    if (query) {
      return findPublishedAgendaArchive(year, month, query)
    }

    const items = await getCachedPublishedAgendaArchive(year, month)

    return items.map(hydrateAgendaDates)
  }
)

async function findRecentUpcomingPublishedAgendas(excludeSlug: string) {
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
}

const getCachedRecentUpcomingPublishedAgendas = unstable_cache(
  async (excludeSlug: string) => {
    const items = await findRecentUpcomingPublishedAgendas(excludeSlug)

    return items.map(serializeAgendaDates)
  },
  ["public-recent-upcoming-published-agendas-v1"],
  {
    revalidate: PUBLIC_AGENDA_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.agendas],
  }
)

const getRecentUpcomingPublishedAgendas = cache(async (excludeSlug: string) => {
  const items = await getCachedRecentUpcomingPublishedAgendas(excludeSlug)

  return items.map(hydrateAgendaDates)
})

export {
  getHomepagePublishedAgendas,
  getLatestCompletedPublishedAgenda,
  getPublishedAgendaArchive,
  getPublishedAgendaArchiveYears,
  getPublishedAgendaBySlug,
  getPublishedAgendas,
  getRecentUpcomingPublishedAgendas,
  getUpcomingPublishedAgendas,
}
