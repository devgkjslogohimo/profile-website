import { notFound } from "next/navigation"

import { PublicBackLink } from "@/components/public/public-back-link"
import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { PublicRichText } from "@/components/public/public-rich-text"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublishedAnnouncementBySlug } from "@/features/public-site/queries/get-public-content"
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

  const announcement = await getPublishedAnnouncementBySlug(slug)

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

          <article className="mx-auto mt-8 max-w-4xl">
            <PublicDetailHeader
              eyebrow="Pengumuman"
              title={announcement.title}
              meta={
                announcement.publishedAt ? (
                  <span>{dateFormatter.format(announcement.publishedAt)}</span>
                ) : undefined
              }
            />

            <div className="mt-10 max-w-3xl">
              <PublicRichText content={announcement.content} />
            </div>
          </article>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicAnnouncementDetailPage
