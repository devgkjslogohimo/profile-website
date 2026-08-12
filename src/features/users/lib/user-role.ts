import type { AdminRole } from "@/lib/auth/permissions"

const userRoleValues = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "CONTRIBUTOR",
] as const satisfies readonly AdminRole[]

type UserRoleValue = (typeof userRoleValues)[number]

const userRoleLabels: Record<UserRoleValue, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  CONTRIBUTOR: "Kontributor",
}

function isUserRole(value: string | null): value is UserRoleValue {
  return userRoleValues.some((role) => role === value)
}

export { isUserRole, userRoleLabels, userRoleValues }
export type { UserRoleValue }
