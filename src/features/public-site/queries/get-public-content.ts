import { cache } from "react"

import { getWibTodayDate } from "@/features/public-site/lib/public-date"
import { prisma } from "@/lib/db/prisma"

const getPublishedWorshipSchedules = cache(async () => {
  const today = getWibTodayDate()

  return prisma.worshipSchedule.findMany({
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

    take: 12,
  })
})

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
    },
  })
})

const getPublishedAnnouncements = cache(async () => {
  return prisma.announcement.findMany({
    where: {
      status: "PUBLISHED",
    },

    select: {
      id: true,
      title: true,
      slug: true,
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
  })
})

const getPublishedAnnouncementBySlug = cache(async (slug: string) => {
  return prisma.announcement.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      publishedAt: true,
    },
  })
})

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

const getPublishedNews = cache(async () => {
  return prisma.news.findMany({
    where: {
      status: "PUBLISHED",
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
  })
})

const getPublishedNewsBySlug = cache(async (slug: string) => {
  return prisma.news.findFirst({
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
      coverImageUrl: true,
      publishedAt: true,

      author: {
        select: {
          name: true,
        },
      },

      images: {
        select: {
          id: true,
          googleDriveUrl: true,
          altText: true,
          caption: true,
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

const getActiveGalleryAlbums = cache(async () => {
  return prisma.galleryAlbum.findMany({
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
  })
})

const getActiveGalleryAlbumBySlug = cache(async (slug: string) => {
  return prisma.galleryAlbum.findFirst({
    where: {
      slug,
      isActive: true,
    },

    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      eventDate: true,
      coverImageUrl: true,
      googleDriveUrl: true,

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

const getPublishedSitePageBySlug = cache(async (slug: string) => {
  return prisma.sitePage.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      publishedAt: true,
      updatedAt: true,

      author: {
        select: {
          name: true,
        },
      },
    },
  })
})

export {
  getActiveGalleryAlbumBySlug,
  getActiveGalleryAlbums,
  getPublishedAgendaBySlug,
  getPublishedAgendas,
  getPublishedAnnouncementBySlug,
  getPublishedAnnouncements,
  getPublishedNews,
  getPublishedNewsBySlug,
  getPublishedPawartos,
  getPublishedPawartosBySlug,
  getPublishedSitePageBySlug,
  getPublishedWorshipSchedules,
}
