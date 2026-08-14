import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_GALLERY_REVALIDATE_SECONDS = 300

function serializeGalleryEventDate<
  T extends {
    eventDate: Date | null
  },
>(item: T) {
  return {
    ...item,
    eventDate: item.eventDate?.toISOString() ?? null,
  }
}

function hydrateGalleryEventDate<
  T extends {
    eventDate: string | null
  },
>(item: T) {
  return {
    ...item,
    eventDate: item.eventDate ? new Date(item.eventDate) : null,
  }
}

async function findActiveGalleryAlbums() {
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
}

const getCachedActiveGalleryAlbums = unstable_cache(
  async () => {
    const items = await findActiveGalleryAlbums()

    return items.map(serializeGalleryEventDate)
  },
  ["public-active-gallery-albums-v1"],
  {
    revalidate: PUBLIC_GALLERY_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.gallery],
  }
)

const getActiveGalleryAlbums = cache(async () => {
  const items = await getCachedActiveGalleryAlbums()

  return items.map(hydrateGalleryEventDate)
})

async function findActiveGalleryAlbumBySlug(slug: string) {
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
}

const getCachedActiveGalleryAlbumBySlug = unstable_cache(
  async (slug: string) => {
    const item = await findActiveGalleryAlbumBySlug(slug)

    return item ? serializeGalleryEventDate(item) : null
  },
  ["public-active-gallery-album-by-slug-v1"],
  {
    revalidate: PUBLIC_GALLERY_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.gallery],
  }
)

const getActiveGalleryAlbumBySlug = cache(async (slug: string) => {
  const item = await getCachedActiveGalleryAlbumBySlug(slug)

  return item ? hydrateGalleryEventDate(item) : null
})

async function findHomepageActiveGalleryAlbums() {
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
  })
}

const getCachedHomepageActiveGalleryAlbums = unstable_cache(
  async () => {
    const items = await findHomepageActiveGalleryAlbums()

    return items.map(serializeGalleryEventDate)
  },
  ["public-homepage-active-gallery-albums-v1"],
  {
    revalidate: PUBLIC_GALLERY_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.gallery],
  }
)

const getHomepageActiveGalleryAlbums = cache(async () => {
  const items = await getCachedHomepageActiveGalleryAlbums()

  return items.map(hydrateGalleryEventDate)
})

export { getActiveGalleryAlbumBySlug, getActiveGalleryAlbums, getHomepageActiveGalleryAlbums }
