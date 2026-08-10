type WorshipScheduleField = "date"

type WorshipScheduleActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: Partial<Record<WorshipScheduleField, string[]>>
  submissionId: number
}

const initialWorshipScheduleActionState: WorshipScheduleActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

export { initialWorshipScheduleActionState }
export type { WorshipScheduleActionState, WorshipScheduleField }
