import Link from "next/link"
import { notFound } from "next/navigation"
import { FiArrowLeft, FiArrowRight, FiExternalLink, FiFileText } from "react-icons/fi"

import { PublicBackLink } from "@/components/public/public-back-link"
import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import {
  getPublishedPawartosBySlug,
  getPublishedPawartosNavigationBySlug,
  getRecentPublishedPawartos,
} from "@/features/public-site/queries/get-public-content"
import { getGoogleDrivePdfPreviewUrl } from "@/lib/google-drive"

type PublicPawartosDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

const shortMonthFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  timeZone: "UTC",
})

async function generateMetadata({ params }: PublicPawartosDetailPageProps) {
  const { slug } = await params

  const pawartos = await getPublishedPawartosBySlug(slug)

  if (!pawartos) {
    return {
      title: "Pawartos Tidak Ditemukan",
    }
  }

  const description =
    pawartos.description ??
    `Pawartos GKJ Slogohimo tanggal ${dateFormatter.format(pawartos.publicationDate)}.`

  return createPublicPageMetadata({
    title: pawartos.title,
    description,
    pathname: `/pawartos/${pawartos.slug}`,
  })
}

async function PublicPawartosDetailPage({ params }: PublicPawartosDetailPageProps) {
  const { slug } = await params

  const pawartos = await getPublishedPawartosBySlug(slug)

  if (!pawartos) {
    notFound()
  }

  const [navigation, recentPawartos] = await Promise.all([
    getPublishedPawartosNavigationBySlug(slug),
    getRecentPublishedPawartos(slug),
  ])

  const previewUrl = getGoogleDrivePdfPreviewUrl(pawartos.googleDriveUrl)

  return (
    <main>
      <Section>
        <Container>
          <PublicBackLink href="/pawartos" label="Kembali ke Pawartos" />

          <article className="mt-8">
            <PublicDetailHeader
              eyebrow="Pawartos"
              title={pawartos.title}
              description={pawartos.description}
              meta={<span>{dateFormatter.format(pawartos.publicationDate)}</span>}
            />

            <div className="mt-8 grid gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5">
                  <div className="mr-auto flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FiFileText aria-hidden="true" className="size-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground">Dokumen Pawartos</p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Buka dokumen lengkap melalui Google Drive.
                      </p>
                    </div>
                  </div>

                  <a
                    href={pawartos.googleDriveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    Buka PDF
                    <FiExternalLink aria-hidden="true" className="size-4" />
                  </a>
                </div>

                {previewUrl ? (
                  <section aria-labelledby="preview-pawartos" className="mt-8">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h2 id="preview-pawartos" className="font-heading text-xl font-medium">
                        Preview Pawartos
                      </h2>

                      <p className="hidden text-xs text-muted-foreground sm:block">
                        Gunakan tombol PDF jika preview sulit dibuka.
                      </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/20">
                      <iframe
                        src={previewUrl}
                        title={pawartos.title}
                        loading="lazy"
                        className="h-[72vh] min-h-128 w-full"
                      />
                    </div>
                  </section>
                ) : null}
              </div>

              {recentPawartos.length > 0 ? (
                <aside
                  aria-labelledby="pawartos-lainnya"
                  className="lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:self-start"
                >
                  <div className="border-t border-border/70 pt-6 lg:rounded-2xl lg:border lg:p-6">
                    <div className="border-b border-border/70 pb-5">
                      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                        Edisi Lain
                      </p>

                      <h2
                        id="pawartos-lainnya"
                        className="mt-2 font-heading text-2xl font-medium tracking-tight"
                      >
                        Pawartos Lainnya
                      </h2>

                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        Edisi terbaru lainnya yang dapat Anda baca.
                      </p>
                    </div>

                    <div>
                      {recentPawartos.map((item) => (
                        <Link
                          key={item.id}
                          href={`/pawartos/${item.slug}`}
                          className="group grid grid-cols-[3.25rem_minmax(0,1fr)] gap-3 border-b border-border/60 py-5"
                        >
                          <div>
                            <p className="font-heading text-2xl leading-none font-semibold tracking-tight text-foreground">
                              {item.publicationDate.getUTCDate()}
                            </p>

                            <p className="mt-1 text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                              {shortMonthFormatter.format(item.publicationDate)}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">
                              {dateFormatter.format(item.publicationDate)}
                            </p>

                            <h3 className="mt-1.5 line-clamp-3 font-heading text-base leading-snug font-medium transition-colors group-hover:text-primary">
                              {item.title}
                            </h3>

                            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                              Baca
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
                      href="/pawartos"
                      className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      Semua Pawartos
                      <FiArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </Link>
                  </div>
                </aside>
              ) : null}

              {navigation?.previous || navigation?.next ? (
                <nav
                  aria-label="Navigasi edisi Pawartos"
                  className="grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-2 lg:col-start-1"
                >
                  {navigation.previous ? (
                    <Link
                      href={`/pawartos/${navigation.previous.slug}`}
                      className="group rounded-2xl border border-border/70 p-5 transition-colors hover:border-primary/30 hover:bg-muted/30"
                    >
                      <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                        <FiArrowLeft
                          aria-hidden="true"
                          className="size-3.5 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none"
                        />
                        Edisi Sebelumnya
                      </p>

                      <p className="mt-3 text-xs text-muted-foreground">
                        {dateFormatter.format(navigation.previous.publicationDate)}
                      </p>

                      <p className="mt-1 font-heading text-lg leading-snug font-medium transition-colors group-hover:text-primary">
                        {navigation.previous.title}
                      </p>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {navigation.next ? (
                    <Link
                      href={`/pawartos/${navigation.next.slug}`}
                      className="group rounded-2xl border border-border/70 p-5 transition-colors hover:border-primary/30 hover:bg-muted/30 sm:text-right"
                    >
                      <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase sm:justify-end">
                        Edisi Berikutnya
                        <FiArrowRight
                          aria-hidden="true"
                          className="size-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                        />
                      </p>

                      <p className="mt-3 text-xs text-muted-foreground">
                        {dateFormatter.format(navigation.next.publicationDate)}
                      </p>

                      <p className="mt-1 font-heading text-lg leading-snug font-medium transition-colors group-hover:text-primary">
                        {navigation.next.title}
                      </p>
                    </Link>
                  ) : null}
                </nav>
              ) : null}
            </div>
          </article>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicPawartosDetailPage
