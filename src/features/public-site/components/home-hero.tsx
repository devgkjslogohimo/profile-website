import Link from "next/link"
import { FiArrowRight, FiCalendar, FiFileText } from "react-icons/fi"

import { Container } from "@/components/shared/container"
import { buttonVariants } from "@/components/ui/button"
import type { PublicSiteSettings } from "@/features/public-site/queries/get-public-site-settings"

type HomeHeroProps = {
  settings: PublicSiteSettings
}

function HomeHero({ settings }: HomeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-linear-to-br from-primary/10 via-background to-secondary/30"
      />

      <div
        aria-hidden="true"
        className="absolute -top-32 -right-40 -z-10 size-112 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-40 -z-10 size-120 rounded-full bg-secondary/60 blur-3xl"
      />

      <Container className="py-20 md:py-28 lg:py-32">
        <div className="max-w-4xl">
          <div className="inline-flex items-center rounded-full border bg-background/80 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase shadow-sm backdrop-blur">
            Gereja Kristen Jawa
          </div>

          <h1 className="mt-7 max-w-4xl font-heading text-4xl leading-[1.08] font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {settings.siteName}
          </h1>

          {settings.tagline ? (
            <p className="mt-6 max-w-2xl font-heading text-xl leading-8 text-foreground/80 md:text-2xl md:leading-9">
              {settings.tagline}
            </p>
          ) : null}

          {settings.description ? (
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              {settings.description}
            </p>
          ) : null}

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/jadwal-ibadah"
              className={buttonVariants({
                size: "lg",
              })}
            >
              <FiCalendar aria-hidden="true" className="size-4" />
              Jadwal Ibadah
              <FiArrowRight aria-hidden="true" className="size-4" />
            </Link>

            <Link
              href="/pawartos"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
              })}
            >
              <FiFileText aria-hidden="true" className="size-4" />
              Pawartos
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t pt-6 text-sm text-muted-foreground">
            <Link
              href="/pengumuman"
              className="rounded-sm transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Pengumuman
            </Link>

            <Link
              href="/berita"
              className="rounded-sm transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Berita Gereja
            </Link>

            <Link
              href="/agenda"
              className="rounded-sm transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Agenda
            </Link>

            <Link
              href="/galeri"
              className="rounded-sm transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Galeri
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

export { HomeHero }
