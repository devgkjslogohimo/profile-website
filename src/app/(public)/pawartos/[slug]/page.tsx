import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FiExternalLink } from "react-icons/fi"

import { PublicBackLink } from "@/components/public/public-back-link"
import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { buttonVariants } from "@/components/ui/button"
import { getPublishedPawartosBySlug } from "@/features/public-site/queries/get-public-content"
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

async function generateMetadata({ params }: PublicPawartosDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const pawartos = await getPublishedPawartosBySlug(slug)

  if (!pawartos) {
    return {
      title: "Pawartos Tidak Ditemukan",
    }
  }

  return {
    title: pawartos.title,
    description:
      pawartos.description ??
      `Pawartos GKJ Slogohimo tanggal ${dateFormatter.format(pawartos.publicationDate)}.`,
  }
}

async function PublicPawartosDetailPage({ params }: PublicPawartosDetailPageProps) {
  const { slug } = await params
  const pawartos = await getPublishedPawartosBySlug(slug)

  if (!pawartos) {
    notFound()
  }

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

            {previewUrl ? (
              <div className="mt-10 overflow-hidden rounded-2xl border bg-muted/20">
                <iframe
                  src={previewUrl}
                  title={pawartos.title}
                  className="h-[75vh] min-h-160 w-full"
                />
              </div>
            ) : null}

            <div className="mt-6">
              <a
                href={pawartos.googleDriveUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants()}
              >
                Buka PDF di Google Drive
                <FiExternalLink className="size-4" />
              </a>
            </div>
          </article>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicPawartosDetailPage
