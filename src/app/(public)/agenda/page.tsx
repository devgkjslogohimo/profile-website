import Link from "next/link"
import { FiCalendar, FiMapPin } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { PublicEmptyState } from "@/components/public/public-empty-state"
import { PublicPageHeader } from "@/components/public/public-page-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublishedAgendas } from "@/features/public-site/queries/get-public-content"

async function generateMetadata() {
  return createPublicPageMetadata({
    title: "Agenda",
    description: "Agenda dan kegiatan GKJ Slogohimo.",
    pathname: "/agenda",
  })
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "short",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
})

async function PublicAgendaPage() {
  const agendas = await getPublishedAgendas()

  return (
    <main>
      <Section>
        <Container>
          <PublicPageHeader
            eyebrow="Kegiatan Gereja"
            title="Agenda"
            description="Agenda kegiatan, pelayanan, dan persekutuan GKJ Slogohimo."
          />

          {agendas.length === 0 ? (
            <PublicEmptyState
              icon={FiCalendar}
              title="Belum ada agenda"
              description="Agenda yang telah dipublikasikan akan ditampilkan di halaman ini."
            />
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {agendas.map((item) => (
                <article
                  key={item.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-background transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <GoogleDriveImage
                    url={item.coverImageUrl}
                    alt={`Cover ${item.title}`}
                    className="rounded-none border-0"
                  />

                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-start gap-2 text-xs text-muted-foreground">
                      <FiCalendar className="mt-0.5 size-4 shrink-0 text-primary" />
                      {dateFormatter.format(item.startsAt)} WIB
                    </p>

                    {item.location ? (
                      <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
                        <FiMapPin className="mt-0.5 size-4 shrink-0 text-primary" />

                        {item.location}
                      </p>
                    ) : null}

                    <h2 className="mt-4 font-heading text-xl leading-snug font-medium">
                      <Link
                        href={`/agenda/${item.slug}`}
                        className="transition-colors hover:text-primary"
                      >
                        {item.title}
                      </Link>
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {item.excerpt}
                    </p>

                    <Link
                      href={`/agenda/${item.slug}`}
                      className="mt-auto inline-flex pt-5 text-sm font-medium text-primary hover:underline"
                    >
                      Lihat Agenda
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicAgendaPage
