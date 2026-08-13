import { type AdminRole, hasPermission } from "@/lib/auth/permissions"

type CanEditNewsInput = {
  role: AdminRole
  userId: string
  authorId: string
}

function canEditNews({ role, userId, authorId }: CanEditNewsInput) {
  if (hasPermission(role, "content.edit.any")) {
    return true
  }

  return userId === authorId && hasPermission(role, "content.edit.own")
}

export { canEditNews }
