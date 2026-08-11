import { prisma } from "@/lib/db/prisma"

async function getGalleryAlbum(id: string) {
  return prisma.galleryAlbum.findUnique({
    where: {
      id,
    },
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
        },
      },
    },
  })
}

export { getGalleryAlbum }
