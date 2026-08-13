import type { ZodIssue } from "zod"

type AgendaField =
  | "title"
  | "excerpt"
  | "content"
  | "startsAt"
  | "endsAt"
  | "location"
  | "googleMapsUrl"
  | "coverImageUrl"

type AgendaFieldErrors = Partial<Record<AgendaField, string[]>>

type AgendaActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: AgendaFieldErrors
  submissionId: number
}

const initialAgendaActionState: AgendaActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const agendaFields = new Set<AgendaField>([
  "title",
  "excerpt",
  "content",
  "startsAt",
  "endsAt",
  "location",
  "googleMapsUrl",
  "coverImageUrl",
])

function getAgendaFieldErrors(issues: ZodIssue[]): AgendaFieldErrors {
  const fieldErrors: AgendaFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!agendaFields.has(field as AgendaField)) {
      continue
    }

    const key = field as AgendaField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getAgendaFieldErrors, initialAgendaActionState }

export type { AgendaActionState, AgendaField, AgendaFieldErrors }
