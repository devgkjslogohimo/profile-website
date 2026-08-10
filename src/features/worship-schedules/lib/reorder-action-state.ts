type ReorderActionResult = {
  status: "success" | "error"
  message: string
}

type ReorderDirection = "up" | "down"

export type { ReorderActionResult, ReorderDirection }
