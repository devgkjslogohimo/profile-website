import Link from "next/link"
import { FiArrowRight, FiCalendar, FiFileText } from "react-icons/fi"

import { Container } from "@/components/shared/container"
import { buttonVariants } from "@/components/ui/button"
import type { PublicSiteSettings } from "@/features/public-site/queries/get-public-site-settings"

type HomeHeroProps = {
  settings: PublicSiteSettings
}

function HomeHero({ settings }: HomeHeroProps) {
  const supportingText =
    settings.description ??
    "Website resmi untuk informasi ibadah, Pawartos, agenda, berita, dan kehidupan pelayanan jemaat."

  return (
    <section className="relative isolate overflow-hidden border-b bg-background">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-linear-to-br from-primary/10 via-background to-secondary/30"
      />

      <div
        aria-hidden="true"
        className="absolute -top-40 -right-48 -z-10 size-144 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-52 -left-40 -z-10 size-128 rounded-full bg-secondary/70 blur-3xl"
      />

      <Container className="py-20 md:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Gereja Kristen Jawa
            </p>

            <h1 className="mt-6 max-w-4xl font-heading text-5xl leading-[0.98] font-medium tracking-[-0.045em] text-balance text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              {settings.siteName}
            </h1>

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
          </div>

          <div className="border-t pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            {settings.tagline ? (
              <p className="font-heading text-2xl leading-snug font-medium text-foreground md:text-3xl">
                {settings.tagline}
              </p>
            ) : null}

            <p
              className={`max-w-xl text-base leading-8 text-muted-foreground ${
                settings.tagline ? "mt-5" : ""
              }`}
            >
              {supportingText}
            </p>

            <p className="mt-8 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Ibadah · Warta · Pelayanan · Kebersamaan
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

export { HomeHero }
