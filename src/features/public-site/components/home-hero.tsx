import Link from "next/link"
import { FiArrowRight, FiCalendar, FiFileText } from "react-icons/fi"

import { Container } from "@/components/shared/container"
import { buttonVariants } from "@/components/ui/button"
import {
  type HeroImageSlide,
  HeroImageSlider,
} from "@/features/public-site/components/hero-image-slider"
import type { PublicSiteSettings } from "@/features/public-site/queries/get-public-site-settings"

type HomeHeroProps = {
  settings: PublicSiteSettings
  slides: HeroImageSlide[]
}

function HomeHero({ settings, slides }: HomeHeroProps) {
  const supportingText =
    settings.description ??
    "Website resmi untuk informasi ibadah, Pawartos, agenda, berita, dan kehidupan pelayanan jemaat."

  const hasSlides = slides.length > 0

  return (
    <section
      className={`relative isolate overflow-hidden border-b ${
        hasSlides ? "bg-black" : "bg-background"
      }`}
    >
      {hasSlides ? (
        <HeroImageSlider slides={slides} />
      ) : (
        <>
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
        </>
      )}

      <Container className="relative z-10 py-20 md:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-end lg:gap-16">
          <div>
            <p
              className={`text-xs font-semibold tracking-[0.2em] uppercase ${
                hasSlides ? "text-white/80" : "text-primary"
              }`}
            >
              Gereja Kristen Jawa
            </p>

            <h1
              className={`mt-6 max-w-4xl font-heading text-5xl leading-[0.98] font-medium tracking-[-0.045em] text-balance sm:text-6xl md:text-7xl lg:text-[5.5rem] ${
                hasSlides ? "text-white" : "text-foreground"
              }`}
            >
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
                className={`${buttonVariants({
                  variant: "outline",
                  size: "lg",
                })} ${
                  hasSlides
                    ? "border-white/40 bg-black/15 text-white hover:bg-white/15 hover:text-white"
                    : ""
                }`}
              >
                <FiFileText aria-hidden="true" className="size-4" />
                Pawartos
              </Link>
            </div>
          </div>

          <div
            className={`border-t pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10 ${
              hasSlides ? "border-white/25" : ""
            }`}
          >
            {settings.tagline ? (
              <p
                className={`font-heading text-2xl leading-snug font-medium md:text-3xl ${
                  hasSlides ? "text-white" : "text-foreground"
                }`}
              >
                {settings.tagline}
              </p>
            ) : null}

            <p
              className={`max-w-xl text-base leading-8 ${settings.tagline ? "mt-5" : ""} ${
                hasSlides ? "text-white/80" : "text-muted-foreground"
              }`}
            >
              {supportingText}
            </p>

            <p
              className={`mt-8 text-xs font-semibold tracking-[0.16em] uppercase ${
                hasSlides ? "text-white/75" : "text-primary"
              }`}
            >
              Ibadah · Warta · Pelayanan · Kebersamaan
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

export { HomeHero }
