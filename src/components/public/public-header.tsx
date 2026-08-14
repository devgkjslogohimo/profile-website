import Image from "next/image"
import Link from "next/link"

import { PublicAnnouncementBar } from "@/components/public/public-announcement-bar"
import { PublicMobileNavigation } from "@/components/public/public-mobile-navigation"
import type { PublicNavigationItem } from "@/components/public/public-navigation"
import { Container } from "@/components/shared/container"
import type { PublicSiteSettings } from "@/features/public-site/queries/get-public-site-settings"

import { PublicDesktopNavigation } from "./public-desktop-navigation"

type PublicHeaderProps = {
  settings: PublicSiteSettings
  navigationItems: PublicNavigationItem[]

  announcements: {
    id: string
    title: string
    slug: string
  }[]
}

function PublicHeader({ settings, navigationItems, announcements }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-40">
      <PublicAnnouncementBar announcements={announcements} />

      <div className="border-b bg-background/95 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-5 md:h-20">
          <Link
            href="/"
            aria-label={`${settings.siteName} - Beranda`}
            className="group flex min-w-0 items-center gap-3"
          >
            <div className="relative size-12 shrink-0 md:size-14">
              <Image
                src="/gkj-slogohimo-logo.png"
                alt={`Logo ${settings.siteName}`}
                fill
                priority
                sizes="(max-width: 767px) 48px, 56px"
                className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate font-heading text-base font-semibold tracking-tight md:text-lg">
                {settings.siteName}
              </p>

              {settings.tagline ? (
                <p className="hidden truncate text-xs text-muted-foreground sm:block">
                  {settings.tagline}
                </p>
              ) : null}
            </div>
          </Link>

          <PublicDesktopNavigation navigationItems={navigationItems} />

          <PublicMobileNavigation
            siteName={settings.siteName}
            navigationItems={navigationItems}
            socialLinks={{
              facebookUrl: settings.facebookUrl,
              instagramUrl: settings.instagramUrl,
              youtubeUrl: settings.youtubeUrl,
            }}
          />
        </Container>
      </div>
    </header>
  )
}

export { PublicHeader }
