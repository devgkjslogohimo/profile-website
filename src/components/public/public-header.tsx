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
        <Container className="flex h-16 items-center justify-between gap-6 md:h-20">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary font-heading text-sm font-semibold text-primary-foreground">
              GKJ
            </div>

            <div className="min-w-0">
              <p className="truncate font-heading text-base font-semibold md:text-lg">
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
