import { cache } from "react"

import { getWibTodayDate } from "@/features/public-site/lib/public-date"
import { prisma } from "@/lib/db/prisma"

const getHomepageData = cache(async () => {
  const now = new Date()
  const today = getWibTodayDate(now)

  const [worshipSchedule, agendas, news, galleryAlbums] = await Promise.all([
    prisma.worshipSchedule.findFirst({
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
            sortOrder: true,

            churchLocation: {
              select: {
                id: true,
                name: true,
                slug: true,
                type: true,
                googleMapsUrl: true,
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
    }),

    prisma.agenda.findMany({
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
    }),

    prisma.news.findMany({
      where: {
        status: "PUBLISHED",

        publishedAt: {
          not: null,
        },
      },

      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        publishedAt: true,
      },

      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],

      take: 3,
    }),

    prisma.galleryAlbum.findMany({
      where: {
        isActive: true,
      },

      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        eventDate: true,
        coverImageUrl: true,
        sortOrder: true,

        images: {
          where: {
            isActive: true,
          },

          select: {
            id: true,
            imageUrl: true,
            altText: true,
            caption: true,
          },

          orderBy: [
            {
              sortOrder: "asc",
            },
            {
              createdAt: "asc",
            },
          ],

          take: 1,
        },
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          eventDate: "desc",
        },
        {
          createdAt: "desc",
        },
      ],

      take: 4,
    }),
  ])

  return {
    worshipSchedule,
    agendas,
    news,
    galleryAlbums,
  }
})

export { getHomepageData }
