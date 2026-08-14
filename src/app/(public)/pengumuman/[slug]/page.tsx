import Link from "next/link"
import { notFound } from "next/navigation"
import { FiArrowRight, FiBell } from "react-icons/fi"

import { PublicBackLink } from "@/components/public/public-back-link"
import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { PublicRichText } from "@/components/public/public-rich-text"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import {
  getPublishedAnnouncementBySlug,
  getRecentPublishedAnnouncements,
} from "@/features/public-site/queries/get-public-content"
import { isRichTextContent } from "@/lib/rich-text"

type PublicAnnouncementDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
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

async function generateMetadata({ params }: PublicAnnouncementDetailPageProps) {
  const { slug } = await params

  const announcement = await getPublishedAnnouncementBySlug(slug)

  if (!announcement) {
    return {
      title: "Pengumuman Tidak Ditemukan",
    }
  }

  return createPublicPageMetadata({
    title: announcement.title,
    description: `Pengumuman resmi GKJ Slogohimo: ${announcement.title}.`,
    pathname: `/pengumuman/${announcement.slug}`,
  })
}

async function PublicAnnouncementDetailPage({ params }: PublicAnnouncementDetailPageProps) {
  const { slug } = await params

  const [announcement, recentAnnouncements] = await Promise.all([
    getPublishedAnnouncementBySlug(slug),
    getRecentPublishedAnnouncements(slug),
  ])

  if (!announcement) {
    notFound()
  }

  if (!isRichTextContent(announcement.content)) {
    throw new Error(`Invalid rich text content for announcement ${announcement.id}`)
  }

  return (
    <main>
      <Section>
        <Container>
          <PublicBackLink href="/pengumuman" label="Kembali ke Pengumuman" />

          <article className="mt-8">
            <PublicDetailHeader
              eyebrow="Pengumuman"
              title={announcement.title}
              meta={
                announcement.publishedAt ? (
                  <span>{dateFormatter.format(announcement.publishedAt)}</span>
                ) : undefined
              }
            />

            <div className="mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="min-w-0">
                <div className="rounded-[2rem] border border-border/70 bg-background p-6 sm:p-8 lg:p-10">
                  <div className="mb-8 flex items-center gap-3 border-b border-border/70 pb-6">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FiBell aria-hidden="true" className="size-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                        Informasi Resmi
                      </p>

                      {announcement.publishedAt ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Dipublikasikan {dateFormatter.format(announcement.publishedAt)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="max-w-3xl">
                    <PublicRichText content={announcement.content} />
                  </div>
                </div>
              </div>

              {recentAnnouncements.length > 0 ? (
                <aside
                  aria-labelledby="announcement-sidebar"
                  className="lg:sticky lg:top-24 lg:self-start"
                >
                  <div className="border-t border-border/70 pt-6 lg:rounded-2xl lg:border lg:p-6">
                    <div className="border-b border-border/70 pb-5">
                      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                        Informasi Lain
                      </p>

                      <h2
                        id="announcement-sidebar"
                        className="mt-2 font-heading text-2xl font-medium tracking-tight"
                      >
                        Pengumuman Terbaru
                      </h2>

                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        Informasi resmi lainnya dari GKJ Slogohimo.
                      </p>
                    </div>

                    <div>
                      {recentAnnouncements.map((item) => (
                        <Link
                          key={item.id}
                          href={`/pengumuman/${item.slug}`}
                          className="group grid grid-cols-[3.25rem_minmax(0,1fr)] gap-3 border-b border-border/60 py-5"
                        >
                          <div>
                            {item.publishedAt ? (
                              <>
                                <p className="font-heading text-2xl leading-none font-semibold tracking-tight">
                                  {dayFormatter.format(item.publishedAt)}
                                </p>

                                <p className="mt-1 text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                                  {shortMonthFormatter.format(item.publishedAt)}
                                </p>
                              </>
                            ) : (
                              <FiBell aria-hidden="true" className="size-4 text-muted-foreground" />
                            )}
                          </div>

                          <div className="min-w-0">
                            {item.publishedAt ? (
                              <p className="text-xs text-muted-foreground">
                                {dateFormatter.format(item.publishedAt)}
                              </p>
                            ) : null}

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
                      href="/pengumuman"
                      className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      Semua Pengumuman
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
export default PublicAnnouncementDetailPage
