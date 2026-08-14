import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { getWibTodayDate } from "@/features/public-site/lib/public-date"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_CHURCH_LOCATION_REVALIDATE_SECONDS = 300

function serializeChurchLocationCouncilDates<
  T extends {
    councilMembers: Array<{
      periodStart: Date
      periodEnd: Date | null
    }>
  },
>(item: T) {
  return {
    ...item,

    councilMembers: item.councilMembers.map((member) => ({
      ...member,
      periodStart: member.periodStart.toISOString(),
      periodEnd: member.periodEnd?.toISOString() ?? null,
    })),
  }
}

function hydrateChurchLocationCouncilDates<
  T extends {
    councilMembers: Array<{
      periodStart: string
      periodEnd: string | null
    }>
  },
>(item: T) {
  return {
    ...item,

    councilMembers: item.councilMembers.map((member) => ({
      ...member,
      periodStart: new Date(member.periodStart),
      periodEnd: member.periodEnd ? new Date(member.periodEnd) : null,
    })),
  }
}

async function findPublicChurchLocationBySlug(slug: string) {
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
}

const getCachedPublicChurchLocationBySlug = unstable_cache(
  async (slug: string) => {
    const location = await findPublicChurchLocationBySlug(slug)

    return location ? serializeChurchLocationCouncilDates(location) : null
  },
  ["public-church-location-by-slug-v1"],
  {
    revalidate: PUBLIC_CHURCH_LOCATION_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.churchLocations],
  }
)

const getPublicChurchLocationBySlug = cache(async (slug: string) => {
  const location = await getCachedPublicChurchLocationBySlug(slug)

  return location ? hydrateChurchLocationCouncilDates(location) : null
})

async function findPublicChurchLocations() {
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
}

const getCachedPublicChurchLocations = unstable_cache(
  findPublicChurchLocations,
  ["public-church-locations-v1"],
  {
    revalidate: PUBLIC_CHURCH_LOCATION_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.churchLocations],
  }
)

const getPublicChurchLocations = cache(async () => {
  return getCachedPublicChurchLocations()
})

export { getPublicChurchLocationBySlug, getPublicChurchLocations }
