import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { buttonVariants } from "@/components/ui/button"

type HomeGallerySectionProps = {
  albums: {
    id: string
    title: string
    slug: string
    description: string | null
    eventDate: Date | null
    coverImageUrl: string | null

    images: {
      id: string
      imageUrl: string
      altText: string | null
      caption: string | null
    }[]
  }[]
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",

  /*
   * Gallery eventDate adalah
   * PostgreSQL DATE.
   */
  timeZone: "UTC",
})

function HomeGallerySection({ albums }: HomeGallerySectionProps) {
  if (albums.length === 0) {
    return null
  }

  return (
    <Section className="bg-muted/30">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Dokumentasi"
            title="Galeri Kegiatan"
            description="Dokumentasi pelayanan dan kegiatan GKJ Slogohimo."
          />

          <Link
            href="/galeri"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Lihat Galeri
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {albums.map((album) => {
            const firstImage = album.images[0]

            const imageUrl = album.coverImageUrl ?? firstImage?.imageUrl ?? null

            const altText = firstImage?.altText ?? firstImage?.caption ?? album.title

            return (
              <Link
                key={album.id}
                href={`/galeri/${album.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-background transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
              >
                <GoogleDriveImage url={imageUrl} alt={altText} className="rounded-none border-0" />

                <div className="flex flex-1 flex-col p-5">
                  {album.eventDate ? (
                    <p className="text-xs text-muted-foreground">
                      {dateFormatter.format(album.eventDate)}
                    </p>
                  ) : null}

                  <h3 className="mt-2 font-heading text-lg leading-snug font-medium transition-colors group-hover:text-primary">
                    {album.title}
                  </h3>

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
      </Container>
    </Section>
  )
}

export { HomeGallerySection }
