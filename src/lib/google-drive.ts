const GOOGLE_DRIVE_HOSTS = new Set(["drive.google.com", "www.drive.google.com"])

const GOOGLE_DRIVE_FILE_ID_PATTERN = /^[A-Za-z0-9_-]{10,200}$/

type GoogleDriveFileReference = {
  fileId: string
  resourceKey: string | null
}

function isValidGoogleDriveFileId(value: string): boolean {
  return GOOGLE_DRIVE_FILE_ID_PATTERN.test(value)
}

function getGoogleDriveFileReference(value: string): GoogleDriveFileReference | null {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  try {
    const url = new URL(trimmedValue)

    if (!GOOGLE_DRIVE_HOSTS.has(url.hostname)) {
      return null
    }

    let fileId: string | null = null

    const filePathMatch = url.pathname.match(/^\/file\/d\/([^/]+)/)

    if (filePathMatch?.[1]) {
      fileId = filePathMatch[1]
    } else {
      fileId = url.searchParams.get("id")
    }

    if (!fileId || !isValidGoogleDriveFileId(fileId)) {
      return null
    }

    const resourceKey = url.searchParams.get("resourcekey") ?? url.searchParams.get("resourceKey")

    return {
      fileId,
      resourceKey: resourceKey?.trim() || null,
    }
  } catch {
    return null
  }
}

function getGoogleDriveFileId(value: string): string | null {
  return getGoogleDriveFileReference(value)?.fileId ?? null
}

function isGoogleDriveUrl(value: string): boolean {
  return getGoogleDriveFileReference(value) !== null
}

function normalizeGoogleDriveUrl(value: string): string | null {
  const reference = getGoogleDriveFileReference(value)

  if (!reference) {
    return null
  }

  const url = new URL(
    `https://drive.google.com/file/d/${encodeURIComponent(reference.fileId)}/view`
  )

  if (reference.resourceKey) {
    url.searchParams.set("resourcekey", reference.resourceKey)
  }

  return url.toString()
}

export type GoogleDriveSourceWidth = 400 | 500 | 750 | 1000 | 1200 | 1600 | 2000

type GoogleDriveMediaOptions = {
  sourceWidth?: GoogleDriveSourceWidth
}

function getGoogleDriveMediaUrl(
  value: string,
  options: GoogleDriveMediaOptions = {}
): string | null {
  const reference = getGoogleDriveFileReference(value)

  if (!reference) {
    return null
  }

  const url = new URL(
    `/api/media/google-drive/${encodeURIComponent(reference.fileId)}`,
    "http://internal"
  )

  if (reference.resourceKey) {
    url.searchParams.set("resourceKey", reference.resourceKey)
  }

  if (options.sourceWidth !== undefined) {
    url.searchParams.set("width", String(options.sourceWidth))
  }

  return `${url.pathname}${url.search}`
}

function getGoogleDrivePdfPreviewUrl(value: string): string | null {
  const reference = getGoogleDriveFileReference(value)

  if (!reference) {
    return null
  }

  const url = new URL(
    `https://drive.google.com/file/d/${encodeURIComponent(reference.fileId)}/preview`
  )

  if (reference.resourceKey) {
    url.searchParams.set("resourcekey", reference.resourceKey)
  }

  return url.toString()
}

export {
  getGoogleDriveFileId,
  getGoogleDriveFileReference,
  getGoogleDriveMediaUrl,
  getGoogleDrivePdfPreviewUrl,
  isGoogleDriveUrl,
  isValidGoogleDriveFileId,
  normalizeGoogleDriveUrl,
}

export type { GoogleDriveFileReference }
