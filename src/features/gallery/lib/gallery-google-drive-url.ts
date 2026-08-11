import { isValidGoogleDriveFileId } from "@/lib/google-drive"

const GOOGLE_DRIVE_HOSTS = new Set(["drive.google.com", "www.drive.google.com"])

type GoogleDriveFolderInfo = {
  folderId: string
  resourceKey: string | null
}

function getGoogleDriveFolderInfo(value: string): GoogleDriveFolderInfo | null {
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

  if (!GOOGLE_DRIVE_HOSTS.has(url.hostname.toLowerCase())) {
    return null
  }

  const segments = url.pathname.split("/").filter(Boolean)
  const foldersIndex = segments.indexOf("folders")

  if (foldersIndex === -1) {
    return null
  }

  const folderId = segments[foldersIndex + 1]

  if (!folderId || !isValidGoogleDriveFileId(folderId)) {
    return null
  }

  return {
    folderId,
    resourceKey: url.searchParams.get("resourcekey"),
  }
}

function isGoogleDriveFolderUrl(value: string) {
  return getGoogleDriveFolderInfo(value) !== null
}

function normalizeGoogleDriveFolderUrl(value: string) {
  const folder = getGoogleDriveFolderInfo(value)

  if (!folder) {
    return null
  }

  const normalizedUrl = new URL(`https://drive.google.com/drive/folders/${folder.folderId}`)

  if (folder.resourceKey) {
    normalizedUrl.searchParams.set("resourcekey", folder.resourceKey)
  }

  return normalizedUrl.toString()
}

export { isGoogleDriveFolderUrl, normalizeGoogleDriveFolderUrl }
