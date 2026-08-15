import { notFound } from "next/navigation"

import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { PublicRichText } from "@/components/public/public-rich-text"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublishedSitePageBySlug } from "@/features/public-site/queries/get-public-content"
import { isRichTextContent } from "@/lib/rich-text"

type PublicSitePageProps = {
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

async function generateMetadata({ params }: PublicSitePageProps) {
  const { slug } = await params

  const sitePage = await getPublishedSitePageBySlug(slug)

  if (!sitePage) {
    return {
      title: "Halaman Tidak Ditemukan",
    }
  }

  return createPublicPageMetadata({
    title: sitePage.title,
    description: `Informasi ${sitePage.title} dari GKJ Slogohimo.`,
    pathname: `/${sitePage.slug}`,
  })
}

async function PublicSitePage({ params }: PublicSitePageProps) {
  const { slug } = await params

  const sitePage = await getPublishedSitePageBySlug(slug)

  if (!sitePage) {
    notFound()
  }

  if (!isRichTextContent(sitePage.content)) {
    throw new Error(`Invalid rich text content for site page ${sitePage.id}`)
  }

  return (
    <main>
      <Section spacing="page">
        <Container>
          <article className="mx-auto max-w-4xl">
            <PublicDetailHeader
              eyebrow="GKJ Slogohimo"
              title={sitePage.title}
              meta={
                <>
                  {sitePage.publishedAt ? (
                    <span>Dipublikasikan {dateFormatter.format(sitePage.publishedAt)}</span>
                  ) : null}

                  <span>Diperbarui {dateFormatter.format(sitePage.updatedAt)}</span>
                </>
              }
            />

            <div className="mt-10 max-w-3xl">
              <PublicRichText content={sitePage.content} />
            </div>
          </article>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicSitePage
