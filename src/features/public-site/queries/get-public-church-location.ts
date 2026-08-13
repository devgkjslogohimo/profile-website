import { cache } from "react"

import { prisma } from "@/lib/db/prisma"

const wibDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

function getWibTodayDate() {
  const parts = Object.fromEntries(
    wibDateFormatter.formatToParts(new Date()).map((part) => [part.type, part.value])
  )

  return new Date(`${parts.year}-${parts.month}-${parts.day}T00:00:00.000Z`)
}

const getPublicChurchLocationBySlug = cache(async (slug: string) => {
  const today = getWibTodayDate()

  return prisma.churchLocation.findFirst({
    where: {
      slug,
      isActive: true,
    },

    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      googleMapsUrl: true,

      coverImageUrl: true,
      coverAltText: true,

      councilMembers: {
        where: {
          isActive: true,

          periodStart: {
            lte: today,
          },

          OR: [
            {
              periodEnd: null,
            },
            {
              periodEnd: {
                gte: today,
              },
            },
          ],
        },

        select: {
          id: true,
          fullName: true,
          position: true,
          periodStart: true,
          periodEnd: true,
          photoUrl: true,
          sortOrder: true,
        },

        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            fullName: "asc",
          },
        ],
      },

      images: {
        where: {
          isActive: true,
        },

        select: {
          id: true,
          imageUrl: true,
          caption: true,
          altText: true,
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
})

const getPublicChurchLocations = cache(async () => {
  return prisma.churchLocation.findMany({
    where: {
      isActive: true,
    },

    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      googleMapsUrl: true,
      sortOrder: true,

      coverImageUrl: true,
      coverAltText: true,
    },

    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  })
})

export { getPublicChurchLocationBySlug, getPublicChurchLocations }
