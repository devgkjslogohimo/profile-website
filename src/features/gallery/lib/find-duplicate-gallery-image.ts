import { prisma } from "@/lib/db/prisma"
import { getGoogleDriveFileId } from "@/lib/google-drive"

type FindDuplicateGalleryImageParams = {
  albumId: string
  fileId: string
  excludeId?: string
}

async function findDuplicateGalleryImage({
  albumId,
  fileId,
  excludeId,
}: FindDuplicateGalleryImageParams) {
  const images = await prisma.galleryImage.findMany({
    where: {
      albumId,
      ...(excludeId
        ? {
            NOT: {
              id: excludeId,
            },
          }
        : {}),
    },
    select: {
      id: true,
      imageUrl: true,
    },
  })

  return images.find((image) => getGoogleDriveFileId(image.imageUrl) === fileId) ?? null
}

export { findDuplicateGalleryImage }
