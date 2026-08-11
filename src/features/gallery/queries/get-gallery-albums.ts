import { prisma } from "@/lib/db/prisma"

async function getGalleryAlbums() {
  return prisma.galleryAlbum.findMany({
    include: {
      _count: {
        select: {
          images: true,
        },
      },
      images: {
        where: {
          isActive: true,
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
        select: {
          id: true,
          imageUrl: true,
          caption: true,
          altText: true,
        },
      },
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  })
}

export { getGalleryAlbums }
