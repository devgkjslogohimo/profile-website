import Link from "next/link"
import { FiCalendar, FiMapPin } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { buttonVariants } from "@/components/ui/button"

type HomeAgendaSectionProps = {
  agendas: {
    id: string
    title: string
    slug: string
    excerpt: string

    startsAt: Date
    endsAt: Date | null

    location: string | null
    googleMapsUrl: string | null

    coverImageUrl: string | null
  }[]
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

function HomeAgendaSection({ agendas }: HomeAgendaSectionProps) {
  if (agendas.length === 0) {
    return null
  }

  return (
    <Section className="bg-muted/30">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Kegiatan"
            title="Agenda Mendatang"
            description="Kegiatan dan pelayanan GKJ Slogohimo yang akan datang."
          />

          <Link
            href="/agenda"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Lihat Semua Agenda
          </Link>
        </div>

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
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <FiCalendar className="mt-0.5 size-4 shrink-0 text-primary" />

                    <span>{dateFormatter.format(item.startsAt)} WIB</span>
                  </p>

                  {item.location ? (
                    <p className="flex items-start gap-2">
                      <FiMapPin className="mt-0.5 size-4 shrink-0 text-primary" />

                      <span>{item.location}</span>
                    </p>
                  ) : null}
                </div>

                <h3 className="mt-4 font-heading text-xl leading-snug font-medium">
                  <Link
                    href={`/agenda/${item.slug}`}
                    className="transition-colors group-hover:text-primary"
                  >
                    {item.title}
                  </Link>
                </h3>

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
      </Container>
    </Section>
  )
}

export { HomeAgendaSection }
