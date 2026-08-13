import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FiCalendar, FiMapPin } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { PublicBackLink } from "@/components/public/public-back-link"
import { PublicDetailHeader } from "@/components/public/public-detail-header"
import { PublicRichText } from "@/components/public/public-rich-text"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { getPublishedAgendaBySlug } from "@/features/public-site/queries/get-public-content"
import { isRichTextContent } from "@/lib/rich-text"

type PublicAgendaDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
})

async function generateMetadata({ params }: PublicAgendaDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const agenda = await getPublishedAgendaBySlug(slug)

  if (!agenda) {
    return {
      title: "Agenda Tidak Ditemukan",
    }
  }

  return {
    title: agenda.title,
    description: agenda.excerpt,
  }
}

async function PublicAgendaDetailPage({ params }: PublicAgendaDetailPageProps) {
  const { slug } = await params
  const agenda = await getPublishedAgendaBySlug(slug)

  if (!agenda) {
    notFound()
  }

  if (!isRichTextContent(agenda.content)) {
    throw new Error(`Invalid rich text content for agenda ${agenda.id}`)
  }

  return (
    <main>
      <Section>
        <Container>
          <PublicBackLink href="/agenda" label="Kembali ke Agenda" />

          <article className="mx-auto mt-8 max-w-4xl">
            <PublicDetailHeader
              eyebrow="Agenda"
              title={agenda.title}
              description={agenda.excerpt}
            />

            <div className="mt-8">
              <GoogleDriveImage
                url={agenda.coverImageUrl}
                alt={`Cover ${agenda.title}`}
                className="max-w-full"
                eager
              />
            </div>

            <div className="mt-8 rounded-2xl border bg-muted/20 p-5 md:p-6">
              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <FiCalendar className="mt-0.5 size-4 shrink-0 text-primary" />

                  <div>
                    <p className="font-medium text-foreground">Waktu</p>

                    <p className="mt-1 leading-6 text-muted-foreground">
                      {dateFormatter.format(agenda.startsAt)} WIB
                      {agenda.endsAt ? (
                        <>
                          <br />
                          sampai {dateFormatter.format(agenda.endsAt)} WIB
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>

                {agenda.location ? (
                  <div className="flex items-start gap-3">
                    <FiMapPin className="mt-0.5 size-4 shrink-0 text-primary" />

                    <div>
                      <p className="font-medium text-foreground">Lokasi</p>

                      <p className="mt-1 leading-6 text-muted-foreground">{agenda.location}</p>

                      {agenda.googleMapsUrl ? (
                        <a
                          href={agenda.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex font-medium text-primary hover:underline"
                        >
                          Buka Google Maps
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-10 max-w-3xl">
              <PublicRichText content={agenda.content} />
            </div>
          </article>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicAgendaDetailPage
