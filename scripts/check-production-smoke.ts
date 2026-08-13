import "dotenv/config"

const REQUEST_TIMEOUT_MS = 10_000

const siteUrlValue = process.env.SITE_URL?.trim()

if (!siteUrlValue) {
  throw new Error("SITE_URL belum tersedia")
}

const siteUrl = new URL(siteUrlValue)

if (siteUrl.protocol !== "http:" && siteUrl.protocol !== "https:") {
  throw new Error("SITE_URL harus menggunakan protokol HTTP atau HTTPS")
}

async function request(pathname: string, init?: RequestInit): Promise<Response> {
  const url = new URL(pathname, siteUrl)

  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
}

function assertStatus(response: Response, expectedStatus: number, label: string) {
  if (response.status !== expectedStatus) {
    throw new Error(`${label}: expected HTTP ${expectedStatus}, received ${response.status}`)
  }
}

function assertContentType(response: Response, expected: string, label: string) {
  const contentType = response.headers.get("content-type") ?? ""

  if (!contentType.toLowerCase().includes(expected.toLowerCase())) {
    throw new Error(`${label}: unexpected content-type ${contentType || "(empty)"}`)
  }
}

async function checkHomepage() {
  const response = await request("/")

  assertStatus(response, 200, "HOMEPAGE")
  assertContentType(response, "text/html", "HOMEPAGE")

  console.log("HOMEPAGE: OK")
}

async function checkHealth() {
  const response = await request("/api/health")

  assertStatus(response, 200, "HEALTH")
  assertContentType(response, "application/json", "HEALTH")

  const body = (await response.json()) as {
    status?: unknown
    database?: unknown
  }

  if (body.status !== "ok" || body.database !== "ok") {
    throw new Error("HEALTH: response payload tidak menunjukkan kondisi OK")
  }

  console.log("HEALTH: OK")
}

async function checkRobots() {
  const response = await request("/robots.txt")

  assertStatus(response, 200, "ROBOTS")
  assertContentType(response, "text/plain", "ROBOTS")

  const body = await response.text()

  if (!body.includes("Sitemap:")) {
    throw new Error("ROBOTS: sitemap reference tidak ditemukan")
  }

  console.log("ROBOTS: OK")
}

async function checkSitemap() {
  const response = await request("/sitemap.xml")

  assertStatus(response, 200, "SITEMAP")
  assertContentType(response, "xml", "SITEMAP")

  const body = await response.text()

  if (!body.includes("<urlset")) {
    throw new Error("SITEMAP: urlset tidak ditemukan")
  }

  console.log("SITEMAP: OK")
}

async function checkAdminProtection() {
  const response = await request("/admin", {
    redirect: "manual",
  })

  if (![301, 302, 303, 307, 308].includes(response.status)) {
    throw new Error(`ADMIN PROTECTION: expected redirect, received HTTP ${response.status}`)
  }

  const location = response.headers.get("location")

  if (!location) {
    throw new Error("ADMIN PROTECTION: redirect location tidak tersedia")
  }

  const redirectUrl = new URL(location, siteUrl)

  if (redirectUrl.pathname !== "/admin/login") {
    throw new Error(`ADMIN PROTECTION: unexpected redirect ${redirectUrl.pathname}`)
  }

  console.log("ADMIN PROTECTION: OK")
}

async function checkAdminLogin() {
  const response = await request("/admin/login")

  assertStatus(response, 200, "ADMIN LOGIN")
  assertContentType(response, "text/html", "ADMIN LOGIN")

  console.log("ADMIN LOGIN: OK")
}

async function main() {
  console.log(`SMOKE TARGET: ${siteUrl.origin}`)

  await checkHomepage()
  await checkHealth()
  await checkRobots()
  await checkSitemap()
  await checkAdminProtection()
  await checkAdminLogin()

  console.log("PRODUCTION SMOKE CHECK: PASS")
}

await main()
