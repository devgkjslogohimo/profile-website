import type { ZodIssue } from "zod"

type ChurchFormField = "title" | "description" | "googleFormUrl"

type ChurchFormFieldErrors = Partial<Record<ChurchFormField, string[]>>

type ChurchFormActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: ChurchFormFieldErrors
  submissionId: number
}

const initialChurchFormActionState: ChurchFormActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const churchFormFields = new Set<ChurchFormField>(["title", "description", "googleFormUrl"])

function getChurchFormFieldErrors(issues: ZodIssue[]): ChurchFormFieldErrors {
  const fieldErrors: ChurchFormFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!churchFormFields.has(field as ChurchFormField)) {
      continue
    }

    const key = field as ChurchFormField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getChurchFormFieldErrors, initialChurchFormActionState }

export type { ChurchFormActionState, ChurchFormFieldErrors }
