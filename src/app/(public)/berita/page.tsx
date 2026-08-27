import Link from "next/link"
import { FiArrowLeft, FiArrowRight, FiInbox, FiSearch, FiX } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { PublicEmptyState } from "@/components/public/public-empty-state"
import { PublicPageHeader } from "@/components/public/public-page-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublishedNewsPage } from "@/features/public-site/queries/get-public-content"

type PublicNewsPageProps = {
  searchParams: Promise<{
    page?: string | string[]
    q?: string | string[]
  }>
}

async function generateMetadata() {
  return createPublicPageMetadata({
    title: "Berita",
    description: "Berita terbaru GKJ Slogohimo.",
    pathname: "/berita",
  })
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

function getNewsPageHref(page: number, query: string) {
  const params = new URLSearchParams()

  if (query) {
    params.set("q", query)
  }

  if (page > 1) {
    params.set("page", String(page))
  }

  const search = params.toString()

  return search ? `/berita?${search}` : "/berita"
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

async function PublicNewsPage({ searchParams }: PublicNewsPageProps) {
  const params = await searchParams

  const rawQuery = typeof params.q === "string" ? params.q : ""

  const searchQuery = rawQuery.trim().slice(0, 80)

  const rawPage = typeof params.page === "string" ? Number(params.page) : 1

  const requestedPage = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1

  const result = await getPublishedNewsPage(requestedPage, searchQuery)

  const isSearching = Boolean(result.query)

  const featured = !isSearching && result.page === 1 ? (result.items[0] ?? null) : null

  const remainingNews = featured ? result.items.slice(1) : result.items

  const pageNumbers = createPageNumbers(result.page, result.totalPages)

  return (
    <main>
      <Section spacing="page">
        <Container>
          <PublicPageHeader
            eyebrow="Kabar Gereja"
            title="Berita"
            description="Berita dan kabar terbaru dari kehidupan serta pelayanan GKJ Slogohimo."
          />

          <div className="mt-10">
            <form
              action="/berita"
              method="get"
              role="search"
              className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:p-5"
            >
              <div className="relative min-w-0 flex-1">
                <FiSearch
                  aria-hidden="true"
                  className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                />

                <label htmlFor="news-search" className="sr-only">
                  Cari berita
                </label>

                <input
                  id="news-search"
                  type="search"
                  name="q"
                  defaultValue={result.query}
                  maxLength={80}
                  placeholder="Cari judul atau isi ringkas berita..."
                  className="h-11 w-full rounded-xl border border-input bg-background pr-4 pl-10 text-sm transition-shadow outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <FiSearch aria-hidden="true" className="size-4" />
                Cari Berita
              </button>

              {isSearching ? (
                <Link
                  href="/berita"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <FiX aria-hidden="true" className="size-4" />
                  Reset
                </Link>
              ) : null}
            </form>
          </div>

          {result.total === 0 ? (
            <PublicEmptyState
              icon={isSearching ? FiSearch : FiInbox}
              title={isSearching ? "Berita tidak ditemukan" : "Belum ada berita"}
              description={
                isSearching
                  ? `Tidak ditemukan berita yang cocok dengan “${result.query}”. Coba gunakan kata kunci lainnya.`
                  : "Berita yang telah dipublikasikan akan ditampilkan di halaman ini."
              }
            />
          ) : (
            <div className="mt-10">
              {featured ? (
                <article className="group overflow-hidden rounded-[2rem] border border-border/70 bg-background lg:grid lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)]">
                  <Link href={`/berita/${featured.slug}`} className="block">
                    <GoogleDriveImage
                      url={featured.coverImageUrl}
                      alt={`Cover ${featured.title}`}
                      className="h-full rounded-none border-0"
                      eager
                      fetchPriority="high"
                      sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), 560px"
                    />
                  </Link>

                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12">
                    <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      Berita Terbaru
                    </p>

                    {featured.publishedAt ? (
                      <p className="mt-4 text-sm text-muted-foreground">
                        {dateFormatter.format(featured.publishedAt)}
                      </p>
                    ) : null}

                    <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
                      <Link
                        href={`/berita/${featured.slug}`}
                        className="transition-colors group-hover:text-primary"
                      >
                        {featured.title}
                      </Link>
                    </h2>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                      {featured.excerpt}
                    </p>

                    <Link
                      href={`/berita/${featured.slug}`}
                      className="group/link mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary"
                    >
                      Baca Berita
                      <FiArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover/link:translate-x-1 motion-reduce:transition-none"
                      />
                    </Link>
                  </div>
                </article>
              ) : null}

              {remainingNews.length > 0 ? (
                <section aria-labelledby="berita-lainnya" className={featured ? "mt-14" : ""}>
                  <div className="flex items-end justify-between gap-6 border-b border-border/70 pb-5">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                        Kabar Terkini
                      </p>

                      <h2
                        id="berita-lainnya"
                        className="mt-2 font-heading text-3xl font-medium tracking-tight"
                      >
                        {isSearching
                          ? `Hasil Pencarian “${result.query}”`
                          : result.page === 1
                            ? "Berita Lainnya"
                            : "Daftar Berita"}
                      </h2>
                    </div>

                    <p className="hidden text-sm text-muted-foreground sm:block">
                      {result.total} berita
                    </p>
                  </div>

                  <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {remainingNews.map((item, index) => (
                      <article
                        key={item.id}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-background transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
                      >
                        <Link href={`/berita/${item.slug}`}>
                          <GoogleDriveImage
                            url={item.coverImageUrl}
                            alt={`Cover ${item.title}`}
                            className="rounded-none border-0"
                            eager={!featured && index === 0}
                            sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1023px) calc(50vw - 2.5rem), 400px"
                          />
                        </Link>

                        <div className="flex flex-1 flex-col p-6">
                          {item.publishedAt ? (
                            <p className="text-xs text-muted-foreground">
                              {dateFormatter.format(item.publishedAt)}
                            </p>
                          ) : null}

                          <h3 className="mt-3 font-heading text-xl leading-snug font-medium">
                            <Link
                              href={`/berita/${item.slug}`}
                              className="transition-colors group-hover:text-primary"
                            >
                              {item.title}
                            </Link>
                          </h3>

                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                            {item.excerpt}
                          </p>

                          <Link
                            href={`/berita/${item.slug}`}
                            className="group/link mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary"
                          >
                            Baca Selengkapnya
                            <FiArrowRight
                              aria-hidden="true"
                              className="size-3.5 transition-transform group-hover/link:translate-x-1 motion-reduce:transition-none"
                            />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {result.totalPages > 1 ? (
                <nav
                  aria-label="Pagination berita"
                  className="mt-12 flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    {result.page > 1 ? (
                      <Link
                        href={getNewsPageHref(result.page - 1, result.query)}
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
                          href={getNewsPageHref(pageNumber, result.query)}
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
                        href={getNewsPageHref(result.page + 1, result.query)}
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
export default PublicNewsPage
