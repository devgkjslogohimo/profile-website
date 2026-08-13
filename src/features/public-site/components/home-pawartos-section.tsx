import Link from "next/link"
import { FiArrowRight, FiFileText } from "react-icons/fi"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"

type HomePawartosSectionProps = {
  items: {
    id: string
    title: string
    slug: string
    publicationDate: Date
    description: string | null
  }[]
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function HomePawartosSection({ items }: HomePawartosSectionProps) {
  const featured = items[0]
  const previousItems = items.slice(1, 3)

  if (!featured) {
    return null
  }

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Informasi Jemaat
            </p>

            <h2 className="mt-4 font-heading text-4xl font-medium tracking-tight md:text-5xl">
              Pawartos Jemaat
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              Pawartos dan informasi terbaru untuk kehidupan serta pelayanan jemaat GKJ Slogohimo.
            </p>
          </div>

          <Link
            href="/pawartos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Semua Pawartos
            <FiArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div
          className={
            previousItems.length > 0
              ? "mt-10 grid border-t lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]"
              : "mt-10 border-t"
          }
        >
          <article className="py-8 lg:py-11 lg:pr-14">
            <div className="flex items-center gap-3 text-primary">
              <FiFileText aria-hidden="true" className="size-5" />

              <p className="text-xs font-semibold tracking-[0.16em] uppercase">Pawartos Terbaru</p>
            </div>

            <p className="mt-8 text-sm font-medium tracking-wide text-muted-foreground uppercase">
              {dateFormatter.format(featured.publicationDate)}
            </p>

            <h3 className="mt-4 max-w-2xl font-heading text-3xl leading-tight font-medium tracking-tight md:text-4xl">
              {featured.title}
            </h3>

            {featured.description ? (
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                {featured.description}
              </p>
            ) : null}

            <Link
              href={`/pawartos/${featured.slug}`}
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Buka Pawartos
              <FiArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </article>

          {previousItems.length > 0 ? (
            <aside className="border-t lg:border-t-0 lg:border-l">
              <div className="py-6 lg:px-8 lg:py-8">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Pawartos Sebelumnya
                </p>
              </div>

              <div className="border-t">
                {previousItems.map((item) => (
                  <article key={item.id} className="border-b py-7 last:border-b-0 lg:px-8">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {dateFormatter.format(item.publicationDate)}
                    </p>

                    <h3 className="mt-3 font-heading text-xl leading-snug font-medium md:text-2xl">
                      <Link
                        href={`/pawartos/${item.slug}`}
                        className="transition-colors hover:text-primary"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <Link
                      href={`/pawartos/${item.slug}`}
                      className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary"
                    >
                      Buka Pawartos
                      <FiArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </Link>
                  </article>
                ))}
              </div>
            </aside>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}

export { HomePawartosSection }
