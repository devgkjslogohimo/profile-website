import Link from "next/link"
import { FiImage } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { PublicEmptyState } from "@/components/public/public-empty-state"
import { PublicPageHeader } from "@/components/public/public-page-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getActiveGalleryAlbums } from "@/features/public-site/queries/get-public-content"

async function generateMetadata() {
  return createPublicPageMetadata({
    title: "Galeri",
    description: "Galeri dokumentasi kegiatan GKJ Slogohimo.",
    pathname: "/galeri",
  })
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

async function PublicGalleryPage() {
  const albums = await getActiveGalleryAlbums()

  return (
    <main>
      <Section>
        <Container>
          <PublicPageHeader
            eyebrow="Dokumentasi"
            title="Galeri"
            description="Dokumentasi kegiatan, persekutuan, dan pelayanan GKJ Slogohimo."
          />

          {albums.length === 0 ? (
            <PublicEmptyState
              icon={FiImage}
              title="Belum ada galeri"
              description="Album dokumentasi yang aktif akan ditampilkan di halaman ini."
            />
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album, index) => {
                const firstImage = album.images[0]

                const imageUrl = album.coverImageUrl ?? firstImage?.imageUrl ?? null

                const altText = firstImage?.altText ?? firstImage?.caption ?? album.title

                return (
                  <Link
                    key={album.id}
                    href={`/galeri/${album.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-background transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <GoogleDriveImage
                      url={imageUrl}
                      alt={altText}
                      className="rounded-none border-0"
                      eager={index === 0}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      sourceWidth={1200}
                    />

                    <div className="flex flex-1 flex-col p-5">
                      {album.eventDate ? (
                        <p className="text-xs text-muted-foreground">
                          {dateFormatter.format(album.eventDate)}
                        </p>
                      ) : null}

                      <h2 className="mt-2 font-heading text-xl font-medium transition-colors group-hover:text-primary">
                        {album.title}
                      </h2>

                      {album.description ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {album.description}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicGalleryPage
