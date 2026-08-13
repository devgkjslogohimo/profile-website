import { cache } from "react"

import { prisma } from "@/lib/db/prisma"

const getPublicSitemapContent = cache(async () => {
  const [pawartos, announcements, agendas, news, galleryAlbums, sitePages] = await Promise.all([
    prisma.pawartos.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),

    prisma.announcement.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),

    prisma.agenda.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),

    prisma.news.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),

    prisma.galleryAlbum.findMany({
      where: {
        isActive: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),

    prisma.sitePage.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
  ])

  return {
    pawartos,
    announcements,
    agendas,
    news,
    galleryAlbums,
    sitePages,
  }
})

export { getPublicSitemapContent }
