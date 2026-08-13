import { notFound } from "next/navigation"
import { FiExternalLink, FiImage, FiMapPin, FiUsers } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { PublicBackLink } from "@/components/public/public-back-link"
import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { buttonVariants } from "@/components/ui/button"
import { LocationPhotoLightbox } from "@/features/public-site/components/location-photo-lightbox"
import { ProfilePortraitImage } from "@/features/public-site/components/profile-portrait-image"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublicChurchLocationBySlug } from "@/features/public-site/queries/get-public-church-location"

type PublicChurchLocationPageProps = {
  params: Promise<{
    slug: string
  }>
}

const periodFormatter = new Intl.DateTimeFormat("id-ID", {
  year: "numeric",
  timeZone: "UTC",
})

function formatPeriod(start: Date, end: Date | null) {
  return `${periodFormatter.format(start)} — ${end ? periodFormatter.format(end) : "Sekarang"}`
}

async function generateMetadata({ params }: PublicChurchLocationPageProps) {
  const { slug } = await params

  const location = await getPublicChurchLocationBySlug(slug)

  if (!location) {
    return {
      title: "Lokasi Tidak Ditemukan",
    }
  }

  return createPublicPageMetadata({
    title: location.name,
    description: `Informasi lokasi, kondisi, dan dokumentasi ${location.name}.`,
    pathname: `/lokasi/${location.slug}`,
  })
}

async function PublicChurchLocationPage({ params }: PublicChurchLocationPageProps) {
  const { slug } = await params

  const location = await getPublicChurchLocationBySlug(slug)

  if (!location) {
    notFound()
  }

  const locationType = location.type === "PEPANTHAN" ? "Pepanthan" : "Gereja"

  return (
    <main>
      <Section>
        <Container>
          <PublicBackLink href="/lokasi" label="Kembali ke Lokasi" />

          <article className="mx-auto mt-8 max-w-6xl">
            <PublicDetailHeader
              eyebrow={locationType}
              title={location.name}
              description={`Informasi lokasi dan dokumentasi kondisi ${location.name}.`}
            />

            <div className="mt-8">
              <GoogleDriveImage
                url={location.coverImageUrl}
                alt={location.coverAltText ?? `Foto utama ${location.name}`}
                className="max-w-full"
                eager
              />
            </div>

            <div className="mt-8 rounded-2xl border bg-muted/20 p-5 md:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FiMapPin aria-hidden="true" className="size-5" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Jenis Lokasi</p>

                    <p className="mt-1 font-medium">{locationType}</p>
                  </div>
                </div>

                {location.googleMapsUrl ? (
                  <a
                    href={location.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({
                      variant: "outline",
                    })}
                  >
                    Buka Google Maps
                    <FiExternalLink aria-hidden="true" className="size-4" />
                  </a>
                ) : null}
              </div>
            </div>

            <section className="mt-14 border-t pt-10 md:mt-16 md:pt-12">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                    Pelayan Gereja
                  </p>

                  <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight">
                    Majelis yang Melayani
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                    Anggota Majelis yang sedang menjalankan pelayanan di {location.name}.
                  </p>
                </div>

                {location.councilMembers.length > 0 ? (
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                    <FiUsers aria-hidden="true" className="size-4" />
                    {location.councilMembers.length} anggota
                  </div>
                ) : null}
              </div>

              {location.councilMembers.length > 0 ? (
                <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-7">
                  {location.councilMembers.map((member) => (
                    <article key={member.id} className="min-w-0">
                      <ProfilePortraitImage url={member.photoUrl} alt={`Foto ${member.fullName}`} />

                      <div className="mt-4">
                        <p className="text-[11px] leading-5 font-semibold tracking-[0.12em] text-primary uppercase sm:text-xs">
                          {member.position}
                        </p>

                        <h3 className="mt-1.5 font-heading text-lg leading-snug font-medium sm:text-xl">
                          {member.fullName}
                        </h3>

                        <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                          {formatPeriod(member.periodStart, member.periodEnd)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-8 border-t py-8">
                  <p className="text-sm text-muted-foreground">
                    Data Majelis yang sedang melayani di lokasi ini belum tersedia.
                  </p>
                </div>
              )}
            </section>

            <section className="mt-14 border-t pt-10">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  Dokumentasi Lokasi
                </p>

                <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight">
                  Kondisi & Foto Gereja
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                  Dokumentasi visual untuk membantu melihat kondisi bangunan, ruang ibadah, halaman,
                  fasilitas, dan bagian lain dari lokasi ini.
                </p>
              </div>

              {location.images.length > 0 ? (
                <div className="mt-8">
                  <LocationPhotoLightbox locationName={location.name} images={location.images} />
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-dashed p-8 text-center">
                  <FiImage aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />

                  <p className="mt-3 text-sm font-medium">Belum ada koleksi foto</p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Dokumentasi lokasi ini belum tersedia.
                  </p>
                </div>
              )}
            </section>
          </article>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicChurchLocationPage
