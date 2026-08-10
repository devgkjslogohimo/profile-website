type WorshipServiceRoleField = "name"

type WorshipServiceRoleActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: Partial<Record<WorshipServiceRoleField, string[]>>
  submissionId: number
}

const initialWorshipServiceRoleActionState: WorshipServiceRoleActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

export { initialWorshipServiceRoleActionState }
export type { WorshipServiceRoleActionState, WorshipServiceRoleField }
