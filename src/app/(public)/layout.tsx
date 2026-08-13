import type { Metadata } from "next"

import { PublicFooter } from "@/components/public/public-footer"
import { PublicHeader } from "@/components/public/public-header"
import { createPublicNavigationItems } from "@/components/public/public-navigation"
import { getPublicNavigationPages } from "@/features/public-site/queries/get-public-navigation"
import { getPublicSiteSettings } from "@/features/public-site/queries/get-public-site-settings"
import { getAbsoluteSiteUrl, getSiteUrl } from "@/lib/site-url"

export const dynamic = "force-dynamic"

type PublicLayoutProps = {
  children: React.ReactNode
}

function getPublicDescription({
  description,
  tagline,
}: {
  description: string | null
  tagline: string | null
}) {
  return (
    description ??
    tagline ??
    "Website resmi GKJ Slogohimo untuk informasi ibadah, Pawartos, agenda, berita, dan pelayanan jemaat."
  )
}

async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings()

  const description = getPublicDescription(settings)
  const homepageUrl = getAbsoluteSiteUrl("/")

  return {
    metadataBase: getSiteUrl(),

    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },

    description,

    applicationName: settings.siteName,

    alternates: {
      canonical: homepageUrl,
    },

    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: settings.siteName,
      title: settings.siteName,
      description,
      url: homepageUrl,
    },

    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },
  }
}

async function PublicLayout({ children }: PublicLayoutProps) {
  const [settings, cmsNavigationPages] = await Promise.all([
    getPublicSiteSettings(),
    getPublicNavigationPages(),
  ])

  const navigationItems = createPublicNavigationItems(cmsNavigationPages)

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#public-content"
        className="sr-only z-100 rounded-lg bg-background px-4 py-3 text-sm font-medium text-foreground shadow-lg focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
      >
        Lewati ke konten utama
      </a>

      <PublicHeader settings={settings} navigationItems={navigationItems} />

      <div id="public-content" tabIndex={-1} className="flex-1 scroll-mt-24 focus:outline-none">
        {children}
      </div>

      <PublicFooter settings={settings} navigationItems={navigationItems} />
    </div>
  )
}

export { generateMetadata }
export default PublicLayout
