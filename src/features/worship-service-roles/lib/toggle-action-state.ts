type ToggleWorshipServiceRoleActionState = {
  status: "idle" | "success" | "error"
  message: string
}

const initialToggleWorshipServiceRoleActionState: ToggleWorshipServiceRoleActionState = {
  status: "idle",
  message: "",
}

export { initialToggleWorshipServiceRoleActionState }
export type { ToggleWorshipServiceRoleActionState }
