import type { ZodIssue } from "zod"

type ChurchCouncilMemberField = "fullName" | "position" | "periodStart" | "periodEnd" | "photoUrl"

type ChurchCouncilMemberFieldErrors = Partial<Record<ChurchCouncilMemberField, string[]>>

type ChurchCouncilMemberActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: ChurchCouncilMemberFieldErrors
  submissionId: number
}

const initialChurchCouncilMemberActionState: ChurchCouncilMemberActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const churchCouncilMemberFields = new Set<ChurchCouncilMemberField>([
  "fullName",
  "position",
  "periodStart",
  "periodEnd",
  "photoUrl",
])

function getChurchCouncilMemberFieldErrors(issues: ZodIssue[]): ChurchCouncilMemberFieldErrors {
  const fieldErrors: ChurchCouncilMemberFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!churchCouncilMemberFields.has(field as ChurchCouncilMemberField)) {
      continue
    }

    const key = field as ChurchCouncilMemberField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getChurchCouncilMemberFieldErrors, initialChurchCouncilMemberActionState }

export type { ChurchCouncilMemberActionState, ChurchCouncilMemberFieldErrors }
