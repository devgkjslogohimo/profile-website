import Image from "next/image"
import Link from "next/link"
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaPhone,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa"

import type { PublicNavigationItem } from "@/components/public/public-navigation"
import { Container } from "@/components/shared/container"
import { createTelHref, createWhatsAppHref } from "@/features/public-site/lib/public-contact"
import type { PublicSiteSettings } from "@/features/public-site/queries/get-public-site-settings"

type PublicFooterProps = {
  settings: PublicSiteSettings
  navigationItems: PublicNavigationItem[]
}

function PublicFooter({ settings, navigationItems }: PublicFooterProps) {
  const telHref = createTelHref(settings.phone)
  const whatsappHref = createWhatsAppHref(settings.whatsapp)
  const year = new Date().getFullYear()

  const hasSocialLinks = Boolean(
    whatsappHref || settings.facebookUrl || settings.instagramUrl || settings.youtubeUrl
  )

  return (
    <footer className="border-t border-border/70 bg-muted/40">
      <Container className="py-8 sm:py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Identitas */}
          <div className="lg:col-span-5">
            <Link
              href="/"

              className="group inline-flex items-center gap-3.5"
            >
              <div className="relative size-14 shrink-0 sm:size-16">
                <Image
                  src="/gkj-slogohimo-logo.png"
                  alt={`Logo ${settings.siteName}`}
                  fill
                  quality={60}
                  sizes="(max-width: 639px) 56px, 64px"
                  className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                />
              </div>

              <div className="min-w-0">
                <p className="font-heading text-lg leading-tight font-semibold tracking-tight sm:text-xl">
                  {settings.siteName}
                </p>

                {settings.tagline ? (
                  <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                    {settings.tagline}
                  </p>
                ) : null}
              </div>
            </Link>

            {settings.description ? (
              <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                {settings.description}
              </p>
            ) : null}
          </div>

          {/* Navigasi */}
          <div className="lg:col-span-3">
            <p className="font-heading text-base font-semibold tracking-tight">Navigasi</p>

            <nav
              aria-label="Navigasi footer"
              className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 lg:grid-cols-1"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-fit text-sm leading-5 text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Kontak */}
          <div className="lg:col-span-4">
            <p className="font-heading text-base font-semibold tracking-tight">Hubungi Kami</p>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="col-span-2 flex min-w-0 items-center gap-3 rounded-xl border border-border/70 bg-background/45 px-3.5 py-3 text-sm text-muted-foreground transition-[border-color,background-color,color] hover:border-primary/30 hover:bg-background hover:text-foreground"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FaEnvelope aria-hidden="true" className="size-3.5" />
                  </span>

                  <span className="min-w-0 truncate">{settings.email}</span>
                </a>
              ) : null}

              {settings.phone && telHref ? (
                <a
                  href={telHref}
                  className="flex min-w-0 items-center gap-2.5 rounded-xl border border-border/70 bg-background/45 px-3 py-3 text-sm text-muted-foreground transition-[border-color,background-color,color] hover:border-primary/30 hover:bg-background hover:text-foreground"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FaPhone aria-hidden="true" className="size-3.5" />
                  </span>

                  <span className="min-w-0 truncate">{settings.phone}</span>
                </a>
              ) : null}

              {settings.whatsapp && whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-2.5 rounded-xl border border-border/70 bg-background/45 px-3 py-3 text-sm text-muted-foreground transition-[border-color,background-color,color] hover:border-primary/30 hover:bg-background hover:text-foreground"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FaWhatsapp aria-hidden="true" className="size-4" />
                  </span>

                  <span className="min-w-0 truncate">WhatsApp</span>
                </a>
              ) : null}
            </div>

            {hasSocialLinks ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${settings.siteName}`}
                    className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background/45 text-muted-foreground transition-[border-color,background-color,color] hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    <FaWhatsapp aria-hidden="true" className="size-4" />
                  </a>
                ) : null}

                {settings.facebookUrl ? (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Facebook ${settings.siteName}`}
                    className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background/45 text-muted-foreground transition-[border-color,background-color,color] hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    <FaFacebookF aria-hidden="true" className="size-4" />
                  </a>
                ) : null}

                {settings.instagramUrl ? (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram ${settings.siteName}`}
                    className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background/45 text-muted-foreground transition-[border-color,background-color,color] hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    <FaInstagram aria-hidden="true" className="size-4" />
                  </a>
                ) : null}

                {settings.youtubeUrl ? (
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`YouTube ${settings.siteName}`}
                    className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background/45 text-muted-foreground transition-[border-color,background-color,color] hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    <FaYoutube aria-hidden="true" className="size-4" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-border/70 pt-5 md:mt-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs leading-5 text-muted-foreground">
              © {year} {settings.siteName}. Hak cipta dilindungi.
            </p>

            <Link
              href="/"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {settings.siteName}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export { PublicFooter }
