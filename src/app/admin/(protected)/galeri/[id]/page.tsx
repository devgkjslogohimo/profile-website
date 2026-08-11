import { notFound } from "next/navigation"

import { GalleryImageManager } from "@/features/gallery/components/gallery-image-manager"
import { getGalleryAlbum } from "@/features/gallery/queries/get-gallery-album"
import { getGalleryImages } from "@/features/gallery/queries/get-gallery-images"

type GalleryAlbumDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

async function GalleryAlbumDetailPage({ params }: GalleryAlbumDetailPageProps) {
  const { id } = await params

  const [album, images] = await Promise.all([getGalleryAlbum(id), getGalleryImages(id)])

  if (!album) {
    notFound()
  }

  return (
    <GalleryImageManager
      album={{
        id: album.id,
        title: album.title,
        slug: album.slug,
        description: album.description,
        eventDate: album.eventDate,
        googleDriveUrl: album.googleDriveUrl,
        isActive: album.isActive,
      }}
      images={images}
    />
  )
}

export default GalleryAlbumDetailPage
