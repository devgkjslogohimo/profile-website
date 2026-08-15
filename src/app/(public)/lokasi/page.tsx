import Image from "next/image"
import Link from "next/link"
import { FiArrowRight, FiExternalLink, FiMapPin } from "react-icons/fi"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublicChurchLocations } from "@/features/public-site/queries/get-public-church-location"
import { getGoogleDriveMediaUrl } from "@/lib/google-drive"

const metadata = createPublicPageMetadata({
  title: "Lokasi",
  description:
    "Daftar gereja dan Pepanthan GKJ Slogohimo beserta informasi lokasi dan dokumentasinya.",
  pathname: "/lokasi",
})

async function PublicChurchLocationsPage() {
  const locations = await getPublicChurchLocations()

  return (
    <main>
      <Section spacing="page">
        <Container>
          <header className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Gereja & Pepanthan
            </p>

            <h1 className="mt-4 font-heading text-4xl leading-tight font-medium tracking-tight md:text-5xl">
              Lokasi Ibadah
            </h1>

            <p className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">
              Temukan lokasi gereja dan Pepanthan GKJ Slogohimo beserta informasi, dokumentasi, dan
              tautan Google Maps.
            </p>
          </header>

          {locations.length > 0 ? (
            <div className="mt-12 border-t">
              {locations.map((location, index) => {
                const coverUrl = location.coverImageUrl
                  ? getGoogleDriveMediaUrl(location.coverImageUrl)
                  : null

                const locationType = location.type === "PEPANTHAN" ? "Pepanthan" : "Gereja"

                const imageOnRight = index % 2 === 1

                return (
                  <article
                    key={location.id}
                    className={
                      imageOnRight
                        ? "grid border-b py-8 lg:grid-cols-[minmax(0,0.62fr)_minmax(280px,0.38fr)] lg:gap-12 lg:py-10"
                        : "grid border-b py-8 lg:grid-cols-[minmax(280px,0.38fr)_minmax(0,0.62fr)] lg:gap-12 lg:py-10"
                    }
                  >
                    <div
                      className={
                        imageOnRight
                          ? "relative h-56 overflow-hidden bg-muted lg:order-2 lg:h-64"
                          : "relative h-56 overflow-hidden bg-muted lg:h-64"
                      }
                    >
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={location.coverAltText ?? `Foto utama ${location.name}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 38vw"
                          loading={index === 0 ? "eager" : "lazy"}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                          <div className="text-center">
                            <FiMapPin
                              aria-hidden="true"
                              className="mx-auto size-8 text-muted-foreground/50"
                            />

                            <p className="mt-4 font-heading text-xl font-medium text-muted-foreground">
                              {location.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={
                        imageOnRight
                          ? "flex items-center pt-7 lg:order-1 lg:pt-0"
                          : "flex items-center pt-7 lg:pt-0"
                      }
                    >
                      <div className="w-full">
                        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                          {locationType}
                        </p>

                        <h2 className="mt-4 font-heading text-3xl leading-tight font-medium tracking-tight md:text-4xl">
                          {location.name}
                        </h2>

                        <p className="mt-5 flex items-start gap-3 text-sm leading-7 text-muted-foreground md:text-base">
                          <FiMapPin aria-hidden="true" className="mt-1 size-4 shrink-0" />
                          Lihat informasi lokasi, kondisi bangunan, fasilitas, dan dokumentasi foto.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                          <Link
                            href={`/lokasi/${location.slug}`}
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
                          >
                            Lihat Lokasi
                            <FiArrowRight
                              aria-hidden="true"
                              className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                            />
                          </Link>

                          {location.googleMapsUrl ? (
                            <a
                              href={location.googleMapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                            >
                              Google Maps
                              <FiExternalLink aria-hidden="true" className="size-3.5" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="mt-12 border-t py-12">
              <FiMapPin aria-hidden="true" className="size-8 text-muted-foreground/50" />

              <p className="mt-4 font-medium">Belum ada lokasi yang ditampilkan.</p>

              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Lokasi gereja dan Pepanthan yang aktif akan tampil di halaman ini.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </main>
  )
}

export { metadata }
export default PublicChurchLocationsPage
