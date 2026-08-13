import { FaEnvelope, FaPhone, FaWhatsapp } from "react-icons/fa"

import { Container } from "@/components/shared/container"
import { createTelHref, createWhatsAppHref } from "@/features/public-site/lib/public-contact"
import type { PublicSiteSettings } from "@/features/public-site/queries/get-public-site-settings"

type HomeContactCtaProps = {
  settings: PublicSiteSettings
}

function HomeContactCta({ settings }: HomeContactCtaProps) {
  const telHref = createTelHref(settings.phone)

  const whatsappHref = createWhatsAppHref(settings.whatsapp)

  const hasContact = Boolean(settings.email) || Boolean(telHref) || Boolean(whatsappHref)

  if (!hasContact) {
    return null
  }

  return (
    <section className="border-t bg-primary text-primary-foreground">
      <Container className="py-14 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary-foreground/70 uppercase">
              Hubungi Kami
            </p>

            <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight md:text-4xl">
              Terhubung dengan {settings.siteName}
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-primary-foreground/75 md:text-base">
              Untuk informasi lebih lanjut mengenai kegiatan, pelayanan, dan kehidupan jemaat,
              silakan hubungi melalui kanal yang tersedia.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:max-w-md lg:justify-end">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-background px-5 text-sm font-medium text-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
              >
                <FaWhatsapp aria-hidden="true" className="size-4" />
                WhatsApp
              </a>
            ) : null}

            {telHref && settings.phone ? (
              <a
                href={telHref}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary-foreground/25 px-5 text-sm font-medium transition-colors hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
              >
                <FaPhone aria-hidden="true" className="size-4" />
                {settings.phone}
              </a>
            ) : null}

            {settings.email ? (
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary-foreground/25 px-5 text-sm font-medium transition-colors hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
              >
                <FaEnvelope aria-hidden="true" className="size-4" />
                Email
              </a>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}

export { HomeContactCta }
