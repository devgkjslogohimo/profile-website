import type { ZodIssue } from "zod"

type GalleryAlbumField = "title" | "description" | "eventDate" | "coverImageUrl" | "googleDriveUrl"

type GalleryAlbumFieldErrors = Partial<Record<GalleryAlbumField, string[]>>

type GalleryAlbumActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: GalleryAlbumFieldErrors
  submissionId: number
}

const initialGalleryAlbumActionState: GalleryAlbumActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const galleryAlbumFields = new Set<GalleryAlbumField>([
  "title",
  "description",
  "eventDate",
  "coverImageUrl",
  "googleDriveUrl",
])

function getGalleryAlbumFieldErrors(issues: ZodIssue[]): GalleryAlbumFieldErrors {
  const fieldErrors: GalleryAlbumFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!galleryAlbumFields.has(field as GalleryAlbumField)) {
      continue
    }

    const key = field as GalleryAlbumField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getGalleryAlbumFieldErrors, initialGalleryAlbumActionState }

export type { GalleryAlbumActionState, GalleryAlbumFieldErrors }
