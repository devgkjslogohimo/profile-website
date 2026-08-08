type ToggleChurchLocationActionState = {
  status: "idle" | "success" | "error"
  message: string
}

const initialToggleChurchLocationActionState: ToggleChurchLocationActionState = {
  status: "idle",
  message: "",
}

export { initialToggleChurchLocationActionState }
export type { ToggleChurchLocationActionState }
