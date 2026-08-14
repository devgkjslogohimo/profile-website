import Link from "next/link"
import { notFound } from "next/navigation"
import { FiArrowRight, FiCalendar, FiClock, FiExternalLink, FiMapPin } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { PublicBackLink } from "@/components/public/public-back-link"
import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { PublicRichText } from "@/components/public/public-rich-text"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import {
  getPublishedAgendaBySlug,
  getRecentUpcomingPublishedAgendas,
} from "@/features/public-site/queries/get-public-content"
import { isRichTextContent } from "@/lib/rich-text"

type PublicAgendaDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

const shortDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

const dayFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  timeZone: "Asia/Jakarta",
})

const shortMonthFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  timeZone: "Asia/Jakarta",
})

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Jakarta",
})

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
})

function formatTime(date: Date) {
  return timeFormatter.format(date).replace(".", ":")
}

function formatAgendaTimeRange(startsAt: Date, endsAt: Date | null) {
  if (!endsAt) {
    return `${formatTime(startsAt)} WIB`
  }

  const sameDay = dateKeyFormatter.format(startsAt) === dateKeyFormatter.format(endsAt)

  if (sameDay) {
    return `${formatTime(startsAt)}–${formatTime(endsAt)} WIB`
  }

  return `${shortDateFormatter.format(startsAt)}, ${formatTime(
    startsAt
  )} WIB – ${shortDateFormatter.format(endsAt)}, ${formatTime(endsAt)} WIB`
}

async function generateMetadata({ params }: PublicAgendaDetailPageProps) {
  const { slug } = await params

  const agenda = await getPublishedAgendaBySlug(slug)

  if (!agenda) {
    return {
      title: "Agenda Tidak Ditemukan",
    }
  }

  return createPublicPageMetadata({
    title: agenda.title,
    description: agenda.excerpt,
    pathname: `/agenda/${agenda.slug}`,
  })
}

async function PublicAgendaDetailPage({ params }: PublicAgendaDetailPageProps) {
  const { slug } = await params

  const [agenda, upcomingAgendas] = await Promise.all([
    getPublishedAgendaBySlug(slug),
    getRecentUpcomingPublishedAgendas(slug),
  ])

  if (!agenda) {
    notFound()
  }

  if (!isRichTextContent(agenda.content)) {
    throw new Error(`Invalid rich text content for agenda ${agenda.id}`)
  }

  return (
    <main>
      <Section>
        <Container>
          <PublicBackLink href="/agenda" label="Kembali ke Agenda" />

          <article className="mt-8">
            <PublicDetailHeader
              eyebrow="Agenda"
              title={agenda.title}
              description={agenda.excerpt}
              meta={<span>{dateFormatter.format(agenda.startsAt)}</span>}
            />

            <div className="mt-8 grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="min-w-0">
                <GoogleDriveImage
                  url={agenda.coverImageUrl}
                  alt={`Cover ${agenda.title}`}
                  className="max-w-full"
                  eager
                />

                <div className="mt-8 rounded-2xl border border-border/70 bg-muted/20 p-5 sm:p-6">
                  <div className="grid gap-6 text-sm md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FiCalendar aria-hidden="true" className="size-4" />
                      </div>

                      <div>
                        <p className="font-medium text-foreground">Waktu</p>

                        <p className="mt-1 leading-6 text-muted-foreground">
                          {dateFormatter.format(agenda.startsAt)}
                          <br />
                          {formatAgendaTimeRange(agenda.startsAt, agenda.endsAt)}
                        </p>
                      </div>
                    </div>

                    {agenda.location ? (
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <FiMapPin aria-hidden="true" className="size-4" />
                        </div>

                        <div>
                          <p className="font-medium text-foreground">Lokasi</p>

                          <p className="mt-1 leading-6 text-muted-foreground">{agenda.location}</p>

                          {agenda.googleMapsUrl ? (
                            <a
                              href={agenda.googleMapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex items-center gap-2 font-medium text-primary"
                            >
                              Buka Google Maps
                              <FiExternalLink aria-hidden="true" className="size-3.5" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-10 max-w-3xl">
                  <PublicRichText content={agenda.content} />
                </div>
              </div>

              {upcomingAgendas.length > 0 ? (
                <aside
                  aria-labelledby="upcoming-agenda-sidebar"
                  className="lg:sticky lg:top-24 lg:self-start"
                >
                  <div className="border-t border-border/70 pt-6 lg:rounded-2xl lg:border lg:p-6">
                    <div className="border-b border-border/70 pb-5">
                      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                        Akan Datang
                      </p>

                      <h2
                        id="upcoming-agenda-sidebar"
                        className="mt-2 font-heading text-2xl font-medium tracking-tight"
                      >
                        Agenda Berikutnya
                      </h2>

                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        Kegiatan GKJ Slogohimo yang akan datang.
                      </p>
                    </div>

                    <div>
                      {upcomingAgendas.map((item) => (
                        <Link
                          key={item.id}
                          href={`/agenda/${item.slug}`}
                          className="group grid grid-cols-[3.25rem_minmax(0,1fr)] gap-3 border-b border-border/60 py-5"
                        >
                          <div>
                            <p className="font-heading text-2xl leading-none font-semibold tracking-tight">
                              {dayFormatter.format(item.startsAt)}
                            </p>

                            <p className="mt-1 text-[0.65rem] font-semibold tracking-[0.12em] text-primary uppercase">
                              {shortMonthFormatter.format(item.startsAt)}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <FiClock aria-hidden="true" className="size-3" />

                              {formatAgendaTimeRange(item.startsAt, item.endsAt)}
                            </p>

                            <h3 className="mt-1.5 line-clamp-3 font-heading text-base leading-snug font-medium transition-colors group-hover:text-primary">
                              {item.title}
                            </h3>

                            {item.location ? (
                              <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                                {item.location}
                              </p>
                            ) : null}

                            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                              Detail
                              <FiArrowRight
                                aria-hidden="true"
                                className="size-3 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                              />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Link
                      href="/agenda"
                      className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      Semua Agenda
                      <FiArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </Link>
                  </div>
                </aside>
              ) : null}
            </div>
          </article>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicAgendaDetailPage
