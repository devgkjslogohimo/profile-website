import type { ZodIssue } from "zod"

type LocationCoverField = "imageUrl"

type LocationCoverActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: Partial<Record<LocationCoverField, string[]>>
  submissionId: number
}

const initialLocationCoverActionState: LocationCoverActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

type LocationImageField = "imageUrl" | "caption"

type LocationImageActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: Partial<Record<LocationImageField, string[]>>
  submissionId: number
}

const initialLocationImageActionState: LocationImageActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const locationImageFields = new Set<LocationImageField>(["imageUrl", "caption"])

function getLocationImageFieldErrors(issues: ZodIssue[]): LocationImageActionState["fieldErrors"] {
  const fieldErrors: LocationImageActionState["fieldErrors"] = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!locationImageFields.has(field as LocationImageField)) {
      continue
    }

    const key = field as LocationImageField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export {
  getLocationImageFieldErrors,
  initialLocationCoverActionState,
  initialLocationImageActionState,
}

export type { LocationCoverActionState, LocationImageActionState }
