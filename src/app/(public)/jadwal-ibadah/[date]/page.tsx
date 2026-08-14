import Link from "next/link"
import { notFound } from "next/navigation"
import { FiClock, FiExternalLink, FiMapPin, FiUsers } from "react-icons/fi"

import { PublicBackLink } from "@/components/public/public-back-link"
import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublishedWorshipScheduleByDate } from "@/features/public-site/queries/get-public-content"
import {
  getWorshipLanguageLabel,
  resolveWorshipLanguage,
} from "@/features/worship-schedules/lib/worship-language"

type PublicWorshipScheduleDetailPageProps = {
  params: Promise<{
    date: string
  }>
}

const fullDateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
})

async function generateMetadata({ params }: PublicWorshipScheduleDetailPageProps) {
  const { date } = await params

  const schedule = await getPublishedWorshipScheduleByDate(date)

  if (!schedule) {
    return {
      title: "Jadwal Ibadah Tidak Ditemukan",
    }
  }

  const formattedDate = fullDateFormatter.format(schedule.date)

  return createPublicPageMetadata({
    title: `Jadwal Ibadah ${formattedDate}`,
    description: `Detail jadwal, lokasi, dan petugas ibadah GKJ Slogohimo pada ${formattedDate}.`,
    pathname: `/jadwal-ibadah/${date}`,
  })
}

async function PublicWorshipScheduleDetailPage({ params }: PublicWorshipScheduleDetailPageProps) {
  const { date } = await params

  const schedule = await getPublishedWorshipScheduleByDate(date)

  if (!schedule) {
    notFound()
  }

  const formattedDate = fullDateFormatter.format(schedule.date)

  return (
    <main>
      <Section>
        <Container>
          <PublicBackLink href="/jadwal-ibadah" label="Kembali ke Jadwal Ibadah" />

          <article className="mt-8">
            <PublicDetailHeader
              eyebrow="Jadwal Ibadah"
              title={formattedDate}
              description="Informasi lengkap waktu, lokasi, bahasa, dan petugas ibadah."
              meta={<span>{schedule.services.length} ibadah pada tanggal ini</span>}
            />

            <div className="mt-12 space-y-6">
              {schedule.services.map((service) => {
                const language = getWorshipLanguageLabel(
                  resolveWorshipLanguage(schedule.date, service.languageOverride)
                )

                return (
                  <section
                    id={service.id}
                    key={service.id}
                    className="scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-border/70 bg-background"
                  >
                    <div className="grid lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
                      <div className="bg-amber-950/90 p-6 text-white sm:p-8 lg:border-r lg:border-amber-950/20">
                        <p className="text-xs font-semibold tracking-[0.16em] text-amber-200/90 uppercase">
                          {service.churchLocation.type === "PEPANTHAN" ? "Pepanthan" : "Gereja"}
                        </p>

                        <h2 className="mt-3 font-heading text-2xl leading-snug font-semibold tracking-tight text-white sm:text-3xl">
                          {service.name}
                        </h2>

                        <div className="mt-6 space-y-4 text-sm">
                          <div className="flex items-start gap-3">
                            <FiClock
                              aria-hidden="true"
                              className="mt-0.5 size-4 shrink-0 text-amber-200"
                            />

                            <div>
                              <p className="font-medium text-amber-100/70">Waktu</p>

                              <p className="mt-1 text-amber-50">
                                {timeFormatter.format(service.startsAt).replace(".", ":")} WIB
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <FiMapPin
                              aria-hidden="true"
                              className="mt-0.5 size-4 shrink-0 text-amber-200"
                            />

                            <div>
                              <p className="font-medium text-amber-100/70">Lokasi</p>

                              <p className="mt-1 leading-6 text-amber-50">
                                {service.churchLocation.name}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="font-medium text-amber-100/70">Bahasa</p>

                            <p className="mt-1 text-amber-50">{language}</p>
                          </div>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-2">
                          {service.churchLocation.isActive ? (
                            <Link
                              href={`/lokasi/${service.churchLocation.slug}`}
                              className="inline-flex h-9 items-center justify-center rounded-lg border border-amber-200/30 bg-white/5 px-4 text-sm font-medium text-amber-50 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-950 focus-visible:outline-none"
                            >
                              Detail Lokasi
                            </Link>
                          ) : null}

                          {service.churchLocation.googleMapsUrl ? (
                            <a
                              href={service.churchLocation.googleMapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-amber-100/80 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-950 focus-visible:outline-none"
                            >
                              Google Maps
                              <FiExternalLink aria-hidden="true" className="size-4" />
                            </a>
                          ) : null}
                        </div>
                      </div>

                      <div className="border-t border-border/70 p-6 sm:p-8 lg:border-t-0">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-950/90 text-amber-100">
                            <FiUsers aria-hidden="true" className="size-4" />
                          </div>

                          <div>
                            <p className="text-xs font-semibold tracking-[0.16em] text-amber-800/80 uppercase">
                              Pelayanan
                            </p>

                            <h3 className="mt-1 font-heading text-xl font-semibold">
                              Petugas Ibadah
                            </h3>
                          </div>
                        </div>

                        {service.assignments.length > 0 ? (
                          <div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                            {service.assignments.map((assignment) => (
                              <div
                                key={assignment.id}
                                className="border-t border-amber-950/10 pt-4"
                              >
                                <p className="text-xs font-semibold tracking-[0.12em] text-amber-800/80 uppercase">
                                  {assignment.worshipServiceRole.name}
                                </p>

                                <p className="mt-2 text-base leading-6 font-medium text-foreground">
                                  {assignment.personName}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-7 rounded-xl border border-dashed bg-muted/20 px-5 py-6 text-sm leading-6 text-muted-foreground">
                            Data petugas ibadah belum tersedia.
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )
              })}
            </div>
          </article>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicWorshipScheduleDetailPage
