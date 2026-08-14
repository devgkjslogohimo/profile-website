import Link from "next/link"
import { FiArrowLeft, FiArrowRight, FiBell, FiInbox, FiSearch, FiX } from "react-icons/fi"

import { PublicEmptyState } from "@/components/public/public-empty-state"
import { PublicPageHeader } from "@/components/public/public-page-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublishedAnnouncementsPage } from "@/features/public-site/queries/get-public-content"

type PublicAnnouncementsPageProps = {
  searchParams: Promise<{
    page?: string | string[]
    q?: string | string[]
  }>
}

async function generateMetadata() {
  return createPublicPageMetadata({
    title: "Pengumuman",
    description: "Pengumuman resmi GKJ Slogohimo.",
    pathname: "/pengumuman",
  })
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

const shortMonthFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  timeZone: "Asia/Jakarta",
})

const featuredDayFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  timeZone: "Asia/Jakarta",
})

const featuredYearFormatter = new Intl.DateTimeFormat("id-ID", {
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

function getAnnouncementPageHref(page: number, query: string) {
  const params = new URLSearchParams()

  if (query) {
    params.set("q", query)
  }

  if (page > 1) {
    params.set("page", String(page))
  }

  const search = params.toString()

  return search ? `/pengumuman?${search}` : "/pengumuman"
}

function createPageNumbers(currentPage: number, totalPages: number) {
  const maximumVisiblePages = 5

  let start = Math.max(1, currentPage - Math.floor(maximumVisiblePages / 2))

  const end = Math.min(totalPages, start + maximumVisiblePages - 1)

  start = Math.max(1, end - maximumVisiblePages + 1)

  return Array.from(
    {
      length: end - start + 1,
    },
    (_, index) => start + index
  )
}

async function PublicAnnouncementsPage({ searchParams }: PublicAnnouncementsPageProps) {
  const params = await searchParams

  const rawQuery = typeof params.q === "string" ? params.q : ""

  const searchQuery = rawQuery.trim().slice(0, 80)

  const rawPage = typeof params.page === "string" ? Number(params.page) : 1

  const requestedPage = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1

  const result = await getPublishedAnnouncementsPage(requestedPage, searchQuery)

  const isSearching = Boolean(result.query)

  const featured = !isSearching && result.page === 1 ? (result.items[0] ?? null) : null

  const remainingAnnouncements = featured ? result.items.slice(1) : result.items

  const pageNumbers = createPageNumbers(result.page, result.totalPages)

  return (
    <main>
      <Section>
        <Container>
          <PublicPageHeader
            eyebrow="Informasi Resmi"
            title="Pengumuman"
            description="Informasi dan pengumuman resmi terbaru dari GKJ Slogohimo."
          />

          <form
            action="/pengumuman"
            method="get"
            role="search"
            className="mt-10 flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:p-5"
          >
            <div className="relative min-w-0 flex-1">
              <FiSearch
                aria-hidden="true"
                className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              />

              <label htmlFor="announcement-search" className="sr-only">
                Cari pengumuman
              </label>

              <input
                id="announcement-search"
                type="search"
                name="q"
                defaultValue={result.query}
                maxLength={80}
                placeholder="Cari judul pengumuman..."
                className="h-11 w-full rounded-xl border border-input bg-background pr-4 pl-10 text-sm transition-shadow outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <FiSearch aria-hidden="true" className="size-4" />
              Cari
            </button>

            {isSearching ? (
              <Link
                href="/pengumuman"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FiX aria-hidden="true" className="size-4" />
                Reset
              </Link>
            ) : null}
          </form>

          {result.total === 0 ? (
            <PublicEmptyState
              icon={isSearching ? FiSearch : FiInbox}
              title={isSearching ? "Pengumuman tidak ditemukan" : "Belum ada pengumuman"}
              description={
                isSearching
                  ? `Tidak ditemukan pengumuman yang cocok dengan “${result.query}”. Coba gunakan kata kunci lainnya.`
                  : "Pengumuman yang telah dipublikasikan akan ditampilkan di halaman ini."
              }
            />
          ) : (
            <div className="mt-10">
              {featured ? (
                <article className="overflow-hidden rounded-[2rem] bg-primary text-primary-foreground">
                  <div className="grid lg:grid-cols-[13rem_minmax(0,1fr)]">
                    <div className="border-b border-primary-foreground/15 bg-black/10 p-6 lg:border-r lg:border-b-0 lg:p-8">
                      <div className="flex items-center gap-2 text-primary-foreground/65">
                        <FiBell aria-hidden="true" className="size-4" />

                        <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase">
                          Terbaru
                        </p>
                      </div>

                      {featured.publishedAt ? (
                        <>
                          <p className="mt-8 font-heading text-6xl leading-none font-semibold tracking-tight">
                            {featuredDayFormatter.format(featured.publishedAt)}
                          </p>

                          <p className="mt-3 font-heading text-lg font-medium capitalize">
                            {shortMonthFormatter.format(featured.publishedAt)}
                          </p>

                          <p className="mt-1 text-sm text-primary-foreground/55">
                            {featuredYearFormatter.format(featured.publishedAt)}
                          </p>
                        </>
                      ) : null}
                    </div>

                    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                      <p className="text-xs font-semibold tracking-[0.16em] text-primary-foreground/60 uppercase">
                        Pengumuman Terbaru
                      </p>

                      {featured.publishedAt ? (
                        <p className="mt-4 text-sm text-primary-foreground/65">
                          {dateFormatter.format(featured.publishedAt)}
                        </p>
                      ) : null}

                      <h2 className="mt-3 max-w-3xl font-heading text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
                        {featured.title}
                      </h2>

                      <Link
                        href={`/pengumuman/${featured.slug}`}
                        className="group mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-foreground"
                      >
                        Baca Pengumuman
                        <FiArrowRight
                          aria-hidden="true"
                          className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              ) : null}

              {remainingAnnouncements.length > 0 ? (
                <section aria-labelledby="announcement-list" className={featured ? "mt-14" : ""}>
                  <div className="flex flex-col gap-3 border-b border-border/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                        Informasi Resmi
                      </p>

                      <h2
                        id="announcement-list"
                        className="mt-2 font-heading text-3xl font-medium tracking-tight"
                      >
                        {isSearching
                          ? `Hasil Pencarian “${result.query}”`
                          : result.page === 1
                            ? "Pengumuman Lainnya"
                            : "Daftar Pengumuman"}
                      </h2>
                    </div>

                    <p className="text-sm text-muted-foreground">{result.total} pengumuman</p>
                  </div>

                  <div>
                    {remainingAnnouncements.map((item) => (
                      <Link
                        key={item.id}
                        href={`/pengumuman/${item.slug}`}
                        className="group grid gap-4 border-b border-border/70 py-5 transition-colors hover:bg-muted/20 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center sm:px-2 lg:py-6"
                      >
                        <div className="flex items-baseline gap-2 sm:block">
                          {item.publishedAt ? (
                            <>
                              <span className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                                {item.publishedAt.getDate()}
                              </span>

                              <span className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase sm:mt-1 sm:block">
                                {shortMonthFormatter.format(item.publishedAt)}
                              </span>
                            </>
                          ) : (
                            <FiBell aria-hidden="true" className="size-5 text-muted-foreground" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-heading text-lg leading-snug font-medium transition-colors group-hover:text-primary sm:text-xl">
                            {item.title}
                          </h3>

                          {item.publishedAt ? (
                            <p className="mt-1.5 text-xs text-muted-foreground">
                              {dateFormatter.format(item.publishedAt)}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                          <span className="sm:hidden">Baca</span>

                          <FiArrowRight
                            aria-hidden="true"
                            className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              {result.totalPages > 1 ? (
                <nav
                  aria-label="Pagination pengumuman"
                  className="mt-10 flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    {result.page > 1 ? (
                      <Link
                        href={getAnnouncementPageHref(result.page - 1, result.query)}
                        className="group inline-flex h-10 items-center gap-2 rounded-lg border border-input px-4 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        <FiArrowLeft
                          aria-hidden="true"
                          className="size-4 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none"
                        />
                        Sebelumnya
                      </Link>
                    ) : (
                      <span />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {pageNumbers.map((pageNumber) => {
                      const active = pageNumber === result.page

                      return (
                        <Link
                          key={pageNumber}
                          href={getAnnouncementPageHref(pageNumber, result.query)}
                          aria-current={active ? "page" : undefined}
                          className={[
                            "flex size-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "border border-input hover:bg-muted",
                          ].join(" ")}
                        >
                          {pageNumber}
                        </Link>
                      )
                    })}
                  </div>

                  <div className="sm:text-right">
                    {result.page < result.totalPages ? (
                      <Link
                        href={getAnnouncementPageHref(result.page + 1, result.query)}
                        className="group inline-flex h-10 items-center gap-2 rounded-lg border border-input px-4 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        Berikutnya
                        <FiArrowRight
                          aria-hidden="true"
                          className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                        />
                      </Link>
                    ) : (
                      <span />
                    )}
                  </div>
                </nav>
              ) : null}
            </div>
          )}
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicAnnouncementsPage
