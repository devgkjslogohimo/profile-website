import { notFound } from "next/navigation"

import { EditGalleryImageView } from "@/features/gallery/components/edit-gallery-image-view"
import { getGalleryAlbum } from "@/features/gallery/queries/get-gallery-album"
import { getGalleryImage } from "@/features/gallery/queries/get-gallery-image"

type EditGalleryImagePageProps = {
  params: Promise<{
    id: string
    imageId: string
  }>
}

async function EditGalleryImagePage({ params }: EditGalleryImagePageProps) {
  const { id, imageId } = await params

  const [album, image] = await Promise.all([getGalleryAlbum(id), getGalleryImage(imageId)])

  if (!album || !image || image.albumId !== album.id) {
    notFound()
  }

  return (
    <EditGalleryImageView
      album={{
        id: album.id,
        title: album.title,
      }}
      image={{
        id: image.id,
        albumId: image.albumId,
        imageUrl: image.imageUrl,
        caption: image.caption,
        altText: image.altText,
        isActive: image.isActive,
      }}
    />
  )
}

export default EditGalleryImagePage
