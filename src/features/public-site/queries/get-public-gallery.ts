import { cache } from "react"

import { prisma } from "@/lib/db/prisma"

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

export { getActiveGalleryAlbumBySlug, getActiveGalleryAlbums }
