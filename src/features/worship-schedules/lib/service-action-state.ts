type WorshipServiceField = "name" | "churchLocationId" | "startTime"

type WorshipServiceActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: Partial<Record<WorshipServiceField, string[]>>
  submissionId: number
}

const initialWorshipServiceActionState: WorshipServiceActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

export { initialWorshipServiceActionState }
export type { WorshipServiceActionState, WorshipServiceField }
