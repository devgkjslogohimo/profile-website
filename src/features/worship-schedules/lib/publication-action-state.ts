type WorshipSchedulePublicationActionState = {
  status: "idle" | "success" | "error"
  message: string
}

const initialWorshipSchedulePublicationActionState: WorshipSchedulePublicationActionState = {
  status: "idle",
  message: "",
}

export { initialWorshipSchedulePublicationActionState }
export type { WorshipSchedulePublicationActionState }
