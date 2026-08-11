import { notFound } from "next/navigation"

import { EditGalleryAlbumView } from "@/features/gallery/components/edit-gallery-album-view"
import { getGalleryAlbum } from "@/features/gallery/queries/get-gallery-album"

type EditGalleryAlbumPageProps = {
  params: Promise<{
    id: string
  }>
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10)
}

async function EditGalleryAlbumPage({ params }: EditGalleryAlbumPageProps) {
  const { id } = await params

  const album = await getGalleryAlbum(id)

  if (!album) {
    notFound()
  }

  return (
    <EditGalleryAlbumView
      album={{
        id: album.id,
        title: album.title,
        slug: album.slug,
        description: album.description,
        eventDate: album.eventDate ? formatDateInput(album.eventDate) : null,
        coverImageUrl: album.coverImageUrl,
        fallbackCoverImageUrl: album.images[0]?.imageUrl ?? null,
        googleDriveUrl: album.googleDriveUrl,
        isActive: album.isActive,
        imageCount: album._count.images,
      }}
    />
  )
}

export default EditGalleryAlbumPage
