import type { ZodIssue } from "zod"

type PawartosField = "title" | "publicationDate" | "description" | "googleDriveUrl"

type PawartosFieldErrors = Partial<Record<PawartosField, string[]>>

type PawartosActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: PawartosFieldErrors
  submissionId: number
}

const initialPawartosActionState: PawartosActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const pawartosFields = new Set<PawartosField>([
  "title",
  "publicationDate",
  "description",
  "googleDriveUrl",
])

function getPawartosFieldErrors(issues: ZodIssue[]): PawartosFieldErrors {
  const fieldErrors: PawartosFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!pawartosFields.has(field as PawartosField)) {
      continue
    }

    const key = field as PawartosField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getPawartosFieldErrors, initialPawartosActionState }

export type { PawartosActionState, PawartosFieldErrors }
