import Image from "next/image"
import Link from "next/link"
import { FaEnvelope, FaFacebookF, FaPhone, FaWhatsapp, FaYoutube } from "react-icons/fa"

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

  return (
    <footer className="border-t bg-muted/40">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link
              href="/"
              aria-label={`${settings.siteName} - Beranda`}
              className="group inline-flex items-center gap-4"
            >
              <div className="relative size-16 shrink-0 sm:size-18">
                <Image
                  src="/gkj-slogohimo-logo.png"
                  alt={`Logo ${settings.siteName}`}
                  fill
                  sizes="(max-width: 639px) 64px, 72px"
                  className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                />
              </div>

              <div className="min-w-0">
                <p className="font-heading text-lg font-semibold tracking-tight">
                  {settings.siteName}
                </p>

                {settings.tagline ? (
                  <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                    {settings.tagline}
                  </p>
                ) : null}
              </div>
            </Link>
          </div>

          <div>
            <p className="font-medium">Navigasi</p>

            <nav aria-label="Navigasi footer" className="mt-4 flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-medium">Hubungi Kami</p>

            <div className="mt-4 space-y-3">
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-start gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <FaEnvelope className="mt-0.5 size-4 shrink-0" />
                  <span className="break-all">{settings.email}</span>
                </a>
              ) : null}

              {settings.phone && telHref ? (
                <a
                  href={telHref}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <FaPhone className="size-4 shrink-0" />
                  {settings.phone}
                </a>
              ) : null}

              {settings.whatsapp && whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <FaWhatsapp className="size-4 shrink-0" />
                  {settings.whatsapp}
                </a>
              ) : null}
            </div>

            <div className="mt-5 flex items-center gap-2">
              {settings.facebookUrl ? (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook GKJ Slogohimo"
                  className="flex size-8 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
                >
                  <FaWhatsapp className="size-4 shrink-0" />
                </a>
              ) : null}

              {settings.instagramUrl ? (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram GKJ Slogohimo"
                  className="flex size-8 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
                >
                  <FaFacebookF className="size-4" />
                </a>
              ) : null}

              {settings.youtubeUrl ? (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube GKJ Slogohimo"
                  className="flex size-8 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
                >
                  <FaYoutube className="size-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <p className="text-xs text-muted-foreground">
            © {year} {settings.siteName}. Hak cipta dilindungi.
          </p>
        </div>
      </Container>
    </footer>
  )
}

export { PublicFooter }
