import { type AdminRole, hasPermission } from "@/lib/auth/permissions"

type CanEditPawartosInput = {
  role: AdminRole
  userId: string
  authorId: string
}

function canEditPawartos({ role, userId, authorId }: CanEditPawartosInput) {
  if (hasPermission(role, "content.edit.any")) {
    return true
  }

  return userId === authorId && hasPermission(role, "content.edit.own")
}

export { canEditPawartos }
