import { notFound } from "next/navigation"
import { FiExternalLink, FiImage } from "react-icons/fi"

import { PublicBackLink } from "@/components/public/public-back-link"
import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { PublicEmptyState } from "@/components/public/public-empty-state"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { GalleryPhotoLightbox } from "@/features/public-site/components/gallery-photo-lightbox"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import {
  getActiveGalleryAlbumBySlug,
  getActiveGalleryAlbums,
} from "@/features/public-site/queries/get-public-content"

type PublicGalleryDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

async function generateStaticParams() {
  const albums = await getActiveGalleryAlbums()

  return albums.map((album) => ({
    slug: album.slug,
  }))
}

async function generateMetadata({ params }: PublicGalleryDetailPageProps) {
  const { slug } = await params

  const album = await getActiveGalleryAlbumBySlug(slug)

  if (!album) {
    return {
      title: "Galeri Tidak Ditemukan",
    }
  }

  const description = album.description ?? `Galeri kegiatan GKJ Slogohimo: ${album.title}.`

  return createPublicPageMetadata({
    title: album.title,
    description,
    pathname: `/galeri/${album.slug}`,
  })
}

async function PublicGalleryDetailPage({ params }: PublicGalleryDetailPageProps) {
  const { slug } = await params

  const album = await getActiveGalleryAlbumBySlug(slug)

  if (!album) {
    notFound()
  }

  return (
    <main>
      <Section spacing="page">
        <Container>
          <PublicBackLink href="/galeri" label="Kembali ke Galeri" />

          <article className="mt-8">
            <PublicDetailHeader
              eyebrow="Galeri"
              title={album.title}
              description={album.description}
              meta={
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {album.eventDate ? <span>{dateFormatter.format(album.eventDate)}</span> : null}

                  {album.eventDate && album.images.length > 0 ? (
                    <span aria-hidden="true" className="text-border">
                      •
                    </span>
                  ) : null}

                  {album.images.length > 0 ? <span>{album.images.length} foto</span> : null}
                </div>
              }
            />

            {album.googleDriveUrl ? (
              <a
                href={album.googleDriveUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-full border border-border/80 bg-background px-4 text-sm font-medium text-foreground transition-[border-color,background-color,color] duration-300 ease-out hover:border-primary/30 hover:bg-muted/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Buka Folder Google Drive
                <FiExternalLink aria-hidden="true" className="size-4" />
              </a>
            ) : null}

            {album.images.length === 0 ? (
              <div className="mt-10">
                <PublicEmptyState
                  icon={FiImage}
                  title="Belum ada foto"
                  description="Belum ada foto aktif pada album ini."
                />
              </div>
            ) : (
              <section className="mt-12" aria-labelledby="album-photo-title">
                <div className="mb-6 flex flex-col gap-2 border-b border-border/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                      Dokumentasi
                    </p>

                    <h2
                      id="album-photo-title"
                      className="mt-1 font-heading text-2xl font-semibold tracking-tight"
                    >
                      Foto kegiatan
                    </h2>
                  </div>

                  <p className="text-sm text-muted-foreground">Klik foto untuk memperbesar</p>
                </div>

                <GalleryPhotoLightbox
                  albumTitle={album.title}
                  images={album.images.map((image) => ({
                    id: image.id,
                    imageUrl: image.imageUrl,
                    caption: image.caption,
                    altText: image.altText,
                  }))}
                />
              </section>
            )}
          </article>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata, generateStaticParams }
export default PublicGalleryDetailPage
