import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_SITEMAP_REVALIDATE_SECONDS = 300

function serializeSitemapUpdatedAt<
  T extends {
    updatedAt: Date
  },
>(item: T) {
  return {
    ...item,
    updatedAt: item.updatedAt.toISOString(),
  }
}

function hydrateSitemapUpdatedAt<
  T extends {
    updatedAt: string
  },
>(item: T) {
  return {
    ...item,
    updatedAt: new Date(item.updatedAt),
  }
}

async function findPublicSitemapContent() {
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
}

const getCachedPublicSitemapContent = unstable_cache(
  async () => {
    const content = await findPublicSitemapContent()

    return {
      pawartos: content.pawartos.map(serializeSitemapUpdatedAt),
      announcements: content.announcements.map(serializeSitemapUpdatedAt),
      agendas: content.agendas.map(serializeSitemapUpdatedAt),
      news: content.news.map(serializeSitemapUpdatedAt),
      galleryAlbums: content.galleryAlbums.map(serializeSitemapUpdatedAt),
      sitePages: content.sitePages.map(serializeSitemapUpdatedAt),
    }
  },
  ["public-sitemap-content-v1"],
  {
    revalidate: PUBLIC_SITEMAP_REVALIDATE_SECONDS,

    tags: [
      PUBLIC_CACHE_TAGS.pawartos,
      PUBLIC_CACHE_TAGS.announcements,
      PUBLIC_CACHE_TAGS.agendas,
      PUBLIC_CACHE_TAGS.news,
      PUBLIC_CACHE_TAGS.gallery,
      PUBLIC_CACHE_TAGS.sitePages,
    ],
  }
)

const getPublicSitemapContent = cache(async () => {
  const content = await getCachedPublicSitemapContent()

  return {
    pawartos: content.pawartos.map(hydrateSitemapUpdatedAt),
    announcements: content.announcements.map(hydrateSitemapUpdatedAt),
    agendas: content.agendas.map(hydrateSitemapUpdatedAt),
    news: content.news.map(hydrateSitemapUpdatedAt),
    galleryAlbums: content.galleryAlbums.map(hydrateSitemapUpdatedAt),
    sitePages: content.sitePages.map(hydrateSitemapUpdatedAt),
  }
})

export { getPublicSitemapContent }
