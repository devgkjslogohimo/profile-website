type ToggleChurchMinistryActionState = {
  status: "idle" | "success" | "error"
  message: string
}

const initialToggleChurchMinistryActionState: ToggleChurchMinistryActionState = {
  status: "idle",
  message: "",
}

export { initialToggleChurchMinistryActionState }
export type { ToggleChurchMinistryActionState }
