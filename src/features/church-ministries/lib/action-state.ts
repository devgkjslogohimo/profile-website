type ChurchMinistryField = "name" | "summary" | "description" | "imageUrl"

type ChurchMinistryActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: Partial<Record<ChurchMinistryField, string[]>>
  submissionId: number
}

const initialChurchMinistryActionState: ChurchMinistryActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

function getChurchMinistryFieldErrors(
  issues: readonly {
    path: PropertyKey[]
    message: string
  }[]
): ChurchMinistryActionState["fieldErrors"] {
  const fieldErrors: ChurchMinistryActionState["fieldErrors"] = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (
      field !== "name" &&
      field !== "summary" &&
      field !== "description" &&
      field !== "imageUrl"
    ) {
      continue
    }

    fieldErrors[field] ??= []
    fieldErrors[field]?.push(issue.message)
  }

  return fieldErrors
}

export { getChurchMinistryFieldErrors, initialChurchMinistryActionState }
export type { ChurchMinistryActionState, ChurchMinistryField }
