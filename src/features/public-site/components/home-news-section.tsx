import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { buttonVariants } from "@/components/ui/button"

type HomeNewsSectionProps = {
  news: {
    id: string
    title: string
    slug: string
    excerpt: string
    coverImageUrl: string | null
    publishedAt: Date | null
  }[]
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

function HomeNewsSection({ news }: HomeNewsSectionProps) {
  if (news.length === 0) {
    return null
  }

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Kabar Gereja"
            title="Berita Terbaru"
            description="Informasi dan kabar terbaru dari kehidupan pelayanan GKJ Slogohimo."
          />

          <Link
            href="/berita"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Semua Berita
          </Link>
        </div>

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

                <h3 className="mt-3 font-heading text-xl leading-snug font-medium">
                  <Link
                    href={`/berita/${item.slug}`}
                    className="mt-auto inline-flex pt-5 text-sm font-medium text-primary hover:underline"
                  >
                    {item.title}
                  </Link>
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {item.excerpt}
                </p>

                <Link
                  href={`/berita/${item.slug}`}
                  className="mt-5 inline-flex text-sm font-medium text-primary hover:underline"
                >
                  Baca Selengkapnya
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export { HomeNewsSection }
