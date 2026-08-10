type WorshipServiceAssignmentField = "worshipServiceRoleId" | "personName"

type WorshipServiceAssignmentActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: Partial<Record<WorshipServiceAssignmentField, string[]>>
  submissionId: number
}

const initialWorshipServiceAssignmentActionState: WorshipServiceAssignmentActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

export { initialWorshipServiceAssignmentActionState }
export type { WorshipServiceAssignmentActionState, WorshipServiceAssignmentField }
