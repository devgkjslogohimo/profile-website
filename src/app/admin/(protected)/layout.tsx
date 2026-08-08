import type { ReactNode } from "react"

import { requireUser } from "@/dal/auth"

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  await requireUser()

  return children
}
