import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { getWebsiteSetting } from "@/features/website-settings/queries/get-website-setting"

const PUBLIC_SITE_SETTINGS_REVALIDATE_SECONDS = 300

type PublicSiteSettings = {
  siteName: string
  tagline: string | null
  description: string | null

  email: string | null
  phone: string | null
  whatsapp: string | null

  facebookUrl: string | null
  instagramUrl: string | null
  youtubeUrl: string | null
}

const fallbackPublicSiteSettings: PublicSiteSettings = {
  siteName: "GKJ Slogohimo",
  tagline: null,
  description: null,

  email: null,
  phone: null,
  whatsapp: null,

  facebookUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
}

const getCachedPublicSiteSettings = unstable_cache(
  async (): Promise<PublicSiteSettings> => {
    const setting = await getWebsiteSetting()

    if (!setting) {
      return fallbackPublicSiteSettings
    }

    return {
      siteName: setting.siteName,
      tagline: setting.tagline,
      description: setting.description,

      email: setting.email,
      phone: setting.phone,
      whatsapp: setting.whatsapp,

      facebookUrl: setting.facebookUrl,
      instagramUrl: setting.instagramUrl,
      youtubeUrl: setting.youtubeUrl,
    }
  },
  ["public-site-settings-v1"],
  {
    revalidate: PUBLIC_SITE_SETTINGS_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.siteSettings],
  }
)

const getPublicSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
  return getCachedPublicSiteSettings()
})

export { getPublicSiteSettings }
export type { PublicSiteSettings }
