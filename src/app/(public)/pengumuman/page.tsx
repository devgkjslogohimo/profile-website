import Link from "next/link"
import { FiBell, FiInbox } from "react-icons/fi"

import { PublicEmptyState } from "@/components/public/public-empty-state"
import { PublicPageHeader } from "@/components/public/public-page-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublishedAnnouncements } from "@/features/public-site/queries/get-public-content"

async function generateMetadata() {
  return createPublicPageMetadata({
    title: "Pengumuman",
    description: "Pengumuman resmi GKJ Slogohimo.",
    pathname: "/pengumuman",
  })
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

async function PublicAnnouncementsPage() {
  const announcements = await getPublishedAnnouncements()

  return (
    <main>
      <Section>
        <Container>
          <PublicPageHeader
            eyebrow="Informasi Resmi"
            title="Pengumuman"
            description="Informasi dan pengumuman resmi terbaru dari GKJ Slogohimo."
          />

          {announcements.length === 0 ? (
            <PublicEmptyState
              icon={FiInbox}
              title="Belum ada pengumuman"
              description="Pengumuman yang telah dipublikasikan akan ditampilkan di halaman ini."
            />
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {announcements.map((item) => (
                <Link
                  key={item.id}
                  href={`/pengumuman/${item.slug}`}
                  className="group flex flex-col rounded-2xl border bg-background p-6 transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FiBell aria-hidden="true" className="size-5" />
                  </div>

                  <h2 className="mt-5 font-heading text-xl leading-snug font-medium transition-colors group-hover:text-primary">
                    {item.title}
                  </h2>

                  {item.publishedAt ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                      {dateFormatter.format(item.publishedAt)}
                    </p>
                  ) : null}
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
export default PublicAnnouncementsPage
