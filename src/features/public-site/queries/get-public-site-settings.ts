import { cache } from "react"

import { getWebsiteSetting } from "@/features/website-settings/queries/get-website-setting"

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

const getPublicSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
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
})

export { getPublicSiteSettings }
export type { PublicSiteSettings }
