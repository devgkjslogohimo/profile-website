type ToggleBibleStudyScheduleActionState = {
  status: "idle" | "success" | "error"
  message: string
}

const initialToggleBibleStudyScheduleActionState: ToggleBibleStudyScheduleActionState = {
  status: "idle",
  message: "",
}

export { initialToggleBibleStudyScheduleActionState }
export type { ToggleBibleStudyScheduleActionState }
