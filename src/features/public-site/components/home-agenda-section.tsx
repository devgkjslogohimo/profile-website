import Link from "next/link"
import { FiArrowRight, FiMapPin } from "react-icons/fi"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"

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

const dayFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  timeZone: "Asia/Jakarta",
})

const monthFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

const weekdayFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  timeZone: "Asia/Jakarta",
})

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
})

function HomeAgendaSection({ agendas }: HomeAgendaSectionProps) {
  if (agendas.length === 0) {
    return null
  }

  return (
    <Section className="bg-muted/30">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Kegiatan
            </p>

            <h2 className="mt-3 font-heading text-4xl font-medium tracking-tight md:text-5xl">
              Agenda Mendatang
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              Kegiatan dan pelayanan GKJ Slogohimo yang akan datang.
            </p>
          </div>

          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Semua Agenda
            <FiArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-10 border-t">
          {agendas.map((item) => (
            <article
              key={item.id}
              className="grid gap-6 border-b py-8 md:grid-cols-[8rem_1fr_auto] md:items-start md:gap-10"
            >
              <div>
                <p className="font-heading text-5xl leading-none font-medium tracking-tight text-primary">
                  {dayFormatter.format(item.startsAt)}
                </p>

                <p className="mt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {monthFormatter.format(item.startsAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {weekdayFormatter.format(item.startsAt)} ·{" "}
                  {timeFormatter.format(item.startsAt).replace(".", ":")} WIB
                </p>

                <h3 className="mt-2 font-heading text-2xl leading-snug font-medium md:text-3xl">
                  <Link
                    href={`/agenda/${item.slug}`}
                    className="transition-colors hover:text-primary"
                  >
                    {item.title}
                  </Link>
                </h3>

                {item.location ? (
                  <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                    <FiMapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                    {item.location}
                  </p>
                ) : null}

                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {item.excerpt}
                </p>
              </div>

              <Link
                href={`/agenda/${item.slug}`}
                aria-label={`Lihat agenda ${item.title}`}
                className="inline-flex size-10 items-center justify-center rounded-full border text-primary transition-[background-color,color] hover:bg-primary hover:text-primary-foreground"
              >
                <FiArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export { HomeAgendaSection }
