import { cache } from "react"

import { prisma } from "@/lib/db/prisma"

const getPublicChurchServants = cache(async () => {
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
})

const getPublicChurchPastorBySlug = cache(async (slug: string) => {
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
})

export { getPublicChurchPastorBySlug, getPublicChurchServants }
