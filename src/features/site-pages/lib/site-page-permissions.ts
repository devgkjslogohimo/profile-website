import { type AdminRole, hasPermission } from "@/lib/auth/permissions"

type CanEditSitePageInput = {
  role: AdminRole
  userId: string
  authorId: string
}

function canEditSitePage({ role, userId, authorId }: CanEditSitePageInput) {
  if (hasPermission(role, "content.edit.any")) {
    return true
  }

  return userId === authorId && hasPermission(role, "content.edit.own")
}

export { canEditSitePage }
