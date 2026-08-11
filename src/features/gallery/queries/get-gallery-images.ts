import { prisma } from "@/lib/db/prisma"

async function getGalleryImages(albumId: string) {
  return prisma.galleryImage.findMany({
    where: {
      albumId,
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

export { getGalleryImages }
