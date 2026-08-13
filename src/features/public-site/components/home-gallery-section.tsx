import Link from "next/link"
import { FiArrowRight } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"

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
  timeZone: "UTC",
})

const galleryLayoutClasses = [
  "md:col-span-2 lg:col-span-6 lg:row-span-2",
  "lg:col-span-6",
  "lg:col-span-3",
  "md:col-span-2 lg:col-span-3",
]

function HomeGallerySection({ albums }: HomeGallerySectionProps) {
  if (albums.length === 0) {
    return null
  }

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Dokumentasi
            </p>

            <h2 className="mt-3 font-heading text-4xl font-medium tracking-tight md:text-5xl">
              Galeri Kegiatan
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              Potret kegiatan, pelayanan, dan kebersamaan jemaat GKJ Slogohimo.
            </p>
          </div>

          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Semua Galeri
            <FiArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:auto-rows-[17rem] lg:grid-cols-12">
          {albums.map((album, index) => {
            const firstImage = album.images[0]

            const imageUrl = album.coverImageUrl ?? firstImage?.imageUrl ?? null

            const altText = firstImage?.altText ?? firstImage?.caption ?? album.title

            const isFeatured = index === 0

            return (
              <Link
                key={album.id}
                href={`/galeri/${album.slug}`}
                className={`group relative isolate min-h-64 overflow-hidden rounded-2xl bg-muted lg:min-h-0 ${
                  galleryLayoutClasses[index] ?? "lg:col-span-6"
                }`}
              >
                <GoogleDriveImage
                  url={imageUrl}
                  alt={altText}
                  className="absolute inset-0 h-full w-full rounded-none border-0 transition-transform duration-500 group-hover:scale-[1.025] [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/15 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-7">
                  {album.eventDate ? (
                    <p className="text-xs font-medium tracking-wide text-white/70">
                      {dateFormatter.format(album.eventDate)}
                    </p>
                  ) : null}

                  <div className="mt-2 flex items-end justify-between gap-5">
                    <h3
                      className={`max-w-xl font-heading leading-tight font-medium text-white ${
                        isFeatured ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
                      }`}
                    >
                      {album.title}
                    </h3>

                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/10 text-white backdrop-blur-sm transition-[background-color,transform] duration-200 group-hover:translate-x-1 group-hover:bg-white group-hover:text-foreground motion-reduce:transform-none">
                      <FiArrowRight aria-hidden="true" className="size-4" />
                    </span>
                  </div>
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
