import Link from "next/link"
import { FiArrowRight } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"

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

  const [featuredNews, ...otherNews] = news

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-6 border-b pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Kabar Gereja
            </p>

            <h2 className="mt-3 font-heading text-4xl font-medium tracking-tight md:text-5xl">
              Berita Terbaru
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              Informasi dan kabar terbaru dari kehidupan pelayanan GKJ Slogohimo.
            </p>
          </div>

          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Semua Berita
            <FiArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)] lg:gap-8">
          <article>
            <Link href={`/berita/${featuredNews.slug}`} className="group block">
              <GoogleDriveImage
                url={featuredNews.coverImageUrl}
                alt={`Cover ${featuredNews.title}`}
                className="rounded-2xl border-0 transition-opacity duration-200 group-hover:opacity-90"
              />

              {featuredNews.publishedAt ? (
                <p className="mt-6 text-xs font-medium text-muted-foreground">
                  {dateFormatter.format(featuredNews.publishedAt)}
                </p>
              ) : null}

              <h3 className="mt-3 max-w-3xl font-heading text-3xl leading-tight font-medium tracking-tight transition-colors group-hover:text-primary md:text-4xl">
                {featuredNews.title}
              </h3>
            </Link>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              {featuredNews.excerpt}
            </p>

            <Link
              href={`/berita/${featuredNews.slug}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Baca Selengkapnya
              <FiArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </article>

          {otherNews.length > 0 ? (
            <div className="flex flex-col">
              {otherNews.map((item, index) => (
                <article
                  key={item.id}
                  className={`grid gap-5 ${
                    index > 0 ? "mt-7 border-t pt-7" : ""
                  } sm:grid-cols-[11rem_1fr] lg:grid-cols-1 xl:grid-cols-[13rem_1fr]`}
                >
                  <Link href={`/berita/${item.slug}`} className="group block">
                    <GoogleDriveImage
                      url={item.coverImageUrl}
                      alt={`Cover ${item.title}`}
                      className="rounded-xl border-0 transition-opacity duration-200 group-hover:opacity-90"
                    />
                  </Link>

                  <div className="min-w-0">
                    {item.publishedAt ? (
                      <p className="text-xs text-muted-foreground">
                        {dateFormatter.format(item.publishedAt)}
                      </p>
                    ) : null}

                    <h3 className="mt-2 font-heading text-xl leading-snug font-medium xl:text-2xl">
                      <Link
                        href={`/berita/${item.slug}`}
                        className="transition-colors hover:text-primary"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {item.excerpt}
                    </p>

                    <Link
                      href={`/berita/${item.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Baca Berita
                      <FiArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}

export { HomeNewsSection }
