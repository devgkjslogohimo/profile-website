import type { ZodIssue } from "zod"

type ChurchPastorField =
  "fullName" | "periodStart" | "periodEnd" | "summary" | "biography" | "photoUrl"

type ChurchPastorFieldErrors = Partial<Record<ChurchPastorField, string[]>>

type ChurchPastorActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: ChurchPastorFieldErrors
  submissionId: number
}

const initialChurchPastorActionState: ChurchPastorActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const churchPastorFields = new Set<ChurchPastorField>([
  "fullName",
  "periodStart",
  "periodEnd",
  "summary",
  "biography",
  "photoUrl",
])

function getChurchPastorFieldErrors(issues: ZodIssue[]): ChurchPastorFieldErrors {
  const fieldErrors: ChurchPastorFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!churchPastorFields.has(field as ChurchPastorField)) {
      continue
    }

    const key = field as ChurchPastorField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getChurchPastorFieldErrors, initialChurchPastorActionState }

export type { ChurchPastorActionState, ChurchPastorFieldErrors }
