import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { getWibTodayDate } from "@/features/public-site/lib/public-date"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_WORSHIP_REVALIDATE_SECONDS = 300

const PUBLIC_WORSHIP_MONTH_PATTERN = /^(\d{4})-(\d{2})$/
const PUBLIC_WORSHIP_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

function getPublicWorshipMonthRange(value: string) {
  const match = PUBLIC_WORSHIP_MONTH_PATTERN.exec(value)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])

  if (!Number.isInteger(year) || month < 1 || month > 12) {
    return null
  }

  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  }
}

function parsePublicWorshipDate(value: string) {
  const match = PUBLIC_WORSHIP_DATE_PATTERN.exec(value)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  if (!Number.isInteger(year) || month < 1 || month > 12 || day < 1 || day > 31) {
    return null
  }

  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return date
}

function serializeWorshipScheduleDates<
  T extends {
    date: Date
    services: Array<{
      startsAt: Date
    }>
  },
>(item: T) {
  return {
    ...item,
    date: item.date.toISOString(),

    services: item.services.map((service) => ({
      ...service,
      startsAt: service.startsAt.toISOString(),
    })),
  }
}

function hydrateWorshipScheduleDates<
  T extends {
    date: string
    services: Array<{
      startsAt: string
    }>
  },
>(item: T) {
  return {
    ...item,
    date: new Date(item.date),

    services: item.services.map((service) => ({
      ...service,
      startsAt: new Date(service.startsAt),
    })),
  }
}

async function findPublishedWorshipSchedules(month: string | null) {
  const today = getWibTodayDate()

  const monthRange = month ? getPublicWorshipMonthRange(month) : null

  const dateFilter = monthRange
    ? {
        gte: monthRange.start.getTime() < today.getTime() ? today : monthRange.start,
        lt: monthRange.end,
      }
    : {
        gte: today,
      }

  return prisma.worshipSchedule.findMany({
    where: {
      isPublished: true,

      date: dateFilter,
    },

    select: {
      id: true,
      date: true,

      services: {
        select: {
          id: true,
          name: true,
          startsAt: true,
          languageOverride: true,
          sortOrder: true,

          churchLocation: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
              googleMapsUrl: true,
              isActive: true,
            },
          },
        },

        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            startsAt: "asc",
          },
        ],
      },
    },

    orderBy: {
      date: "asc",
    },

    ...(monthRange
      ? {}
      : {
          take: 3,
        }),
  })
}

const getCachedPublishedWorshipSchedules = unstable_cache(
  async (month: string | null) => {
    const items = await findPublishedWorshipSchedules(month)

    return items.map(serializeWorshipScheduleDates)
  },
  ["public-published-worship-schedules-v1"],
  {
    revalidate: PUBLIC_WORSHIP_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.worshipSchedules],
  }
)

const getPublishedWorshipSchedules = cache(async (month: string | null = null) => {
  const normalizedMonth = month && getPublicWorshipMonthRange(month) ? month : null

  const items = await getCachedPublishedWorshipSchedules(normalizedMonth)

  return items.map(hydrateWorshipScheduleDates)
})

async function findPublishedWorshipScheduleByDate(dateParam: string) {
  const date = parsePublicWorshipDate(dateParam)

  if (!date) {
    return null
  }

  return prisma.worshipSchedule.findFirst({
    where: {
      date,
      isPublished: true,
    },

    select: {
      id: true,
      date: true,

      services: {
        select: {
          id: true,
          name: true,
          startsAt: true,
          languageOverride: true,
          sortOrder: true,

          churchLocation: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
              googleMapsUrl: true,
              isActive: true,
            },
          },

          assignments: {
            select: {
              id: true,
              personName: true,
              sortOrder: true,

              worshipServiceRole: {
                select: {
                  id: true,
                  name: true,
                  sortOrder: true,
                },
              },
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

        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            startsAt: "asc",
          },
        ],
      },
    },
  })
}

const getCachedPublishedWorshipScheduleByDate = unstable_cache(
  async (dateParam: string) => {
    const item = await findPublishedWorshipScheduleByDate(dateParam)

    return item ? serializeWorshipScheduleDates(item) : null
  },
  ["public-published-worship-schedule-by-date-v1"],
  {
    revalidate: PUBLIC_WORSHIP_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.worshipSchedules],
  }
)

const getPublishedWorshipScheduleByDate = cache(async (dateParam: string) => {
  const date = parsePublicWorshipDate(dateParam)

  if (!date) {
    return null
  }

  const normalizedDate = date.toISOString().slice(0, 10)

  const item = await getCachedPublishedWorshipScheduleByDate(normalizedDate)

  return item ? hydrateWorshipScheduleDates(item) : null
})

async function findHomepagePublishedWorshipSchedule() {
  const today = getWibTodayDate()

  return prisma.worshipSchedule.findFirst({
    where: {
      isPublished: true,

      date: {
        gte: today,
      },
    },

    select: {
      id: true,
      date: true,

      services: {
        select: {
          id: true,
          name: true,
          startsAt: true,
          languageOverride: true,
          sortOrder: true,

          churchLocation: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
              googleMapsUrl: true,
              coverImageUrl: true,
              coverAltText: true,
            },
          },
        },

        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            startsAt: "asc",
          },
        ],
      },
    },

    orderBy: {
      date: "asc",
    },
  })
}

const getCachedHomepagePublishedWorshipSchedule = unstable_cache(
  async () => {
    const item = await findHomepagePublishedWorshipSchedule()

    return item ? serializeWorshipScheduleDates(item) : null
  },
  ["public-homepage-published-worship-schedule-v1"],
  {
    revalidate: PUBLIC_WORSHIP_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.worshipSchedules],
  }
)

const getHomepagePublishedWorshipSchedule = cache(async () => {
  const item = await getCachedHomepagePublishedWorshipSchedule()

  return item ? hydrateWorshipScheduleDates(item) : null
})

export {
  getHomepagePublishedWorshipSchedule,
  getPublishedWorshipScheduleByDate,
  getPublishedWorshipSchedules,
}
