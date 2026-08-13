import type { Metadata } from "next"
import Link from "next/link"
import { FiInbox } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { PublicEmptyState } from "@/components/public/public-empty-state"
import { PublicPageHeader } from "@/components/public/public-page-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { getPublishedNews } from "@/features/public-site/queries/get-public-content"

export const metadata: Metadata = {
  title: "Berita",
  description: "Berita terbaru GKJ Slogohimo.",
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

async function PublicNewsPage() {
  const news = await getPublishedNews()

  return (
    <main>
      <Section>
        <Container>
          <PublicPageHeader
            eyebrow="Kabar Gereja"
            title="Berita"
            description="Berita dan kabar terbaru dari kehidupan serta pelayanan GKJ Slogohimo."
          />

          {news.length === 0 ? (
            <PublicEmptyState
              icon={FiInbox}
              title="Belum ada berita"
              description="Berita yang telah dipublikasikan akan ditampilkan di halaman ini."
            />
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-background transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <Link href={`/berita/${item.slug}`}>
                    <GoogleDriveImage
                      url={item.coverImageUrl}
                      alt={`Cover ${item.title}`}
                      className="rounded-none border-0"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    {item.publishedAt ? (
                      <p className="text-xs text-muted-foreground">
                        {dateFormatter.format(item.publishedAt)}
                      </p>
                    ) : null}

                    <h2 className="mt-3 font-heading text-xl leading-snug font-medium">
                      <Link
                        href={`/berita/${item.slug}`}
                        className="transition-colors group-hover:text-primary"
                      >
                        {item.title}
                      </Link>
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {item.excerpt}
                    </p>

                    <Link
                      href={`/berita/${item.slug}`}
                      className="mt-auto inline-flex pt-5 text-sm font-medium text-primary hover:underline"
                    >
                      Baca Selengkapnya
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

export default PublicNewsPage
