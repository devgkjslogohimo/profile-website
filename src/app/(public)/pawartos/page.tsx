import Link from "next/link"
import { FiFileText, FiInbox } from "react-icons/fi"

import { PublicEmptyState } from "@/components/public/public-empty-state"
import { PublicPageHeader } from "@/components/public/public-page-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublishedPawartos } from "@/features/public-site/queries/get-public-content"

async function generateMetadata() {
  return createPublicPageMetadata({
    title: "Pawartos",
    description: "Pawartos GKJ Slogohimo yang telah dipublikasikan.",
    pathname: "/pawartos",
  })
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

async function PublicPawartosPage() {
  const items = await getPublishedPawartos()

  return (
    <main>
      <Section>
        <Container>
          <PublicPageHeader
            eyebrow="Informasi Jemaat"
            title="Pawartos"
            description="Pawartos dan informasi jemaat GKJ Slogohimo yang telah dipublikasikan."
          />

          {items.length === 0 ? (
            <PublicEmptyState
              icon={FiInbox}
              title="Belum ada Pawartos"
              description="Pawartos yang telah dipublikasikan akan ditampilkan di halaman ini."
            />
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/pawartos/${item.slug}`}
                  className="group flex flex-col rounded-2xl border bg-background p-6 transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FiFileText aria-hidden="true" className="size-5" />
                  </div>

                  <p className="mt-5 text-sm text-muted-foreground">
                    {dateFormatter.format(item.publicationDate)}
                  </p>

                  <h2 className="mt-2 font-heading text-xl leading-snug font-medium transition-colors group-hover:text-primary">
                    {item.title}
                  </h2>

                  {item.description ? (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}

                  <p className="mt-5 text-sm font-medium text-primary">Buka Pawartos</p>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicPawartosPage
