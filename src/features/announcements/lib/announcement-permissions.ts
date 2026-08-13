import { type AdminRole, hasPermission } from "@/lib/auth/permissions"

type CanEditAnnouncementInput = {
  role: AdminRole
  userId: string
  authorId: string
}

function canEditAnnouncement({ role, userId, authorId }: CanEditAnnouncementInput) {
  if (hasPermission(role, "content.edit.any")) {
    return true
  }

  return userId === authorId && hasPermission(role, "content.edit.own")
}

export { canEditAnnouncement }
