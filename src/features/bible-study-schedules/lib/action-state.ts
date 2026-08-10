type BibleStudyScheduleField =
  "groupName" | "dayOfWeek" | "startTime" | "location" | "leaderName" | "notes"

type BibleStudyScheduleActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: Partial<Record<BibleStudyScheduleField, string[]>>
  submissionId: number
}

const initialBibleStudyScheduleActionState: BibleStudyScheduleActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

export { initialBibleStudyScheduleActionState }
export type { BibleStudyScheduleActionState, BibleStudyScheduleField }
