import "server-only"

const DEVELOPMENT_SITE_URL = "http://localhost:3000"

function normalizeSiteUrl(value: string): URL {
  const url = new URL(value)

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SITE_URL harus menggunakan protokol HTTP atau HTTPS.")
  }

  return new URL(url.origin)
}

function getSiteUrl(): URL {
  const configuredSiteUrl = process.env.SITE_URL?.trim()

  if (configuredSiteUrl) {
    return normalizeSiteUrl(configuredSiteUrl)
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SITE_URL belum tersedia pada environment production.")
  }

  return new URL(DEVELOPMENT_SITE_URL)
}

function getAbsoluteSiteUrl(pathname = "/"): string {
  return new URL(pathname, getSiteUrl()).toString()
}

export { getAbsoluteSiteUrl, getSiteUrl }
