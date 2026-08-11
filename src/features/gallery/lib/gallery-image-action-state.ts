import type { ZodIssue } from "zod"

type GalleryImageField = "imageUrl" | "caption" | "altText"

type GalleryImageFieldErrors = Partial<Record<GalleryImageField, string[]>>

type GalleryImageActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: GalleryImageFieldErrors
  submissionId: number
}

const initialGalleryImageActionState: GalleryImageActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const galleryImageFields = new Set<GalleryImageField>(["imageUrl", "caption", "altText"])

function getGalleryImageFieldErrors(issues: ZodIssue[]): GalleryImageFieldErrors {
  const fieldErrors: GalleryImageFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!galleryImageFields.has(field as GalleryImageField)) {
      continue
    }

    const key = field as GalleryImageField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getGalleryImageFieldErrors, initialGalleryImageActionState }

export type { GalleryImageActionState, GalleryImageFieldErrors }
