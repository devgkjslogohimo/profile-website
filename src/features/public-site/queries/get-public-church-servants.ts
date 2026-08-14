import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_CHURCH_SERVANTS_REVALIDATE_SECONDS = 300

function serializeServicePeriod<
  T extends {
    periodStart: Date
    periodEnd: Date | null
  },
>(item: T) {
  return {
    ...item,
    periodStart: item.periodStart.toISOString(),
    periodEnd: item.periodEnd?.toISOString() ?? null,
  }
}

function hydrateServicePeriod<
  T extends {
    periodStart: string
    periodEnd: string | null
  },
>(item: T) {
  return {
    ...item,
    periodStart: new Date(item.periodStart),
    periodEnd: item.periodEnd ? new Date(item.periodEnd) : null,
  }
}

async function findPublicChurchServants() {
  const today = new Date()

  const [pastor, councilLocations] = await Promise.all([
    prisma.churchPastor.findFirst({
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
        slug: true,
        periodStart: true,
        periodEnd: true,
        summary: true,
        biography: true,
        photoUrl: true,
      },

      orderBy: {
        periodStart: "desc",
      },
    }),

    prisma.churchLocation.findMany({
      where: {
        isActive: true,

        councilMembers: {
          some: {
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
        },
      },

      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        sortOrder: true,

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
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    }),
  ])

  const councilGroups = councilLocations.map((location) => ({
    location: {
      id: location.id,
      name: location.name,
      slug: location.slug,
      type: location.type,
      sortOrder: location.sortOrder,
    },

    members: location.councilMembers,
  }))

  return {
    pastor,
    councilGroups,
  }
}

const getCachedPublicChurchServants = unstable_cache(
  async () => {
    const result = await findPublicChurchServants()

    return {
      pastor: result.pastor ? serializeServicePeriod(result.pastor) : null,

      councilGroups: result.councilGroups.map((group) => ({
        ...group,
        members: group.members.map(serializeServicePeriod),
      })),
    }
  },
  ["public-church-servants-v1"],
  {
    revalidate: PUBLIC_CHURCH_SERVANTS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.churchServants],
  }
)

const getPublicChurchServants = cache(async () => {
  const result = await getCachedPublicChurchServants()

  return {
    pastor: result.pastor ? hydrateServicePeriod(result.pastor) : null,

    councilGroups: result.councilGroups.map((group) => ({
      ...group,
      members: group.members.map(hydrateServicePeriod),
    })),
  }
})

async function findPublicChurchPastorBySlug(slug: string) {
  return prisma.churchPastor.findFirst({
    where: {
      slug,
      isActive: true,
    },

    select: {
      id: true,
      fullName: true,
      slug: true,
      periodStart: true,
      periodEnd: true,
      summary: true,
      biography: true,
      photoUrl: true,
    },
  })
}

const getCachedPublicChurchPastorBySlug = unstable_cache(
  async (slug: string) => {
    const pastor = await findPublicChurchPastorBySlug(slug)

    return pastor ? serializeServicePeriod(pastor) : null
  },
  ["public-church-pastor-by-slug-v1"],
  {
    revalidate: PUBLIC_CHURCH_SERVANTS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.churchServants],
  }
)

const getPublicChurchPastorBySlug = cache(async (slug: string) => {
  const pastor = await getCachedPublicChurchPastorBySlug(slug)

  return pastor ? hydrateServicePeriod(pastor) : null
})

export { getPublicChurchPastorBySlug, getPublicChurchServants }
