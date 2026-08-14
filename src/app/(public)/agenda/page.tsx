import Link from "next/link"
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiExternalLink,
  FiMapPin,
  FiSearch,
  FiX,
} from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { PublicEmptyState } from "@/components/public/public-empty-state"
import { PublicPageHeader } from "@/components/public/public-page-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import {
  getLatestCompletedPublishedAgenda,
  getPublishedAgendaArchive,
  getPublishedAgendaArchiveYears,
  getUpcomingPublishedAgendas,
} from "@/features/public-site/queries/get-public-content"

type PublicAgendaPageProps = {
  searchParams: Promise<{
    tahun?: string | string[]
    bulan?: string | string[]
    q?: string | string[]
  }>
}

type AgendaArchiveItem = Awaited<ReturnType<typeof getPublishedAgendaArchive>>[number]

async function generateMetadata() {
  return createPublicPageMetadata({
    title: "Agenda",
    description: "Agenda dan kegiatan GKJ Slogohimo.",
    pathname: "/agenda",
  })
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

const monthFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  timeZone: "Asia/Jakarta",
})

const shortMonthFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  timeZone: "Asia/Jakarta",
})

const yearNumberFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

const monthNumberFormatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
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

function createMonthOptions(year: number) {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(year, index, 15, 12))

    return {
      value: index + 1,
      label: monthFormatter.format(date),
    }
  })
}

function groupArchiveByMonth(items: AgendaArchiveItem[]) {
  const groups = new Map<number, AgendaArchiveItem[]>()

  for (const item of items) {
    const month = Number(monthNumberFormatter.format(item.startsAt))

    const current = groups.get(month)

    if (current) {
      current.push(item)
    } else {
      groups.set(month, [item])
    }
  }

  return Array.from(groups.entries()).map(([month, items]) => ({
    month,
    items,
  }))
}

async function PublicAgendaPage({ searchParams }: PublicAgendaPageProps) {
  const params = await searchParams

  const [upcoming, availableYears, latestCompleted] = await Promise.all([
    getUpcomingPublishedAgendas(),
    getPublishedAgendaArchiveYears(),
    getLatestCompletedPublishedAgenda(),
  ])

  const featured = upcoming.items[0] ?? null
  const otherUpcoming = upcoming.items.slice(1)

  const rawQuery = typeof params.q === "string" ? params.q : ""

  const searchQuery = rawQuery.trim().slice(0, 80)

  const requestedYear = typeof params.tahun === "string" ? Number(params.tahun) : null

  const latestArchiveYear = latestCompleted
    ? Number(yearNumberFormatter.format(latestCompleted.startsAt))
    : null

  const latestArchiveMonth = latestCompleted
    ? Number(monthNumberFormatter.format(latestCompleted.startsAt))
    : null

  const selectedYear =
    requestedYear !== null &&
    Number.isInteger(requestedYear) &&
    availableYears.includes(requestedYear)
      ? requestedYear
      : latestArchiveYear

  const rawMonth = typeof params.bulan === "string" ? params.bulan : null

  const requestedMonth = rawMonth !== null && rawMonth !== "" ? Number(rawMonth) : null

  const isInitialArchiveView = typeof params.tahun !== "string" && rawMonth === null && !searchQuery

  const selectedMonth = isInitialArchiveView
    ? latestArchiveMonth
    : requestedMonth !== null &&
        Number.isInteger(requestedMonth) &&
        requestedMonth >= 1 &&
        requestedMonth <= 12
      ? requestedMonth
      : null

  const monthOptions = selectedYear ? createMonthOptions(selectedYear) : []

  const archive = selectedYear
    ? await getPublishedAgendaArchive(selectedYear, selectedMonth, searchQuery)
    : []

  const archiveGroups = groupArchiveByMonth(archive)

  return (
    <main>
      <Section>
        <Container>
          <PublicPageHeader
            eyebrow="Kegiatan Gereja"
            title="Agenda"
            description="Agenda kegiatan, pelayanan, dan persekutuan GKJ Slogohimo."
          />

          <section aria-labelledby="agenda-mendatang" className="mt-10">
            <div className="flex items-end justify-between gap-6 border-b border-border/70 pb-5">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  Akan Datang
                </p>

                <h2
                  id="agenda-mendatang"
                  className="mt-2 font-heading text-3xl font-medium tracking-tight"
                >
                  Agenda Mendatang
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {upcoming.total > 0
                    ? `${upcoming.total} agenda yang akan datang.`
                    : "Belum ada agenda mendatang."}
                </p>
              </div>
            </div>

            {!featured ? (
              <PublicEmptyState
                icon={FiCalendar}
                title="Belum ada agenda mendatang"
                description="Agenda berikutnya akan ditampilkan setelah dipublikasikan."
              />
            ) : (
              <div className="mt-7">
                <article className="group overflow-hidden rounded-[2rem] border border-border/70 bg-background lg:grid lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)]">
                  <Link href={`/agenda/${featured.slug}`} className="block">
                    <GoogleDriveImage
                      url={featured.coverImageUrl}
                      alt={`Cover ${featured.title}`}
                      className="h-full rounded-none border-0"
                      eager
                    />
                  </Link>

                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="rounded-full bg-primary/10 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.14em] text-primary uppercase">
                        Agenda Terdekat
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {dateFormatter.format(featured.startsAt)}
                      </p>
                    </div>

                    <h3 className="mt-5 max-w-3xl font-heading text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
                      <Link
                        href={`/agenda/${featured.slug}`}
                        className="transition-colors group-hover:text-primary"
                      >
                        {featured.title}
                      </Link>
                    </h3>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                      {featured.excerpt}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground">
                      <p className="flex items-start gap-3">
                        <FiClock
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-primary"
                        />

                        {formatAgendaTimeRange(featured.startsAt, featured.endsAt)}
                      </p>

                      {featured.location ? (
                        <p className="flex items-start gap-3">
                          <FiMapPin
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0 text-primary"
                          />

                          {featured.location}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <Link
                        href={`/agenda/${featured.slug}`}
                        className="group/link inline-flex items-center gap-2 text-sm font-semibold text-primary"
                      >
                        Detail Agenda
                        <FiArrowRight
                          aria-hidden="true"
                          className="size-4 transition-transform group-hover/link:translate-x-1 motion-reduce:transition-none"
                        />
                      </Link>

                      {featured.googleMapsUrl ? (
                        <a
                          href={featured.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                          Google Maps
                          <FiExternalLink aria-hidden="true" className="size-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>

                {otherUpcoming.length > 0 ? (
                  <div className="mt-10">
                    <div className="mb-5 flex items-center gap-4">
                      <p className="shrink-0 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Berikutnya
                      </p>

                      <div aria-hidden="true" className="h-px flex-1 bg-border/70" />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {otherUpcoming.map((item) => (
                        <article
                          key={item.id}
                          className="group flex h-full flex-col rounded-2xl border border-border/70 bg-background p-5 transition-[border-color,box-shadow] hover:border-primary/30 hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-heading text-3xl leading-none font-semibold tracking-tight">
                                {dayFormatter.format(item.startsAt)}
                              </p>

                              <p className="mt-1 text-[0.68rem] font-semibold tracking-[0.12em] text-primary uppercase">
                                {shortMonthFormatter.format(item.startsAt)}
                              </p>
                            </div>

                            <p className="text-right text-xs leading-5 text-muted-foreground">
                              {formatAgendaTimeRange(item.startsAt, item.endsAt)}
                            </p>
                          </div>

                          <h3 className="mt-5 font-heading text-xl leading-snug font-medium transition-colors group-hover:text-primary">
                            <Link href={`/agenda/${item.slug}`}>{item.title}</Link>
                          </h3>

                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {item.excerpt}
                          </p>

                          {item.location ? (
                            <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                              <FiMapPin
                                aria-hidden="true"
                                className="mt-1 size-3.5 shrink-0 text-primary"
                              />

                              {item.location}
                            </p>
                          ) : null}

                          <Link
                            href={`/agenda/${item.slug}`}
                            className="group/link mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary"
                          >
                            Detail Agenda
                            <FiArrowRight
                              aria-hidden="true"
                              className="size-3.5 transition-transform group-hover/link:translate-x-1 motion-reduce:transition-none"
                            />
                          </Link>
                        </article>
                      ))}
                    </div>

                    {upcoming.total > upcoming.items.length ? (
                      <p className="mt-5 text-sm text-muted-foreground">
                        Menampilkan {upcoming.items.length} agenda terdekat dari {upcoming.total}{" "}
                        agenda mendatang.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
          </section>

          <section aria-labelledby="arsip-agenda" className="mt-16 border-t border-border/70 pt-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                Kegiatan Sebelumnya
              </p>

              <h2
                id="arsip-agenda"
                className="mt-2 font-heading text-3xl font-medium tracking-tight"
              >
                Arsip Agenda
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Cari kegiatan yang telah selesai berdasarkan kata kunci, tahun, atau bulan.
              </p>
            </div>

            {availableYears.length > 0 && selectedYear ? (
              <>
                <form
                  action="/agenda"
                  method="get"
                  role="search"
                  className="mt-7 grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]"
                >
                  <div className="relative">
                    <FiSearch
                      aria-hidden="true"
                      className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                    />

                    <label htmlFor="agenda-search" className="sr-only">
                      Cari arsip agenda
                    </label>

                    <input
                      id="agenda-search"
                      type="search"
                      name="q"
                      defaultValue={searchQuery}
                      maxLength={80}
                      placeholder="Cari judul, deskripsi, atau lokasi..."
                      className="h-11 w-full rounded-xl border border-input bg-background pr-4 pl-10 text-sm transition-shadow outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <label htmlFor="agenda-year" className="sr-only">
                    Tahun agenda
                  </label>

                  <select
                    id="agenda-year"
                    name="tahun"
                    defaultValue={String(selectedYear)}
                    className="h-11 min-w-28 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="agenda-month" className="sr-only">
                    Bulan agenda
                  </label>

                  <select
                    id="agenda-month"
                    name="bulan"
                    defaultValue={selectedMonth?.toString() ?? ""}
                    className="h-11 min-w-40 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Semua Bulan</option>

                    {monthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <FiSearch aria-hidden="true" className="size-4" />
                    Cari
                  </button>
                </form>

                {searchQuery || selectedMonth ? (
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    {selectedMonth ? (
                      <Link
                        href={
                          searchQuery
                            ? `/agenda?tahun=${selectedYear}&q=${encodeURIComponent(searchQuery)}`
                            : `/agenda?tahun=${selectedYear}`
                        }
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                      >
                        Semua Bulan
                      </Link>
                    ) : null}

                    {searchQuery ? (
                      <Link
                        href="/agenda"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                      >
                        <FiX aria-hidden="true" className="size-4" />
                        Reset Pencarian
                      </Link>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-8 flex items-center justify-between gap-4 border-b border-border/70 pb-4">
                  <p className="text-sm text-muted-foreground">
                    {archive.length} agenda ditemukan
                    {searchQuery ? ` untuk “${searchQuery}”` : ""}.
                  </p>
                </div>

                {archiveGroups.length > 0 ? (
                  <div>
                    {archiveGroups.map((group) => {
                      const monthDate = new Date(Date.UTC(selectedYear, group.month - 1, 15, 12))

                      return (
                        <section
                          key={`${selectedYear}-${group.month}`}
                          className="grid border-b border-border/70 lg:grid-cols-[12rem_minmax(0,1fr)]"
                        >
                          <header className="py-6 lg:border-r lg:border-border/70 lg:py-8 lg:pr-8">
                            <p className="font-heading text-xl font-medium">
                              {monthFormatter.format(monthDate)}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {group.items.length} agenda
                            </p>
                          </header>

                          <div className="lg:pl-8">
                            {group.items.map((item) => (
                              <Link
                                key={item.id}
                                href={`/agenda/${item.slug}`}
                                className="group grid gap-4 border-t border-border/60 py-5 first:border-t-0 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center lg:py-6"
                              >
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    {shortDateFormatter.format(item.startsAt)}
                                  </p>

                                  <p className="mt-1 text-xs font-medium text-primary">
                                    {formatAgendaTimeRange(item.startsAt, item.endsAt)}
                                  </p>
                                </div>

                                <div className="min-w-0">
                                  <h3 className="font-heading text-lg leading-snug font-medium transition-colors group-hover:text-primary sm:text-xl">
                                    {item.title}
                                  </h3>

                                  {item.location ? (
                                    <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
                                      {item.location}
                                    </p>
                                  ) : null}
                                </div>

                                <FiArrowRight
                                  aria-hidden="true"
                                  className="hidden size-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary motion-reduce:transition-none sm:block"
                                />
                              </Link>
                            ))}
                          </div>
                        </section>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-8">
                    <p className="text-sm leading-6 text-muted-foreground">
                      Tidak ada arsip agenda yang cocok dengan filter tersebut.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-7 rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-8">
                <p className="text-sm leading-6 text-muted-foreground">
                  Belum ada agenda lama yang tersedia sebagai arsip.
                </p>
              </div>
            )}
          </section>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicAgendaPage
