import Link from "next/link"
import { FiArrowRight, FiExternalLink, FiFileText, FiInbox } from "react-icons/fi"

import { PublicEmptyState } from "@/components/public/public-empty-state"
import { PublicPageHeader } from "@/components/public/public-page-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import {
  getLatestPublishedPawartos,
  getPublishedPawartosArchive,
  getPublishedPawartosYears,
} from "@/features/public-site/queries/get-public-content"

type PublicPawartosPageProps = {
  searchParams: Promise<{
    tahun?: string | string[]
    bulan?: string | string[]
  }>
}

type PawartosArchiveItem = Awaited<ReturnType<typeof getPublishedPawartosArchive>>[number]

async function generateMetadata() {
  return createPublicPageMetadata({
    title: "Pawartos",
    description: "Pawartos dan informasi mingguan jemaat GKJ Slogohimo.",
    pathname: "/pawartos",
  })
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

const monthFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  timeZone: "UTC",
})

const shortMonthFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  timeZone: "UTC",
})

function createMonthOptions(year: number) {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(year, index, 1))

    return {
      value: index + 1,
      label: monthFormatter.format(date),
    }
  })
}

function groupArchiveByMonth(items: PawartosArchiveItem[]) {
  const groups = new Map<number, PawartosArchiveItem[]>()

  for (const item of items) {
    const month = item.publicationDate.getUTCMonth()
    const existing = groups.get(month)

    if (existing) {
      existing.push(item)
    } else {
      groups.set(month, [item])
    }
  }

  return Array.from(groups.entries()).map(([month, monthItems]) => ({
    month,
    items: monthItems,
  }))
}

async function PublicPawartosPage({ searchParams }: PublicPawartosPageProps) {
  const params = await searchParams

  const [latest, availableYears] = await Promise.all([
    getLatestPublishedPawartos(),
    getPublishedPawartosYears(),
  ])

  if (!latest) {
    return (
      <main>
        <Section>
          <Container>
            <PublicPageHeader
              eyebrow="Informasi Jemaat"
              title="Pawartos"
              description="Pawartos dan informasi mingguan untuk kehidupan serta pelayanan jemaat GKJ Slogohimo."
            />

            <PublicEmptyState
              icon={FiInbox}
              title="Belum ada Pawartos"
              description="Pawartos yang telah dipublikasikan akan ditampilkan di halaman ini."
            />
          </Container>
        </Section>
      </main>
    )
  }

  const requestedYear = typeof params.tahun === "string" ? Number(params.tahun) : null

  const latestYear = latest.publicationDate.getUTCFullYear()

  const selectedYear =
    requestedYear !== null &&
    Number.isInteger(requestedYear) &&
    availableYears.includes(requestedYear)
      ? requestedYear
      : latestYear

  const latestMonth = latest.publicationDate.getUTCMonth() + 1

  const rawMonthParam = typeof params.bulan === "string" ? params.bulan : null

  const requestedMonth =
    rawMonthParam !== null && rawMonthParam !== "" ? Number(rawMonthParam) : null

  const isInitialView = typeof params.tahun !== "string" && rawMonthParam === null

  const selectedMonth = isInitialView
    ? latestMonth
    : requestedMonth !== null &&
        Number.isInteger(requestedMonth) &&
        requestedMonth >= 1 &&
        requestedMonth <= 12
      ? requestedMonth
      : null

  const monthOptions = createMonthOptions(selectedYear)

  const archive = await getPublishedPawartosArchive(selectedYear, selectedMonth)

  const shouldExcludeLatest =
    selectedYear === latestYear && (selectedMonth === null || selectedMonth === latestMonth)

  const archiveItems = shouldExcludeLatest
    ? archive.filter((item) => item.id !== latest.id)
    : archive

  const archiveGroups = groupArchiveByMonth(archiveItems)

  return (
    <main>
      <Section>
        <Container>
          <PublicPageHeader
            eyebrow="Informasi Jemaat"
            title="Pawartos"
            description="Pawartos dan informasi mingguan untuk kehidupan serta pelayanan jemaat GKJ Slogohimo."
          />

          <section
            aria-labelledby="pawartos-terbaru"
            className="mt-10 overflow-hidden rounded-[2rem] bg-primary text-primary-foreground"
          >
            <div className="grid lg:grid-cols-[14rem_minmax(0,1fr)]">
              <div className="border-b border-primary-foreground/15 bg-black/10 p-6 lg:border-r lg:border-b-0 lg:p-8">
                <div className="flex items-center gap-2 text-primary-foreground/65">
                  <FiFileText aria-hidden="true" className="size-4" />

                  <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase">
                    Edisi Terbaru
                  </p>
                </div>

                <p className="mt-8 font-heading text-6xl leading-none font-semibold tracking-tight">
                  {latest.publicationDate.getUTCDate()}
                </p>

                <p className="mt-3 font-heading text-xl font-medium">
                  {monthFormatter.format(latest.publicationDate)}
                </p>

                <p className="mt-1 text-sm text-primary-foreground/60">{latestYear}</p>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-xs font-semibold tracking-[0.16em] text-primary-foreground/60 uppercase">
                  {dateFormatter.format(latest.publicationDate)}
                </p>

                <h2
                  id="pawartos-terbaru"
                  className="mt-4 max-w-3xl font-heading text-3xl leading-tight font-medium tracking-tight sm:text-4xl"
                >
                  {latest.title}
                </h2>

                {latest.description ? (
                  <p className="mt-5 max-w-3xl text-sm leading-7 text-primary-foreground/70 sm:text-base">
                    {latest.description}
                  </p>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`/pawartos/${latest.slug}`}
                    className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-foreground px-4 text-sm font-semibold text-primary transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
                  >
                    Baca Pawartos
                    <FiArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    />
                  </Link>

                  <a
                    href={latest.googleDriveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-primary-foreground/25 px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
                  >
                    Buka PDF
                    <FiExternalLink aria-hidden="true" className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="arsip-pawartos" className="mt-14">
            <div className="flex flex-col gap-5 border-b border-border/70 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                  Arsip Mingguan
                </p>

                <h2
                  id="arsip-pawartos"
                  className="mt-3 font-heading text-3xl font-medium tracking-tight"
                >
                  Arsip Pawartos
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedMonth
                    ? `${archiveItems.length} edisi pada ${
                        monthOptions.find((option) => option.value === selectedMonth)?.label
                      } ${selectedYear}`
                    : `${archiveItems.length} edisi pada tahun ${selectedYear}`}
                  {shouldExcludeLatest ? ", tidak termasuk edisi terbaru." : "."}
                </p>
              </div>

              <form
                action="/pawartos"
                method="get"
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
              >
                <label htmlFor="pawartos-year" className="sr-only">
                  Pilih tahun arsip Pawartos
                </label>

                <select
                  id="pawartos-year"
                  name="tahun"
                  defaultValue={String(selectedYear)}
                  className="h-10 min-w-32 rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-shadow outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <label htmlFor="pawartos-month" className="sr-only">
                  Pilih bulan arsip Pawartos
                </label>

                <select
                  id="pawartos-month"
                  name="bulan"
                  defaultValue={selectedMonth?.toString() ?? ""}
                  className="h-10 min-w-40 rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-shadow outline-none focus:ring-2 focus:ring-primary/30"
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
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Tampilkan
                </button>

                {selectedMonth ? (
                  <Link
                    href={`/pawartos?tahun=${selectedYear}`}
                    className="inline-flex h-10 items-center justify-center px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Semua Bulan
                  </Link>
                ) : null}
              </form>
            </div>

            {archiveGroups.length > 0 ? (
              <div>
                {archiveGroups.map((group) => {
                  const monthDate = new Date(Date.UTC(selectedYear, group.month, 1))

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
                          {group.items.length} edisi
                        </p>
                      </header>

                      <div className="lg:pl-8">
                        {group.items.map((item) => (
                          <Link
                            key={item.id}
                            href={`/pawartos/${item.slug}`}
                            className="group grid gap-4 border-t border-border/60 py-5 first:border-t-0 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center lg:py-6"
                          >
                            <div className="flex items-baseline gap-2 sm:block">
                              <span className="font-heading text-2xl font-semibold tracking-tight">
                                {item.publicationDate.getUTCDate()}
                              </span>

                              <span className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase sm:mt-1 sm:block">
                                {shortMonthFormatter.format(item.publicationDate)}
                              </span>
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-heading text-lg leading-snug font-medium transition-colors group-hover:text-primary sm:text-xl">
                                {item.title}
                              </h3>

                              {item.description ? (
                                <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
                                  {item.description}
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
                  Belum ada edisi Pawartos lainnya pada tahun {selectedYear}.
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
export default PublicPawartosPage
