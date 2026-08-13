import { type AdminRole, hasPermission } from "@/lib/auth/permissions"

type CanEditAgendaInput = {
  role: AdminRole
  userId: string
  authorId: string
}

function canEditAgenda({ role, userId, authorId }: CanEditAgendaInput) {
  if (hasPermission(role, "content.edit.any")) {
    return true
  }

  return userId === authorId && hasPermission(role, "content.edit.own")
}

export { canEditAgenda }
