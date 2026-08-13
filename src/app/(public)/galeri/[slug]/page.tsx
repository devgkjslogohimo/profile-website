import { notFound } from "next/navigation"
import { FiExternalLink } from "react-icons/fi"
import { FiImage } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { PublicBackLink } from "@/components/public/public-back-link"
import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { PublicEmptyState } from "@/components/public/public-empty-state"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getActiveGalleryAlbumBySlug } from "@/features/public-site/queries/get-public-content"

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
      <Section>
        <Container>
          <PublicBackLink href="/galeri" label="Kembali ke Galeri" />

          <article className="mt-8">
            <PublicDetailHeader
              eyebrow="Galeri"
              title={album.title}
              description={album.description}
              meta={
                album.eventDate ? <span>{dateFormatter.format(album.eventDate)}</span> : undefined
              }
            />

            {album.googleDriveUrl ? (
              <a
                href={album.googleDriveUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Buka Folder Google Drive
                <FiExternalLink className="size-4" />
              </a>
            ) : null}

            {album.images.length === 0 ? (
              <PublicEmptyState
                icon={FiImage}
                title="Belum ada foto"
                description="Belum ada foto aktif pada album ini."
              />
            ) : (
              <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
                {album.images.map((image) => (
                  <figure
                    key={image.id}
                    className="mb-5 break-inside-avoid overflow-hidden rounded-2xl border bg-background"
                  >
                    <GoogleDriveImage
                      url={image.imageUrl}
                      alt={image.altText || image.caption || album.title}
                      className="rounded-none border-0"
                    />

                    {image.caption ? (
                      <figcaption className="p-4 text-sm leading-6 text-muted-foreground">
                        {image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            )}
          </article>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicGalleryDetailPage
