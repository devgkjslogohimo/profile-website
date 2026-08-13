import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { PublicBackLink } from "@/components/public/public-back-link"
import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { PublicRichText } from "@/components/public/public-rich-text"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { getPublishedNewsBySlug } from "@/features/public-site/queries/get-public-content"
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

async function generateMetadata({ params }: PublicNewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const news = await getPublishedNewsBySlug(slug)

  if (!news) {
    return {
      title: "Berita Tidak Ditemukan",
    }
  }

  return {
    title: news.title,
    description: news.excerpt,
  }
}

async function PublicNewsDetailPage({ params }: PublicNewsDetailPageProps) {
  const { slug } = await params
  const news = await getPublishedNewsBySlug(slug)

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

          <article className="mx-auto mt-8 max-w-4xl">
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

            <div className="mt-8">
              <GoogleDriveImage
                url={news.coverImageUrl}
                alt={`Cover ${news.title}`}
                className="max-w-full"
                eager
              />
            </div>

            <div className="mt-10 max-w-3xl">
              <PublicRichText content={news.content} />
            </div>

            {news.images.length > 0 ? (
              <section className="mt-14 border-t pt-10">
                <h2 className="font-heading text-2xl font-semibold tracking-tight">Dokumentasi</h2>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {news.images.map((image) => (
                    <figure key={image.id}>
                      <GoogleDriveImage
                        url={image.googleDriveUrl}
                        alt={image.altText || news.title}
                      />

                      {image.caption ? (
                        <figcaption className="mt-2 text-sm leading-6 text-muted-foreground">
                          {image.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicNewsDetailPage
