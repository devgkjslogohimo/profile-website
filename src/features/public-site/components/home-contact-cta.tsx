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
    <section className="border-t bg-foreground text-background">
      <Container className="py-16 md:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-background/60 uppercase">
              Hubungi Kami
            </p>

            <h2 className="mt-4 max-w-3xl font-heading text-4xl leading-tight font-medium tracking-tight md:text-5xl lg:text-6xl">
              Terhubung dengan {settings.siteName}
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-background/65 md:text-base">
              Untuk informasi mengenai kegiatan, pelayanan, dan kehidupan jemaat, silakan hubungi
              melalui kanal yang tersedia.
            </p>
          </div>

          <div className="border-t border-background/20">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 border-b border-background/20 py-4 text-sm font-medium transition-opacity hover:opacity-75"
              >
                <FaWhatsapp aria-hidden="true" className="size-5" />
                WhatsApp
              </a>
            ) : null}

            {telHref && settings.phone ? (
              <a
                href={telHref}
                className="group flex items-center gap-4 border-b border-background/20 py-4 text-sm font-medium transition-opacity hover:opacity-75"
              >
                <FaPhone aria-hidden="true" className="size-4" />
                {settings.phone}
              </a>
            ) : null}

            {settings.email ? (
              <a
                href={`mailto:${settings.email}`}
                className="group flex items-center gap-4 border-b border-background/20 py-4 text-sm font-medium transition-opacity hover:opacity-75"
              >
                <FaEnvelope aria-hidden="true" className="size-4" />
                {settings.email}
              </a>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}

export { HomeContactCta }
