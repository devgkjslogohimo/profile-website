import { GalleryAlbumManager } from "@/features/gallery/components/gallery-album-manager"
import { getGalleryAlbums } from "@/features/gallery/queries/get-gallery-albums"

async function GalleryPage() {
  const albums = await getGalleryAlbums()

  return <GalleryAlbumManager albums={albums} />
}

export default GalleryPage
