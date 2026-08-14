import Link from "next/link"
import { notFound } from "next/navigation"
import { FiArrowRight } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { PublicBackLink } from "@/components/public/public-back-link"
import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { PublicRichText } from "@/components/public/public-rich-text"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { NewsPhotoLightbox } from "@/features/public-site/components/news-photo-lightbox"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import {
  getPublishedNewsBySlug,
  getRecentPublishedNews,
} from "@/features/public-site/queries/get-public-content"
import { isRichTextContent } from "@/lib/rich-text"

type PublicNewsDetailPageProps = {
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

async function generateMetadata({ params }: PublicNewsDetailPageProps) {
  const { slug } = await params

  const news = await getPublishedNewsBySlug(slug)

  if (!news) {
    return {
      title: "Berita Tidak Ditemukan",
    }
  }

  return createPublicPageMetadata({
    title: news.title,
    description: news.excerpt,
    pathname: `/berita/${news.slug}`,
  })
}

async function PublicNewsDetailPage({ params }: PublicNewsDetailPageProps) {
  const { slug } = await params

  const [news, recentNews] = await Promise.all([
    getPublishedNewsBySlug(slug),
    getRecentPublishedNews(slug),
  ])

  if (!news) {
    notFound()
  }

  if (!isRichTextContent(news.content)) {
    throw new Error(`Invalid rich text content for news ${news.id}`)
  }

  return (
    <main>
      <Section>
        <Container>
          <PublicBackLink href="/berita" label="Kembali ke Berita" />

          <article className="mt-8">
            <PublicDetailHeader
              eyebrow="Berita"
              title={news.title}
              description={news.excerpt}
              meta={
                <>
                  {news.publishedAt ? <span>{dateFormatter.format(news.publishedAt)}</span> : null}

                  <span>{news.author.name}</span>
                </>
              }
            />

            <div className="mt-8 grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="min-w-0">
                <GoogleDriveImage
                  url={news.coverImageUrl}
                  alt={`Cover ${news.title}`}
                  className="max-w-full"
                  eager
                />

                <div className="mt-10 max-w-3xl">
                  <PublicRichText content={news.content} />
                </div>

                {news.images.length > 0 ? (
                  <section
                    aria-labelledby="news-documentation"
                    className="mt-14 border-t border-border/70 pt-10"
                  >
                    <div className="mb-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                          Galeri Berita
                        </p>

                        <h2
                          id="news-documentation"
                          className="mt-2 font-heading text-2xl font-semibold tracking-tight"
                        >
                          Dokumentasi
                        </h2>
                      </div>

                      <p className="hidden text-sm text-muted-foreground sm:block">
                        {news.images.length} foto
                      </p>
                    </div>

                    <NewsPhotoLightbox newsTitle={news.title} images={news.images} />
                  </section>
                ) : null}
              </div>

              {recentNews.length > 0 ? (
                <aside
                  aria-labelledby="berita-terbaru"
                  className="lg:sticky lg:top-24 lg:self-start"
                >
                  <div className="border-t border-border/70 pt-6 lg:rounded-2xl lg:border lg:p-6">
                    <div className="border-b border-border/70 pb-5">
                      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                        Kabar Terkini
                      </p>

                      <h2
                        id="berita-terbaru"
                        className="mt-2 font-heading text-2xl font-medium tracking-tight"
                      >
                        Berita Terbaru
                      </h2>

                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        Kabar terbaru lainnya dari GKJ Slogohimo.
                      </p>
                    </div>

                    <div>
                      {recentNews.map((item) => (
                        <Link
                          key={item.id}
                          href={`/berita/${item.slug}`}
                          className="group block border-b border-border/60 py-5"
                        >
                          {item.publishedAt ? (
                            <p className="text-xs text-muted-foreground">
                              {dateFormatter.format(item.publishedAt)}
                            </p>
                          ) : null}

                          <h3 className="mt-2 line-clamp-3 font-heading text-base leading-snug font-medium transition-colors group-hover:text-primary">
                            {item.title}
                          </h3>

                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                            {item.excerpt}
                          </p>

                          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                            Baca
                            <FiArrowRight
                              aria-hidden="true"
                              className="size-3 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                            />
                          </span>
                        </Link>
                      ))}
                    </div>

                    <Link
                      href="/berita"
                      className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      Semua Berita
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
export default PublicNewsDetailPage
