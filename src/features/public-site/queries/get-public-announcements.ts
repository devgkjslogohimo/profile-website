import { cache } from "react"

import { prisma } from "@/lib/db/prisma"

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

const PUBLIC_ANNOUNCEMENT_PAGE_SIZE = 10

const getPublishedAnnouncementsPage = cache(
  async (requestedPage: number = 1, searchQuery: string = "") => {
    const query = searchQuery.trim().slice(0, 80)

    const where = {
      status: "PUBLISHED" as const,

      ...(query
        ? {
            title: {
              contains: query,
              mode: "insensitive" as const,
            },
          }
        : {}),
    }

    const total = await prisma.announcement.count({
      where,
    })

    if (total === 0) {
      return {
        items: [],
        total: 0,
        page: 1,
        totalPages: 1,
        pageSize: PUBLIC_ANNOUNCEMENT_PAGE_SIZE,
        query,
      }
    }

    const totalPages = Math.ceil(total / PUBLIC_ANNOUNCEMENT_PAGE_SIZE)

    const page =
      Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, totalPages) : 1

    const items = await prisma.announcement.findMany({
      where,

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

      skip: (page - 1) * PUBLIC_ANNOUNCEMENT_PAGE_SIZE,

      take: PUBLIC_ANNOUNCEMENT_PAGE_SIZE,
    })

    return {
      items,
      total,
      page,
      totalPages,
      pageSize: PUBLIC_ANNOUNCEMENT_PAGE_SIZE,
      query,
    }
  }
)

const getRecentPublishedAnnouncements = cache(async (excludeSlug: string) => {
  return prisma.announcement.findMany({
    where: {
      status: "PUBLISHED",

      slug: {
        not: excludeSlug,
      },
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

    take: 5,
  })
})

export {
  getPublishedAnnouncementBySlug,
  getPublishedAnnouncements,
  getPublishedAnnouncementsPage,
  getRecentPublishedAnnouncements,
}
