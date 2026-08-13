import type { ZodIssue } from "zod"

type AnnouncementField = "title" | "content"

type AnnouncementFieldErrors = Partial<Record<AnnouncementField, string[]>>

type AnnouncementActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: AnnouncementFieldErrors
  submissionId: number
}

const initialAnnouncementActionState: AnnouncementActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const announcementFields = new Set<AnnouncementField>(["title", "content"])

function getAnnouncementFieldErrors(issues: ZodIssue[]): AnnouncementFieldErrors {
  const fieldErrors: AnnouncementFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!announcementFields.has(field as AnnouncementField)) {
      continue
    }

    const key = field as AnnouncementField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getAnnouncementFieldErrors, initialAnnouncementActionState }

export type { AnnouncementActionState, AnnouncementField, AnnouncementFieldErrors }
