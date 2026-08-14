import { cache } from "react"

import { getWibTodayDate } from "@/features/public-site/lib/public-date"
import { prisma } from "@/lib/db/prisma"

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

const getPublishedWorshipSchedules = cache(async (month: string | null = null) => {
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
})

const getPublishedWorshipScheduleByDate = cache(async (dateParam: string) => {
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
})

export { getPublishedWorshipScheduleByDate, getPublishedWorshipSchedules }
