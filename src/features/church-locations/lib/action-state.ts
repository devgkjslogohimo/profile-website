type ChurchLocationField = "name" | "type" | "googleMapsUrl"

type ChurchLocationActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: Partial<Record<ChurchLocationField, string[]>>
  submissionId: number
}

const initialChurchLocationActionState: ChurchLocationActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

export { initialChurchLocationActionState }
export type { ChurchLocationActionState, ChurchLocationField }
