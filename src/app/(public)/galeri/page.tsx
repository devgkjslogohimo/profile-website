import { FiImage } from "react-icons/fi"

import { PublicEmptyState } from "@/components/public/public-empty-state"
import { PublicPageHeader } from "@/components/public/public-page-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import {
  GalleryBrowser,
  type GalleryBrowserAlbum,
} from "@/features/public-site/components/gallery-browser"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getActiveGalleryAlbums } from "@/features/public-site/queries/get-public-content"

type PublicGalleryPageProps = {
  searchParams: Promise<{
    year?: string | string[]
  }>
}

async function generateMetadata() {
  return createPublicPageMetadata({
    title: "Galeri",
    description: "Galeri dokumentasi kegiatan GKJ Slogohimo.",
    pathname: "/galeri",
  })
}

function getAlbumYear(date: Date | null) {
  return date?.getUTCFullYear() ?? null
}

async function PublicGalleryPage({ searchParams }: PublicGalleryPageProps) {
  const [params, albums] = await Promise.all([searchParams, getActiveGalleryAlbums()])

  const availableYears = Array.from(
    new Set(
      albums
        .map((album) => getAlbumYear(album.eventDate))
        .filter((year): year is number => year !== null)
    )
  ).sort((a, b) => b - a)

  const rawYear = typeof params.year === "string" ? Number(params.year) : null

  const initialYear =
    rawYear !== null && Number.isInteger(rawYear) && availableYears.includes(rawYear)
      ? rawYear
      : null

  const browserAlbums: GalleryBrowserAlbum[] = albums.map((album) => ({
    id: album.id,
    title: album.title,
    slug: album.slug,
    description: album.description,
    eventDate: album.eventDate?.toISOString() ?? null,
    coverImageUrl: album.coverImageUrl,

    images: album.images.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
      caption: image.caption,
    })),
  }))

  return (
    <main>
      <Section spacing="page">
        <Container>
          <PublicPageHeader
            eyebrow="Dokumentasi"
            title="Galeri"
            description="Dokumentasi kegiatan, persekutuan, dan pelayanan GKJ Slogohimo."
          />

          {browserAlbums.length === 0 ? (
            <PublicEmptyState
              icon={FiImage}
              title="Belum ada galeri"
              description="Album dokumentasi yang aktif akan ditampilkan di halaman ini."
            />
          ) : (
            <GalleryBrowser albums={browserAlbums} initialYear={initialYear} />
          )}
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicGalleryPage
