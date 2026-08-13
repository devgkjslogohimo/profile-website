import Link from "next/link"
import { FiArrowRight, FiBell } from "react-icons/fi"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { buttonVariants } from "@/components/ui/button"

type HomeAnnouncementsSectionProps = {
  announcements: {
    id: string
    title: string
    slug: string
    publishedAt: Date | null
  }[]
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeZone: "Asia/Jakarta",
})

function HomeAnnouncementsSection({ announcements }: HomeAnnouncementsSectionProps) {
  if (announcements.length === 0) {
    return null
  }

  return (
    <Section className="bg-primary/5">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Informasi"
            title="Pengumuman"
            description="Informasi resmi terbaru dari GKJ Slogohimo."
          />

          <Link
            href="/pengumuman"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Lihat Semua
            <FiArrowRight />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {announcements.map((item) => (
            <Link
              key={item.id}
              href={`/pengumuman/${item.slug}`}
              className="group flex flex-col rounded-2xl border bg-background p-6 transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiBell aria-hidden="true" className="size-5" />
              </div>

              <h3 className="mt-5 font-heading text-xl leading-snug font-medium transition-colors group-hover:text-primary">
                {item.title}
              </h3>

              {item.publishedAt ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  {dateFormatter.format(item.publishedAt)}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export { HomeAnnouncementsSection }
