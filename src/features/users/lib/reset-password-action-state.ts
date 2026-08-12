import type { ZodIssue } from "zod"

type ResetPasswordField = "password" | "confirmPassword"

type ResetPasswordFieldErrors = Partial<Record<ResetPasswordField, string[]>>

type ResetPasswordActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: ResetPasswordFieldErrors
  submissionId: number
}

const initialResetPasswordActionState: ResetPasswordActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const resetPasswordFields = new Set<ResetPasswordField>(["password", "confirmPassword"])

function getResetPasswordFieldErrors(issues: ZodIssue[]): ResetPasswordFieldErrors {
  const fieldErrors: ResetPasswordFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!resetPasswordFields.has(field as ResetPasswordField)) {
      continue
    }

    const key = field as ResetPasswordField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getResetPasswordFieldErrors, initialResetPasswordActionState }

export type { ResetPasswordActionState, ResetPasswordFieldErrors }
