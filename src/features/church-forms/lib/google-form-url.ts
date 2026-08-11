const GOOGLE_FORM_HOSTS = new Set(["docs.google.com", "forms.gle"])

function getGoogleFormUrl(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  let url: URL

  try {
    url = new URL(trimmedValue)
  } catch {
    return null
  }

  if (url.protocol !== "https:") {
    return null
  }

  const hostname = url.hostname.toLowerCase()

  if (!GOOGLE_FORM_HOSTS.has(hostname)) {
    return null
  }

  if (hostname === "forms.gle") {
    const path = url.pathname.replace(/^\/+|\/+$/g, "")

    if (!path) {
      return null
    }

    return url
  }

  if (!url.pathname.startsWith("/forms/")) {
    return null
  }

  return url
}

function isGoogleFormUrl(value: string) {
  return getGoogleFormUrl(value) !== null
}

function normalizeGoogleFormUrl(value: string) {
  const url = getGoogleFormUrl(value)

  if (!url) {
    return null
  }

  url.hash = ""

  return url.toString()
}

export { isGoogleFormUrl, normalizeGoogleFormUrl }
