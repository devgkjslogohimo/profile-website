import type { Metadata } from "next"

import { getPublicSiteSettings } from "@/features/public-site/queries/get-public-site-settings"
import { getAbsoluteSiteUrl } from "@/lib/site-url"

type PublicPageMetadataInput = {
  title: string
  description: string
  pathname: string
}

async function createPublicPageMetadata({
  title,
  description,
  pathname,
}: PublicPageMetadataInput): Promise<Metadata> {
  const settings = await getPublicSiteSettings()

  const canonicalUrl = getAbsoluteSiteUrl(pathname)
  const socialTitle = `${title} | ${settings.siteName}`

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: settings.siteName,
      title: socialTitle,
      description,
      url: canonicalUrl,
    },

    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  }
}

export { createPublicPageMetadata }
