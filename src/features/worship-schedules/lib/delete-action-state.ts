type DeleteWorshipScheduleActionState = {
  status: "success" | "error"
  message: string
}

type DeleteWorshipServiceActionState = {
  status: "success" | "error"
  message: string
}

type DeleteWorshipServiceAssignmentActionState = {
  status: "success" | "error"
  message: string
}

export type {
  DeleteWorshipScheduleActionState,
  DeleteWorshipServiceActionState,
  DeleteWorshipServiceAssignmentActionState,
}
