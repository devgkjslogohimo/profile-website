import { prisma } from "@/lib/db/prisma"

async function getGalleryImage(id: string) {
  return prisma.galleryImage.findUnique({
    where: {
      id,
    },
  })
}

export { getGalleryImage }
