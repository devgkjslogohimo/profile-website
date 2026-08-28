import "server-only"

import { redirect } from "next/navigation"

import { getAdminLoginPath } from "@/lib/auth/admin-login-entry"
import { hasPermission, type Permission } from "@/lib/auth/permissions"
import { getAdminSession } from "@/lib/auth/session"
import { prisma } from "@/lib/db/prisma"

type CurrentAdminUser = {
  id: string
  name: string
  email: string
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CONTRIBUTOR"
}

async function getCurrentUser(): Promise<CurrentAdminUser | null> {
  const session = await getAdminSession()

  if (!session.isLoggedIn || !session.userId || typeof session.sessionVersion !== "number") {
    return null
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      sessionVersion: true,
    },
  })

  if (!user || !user.isActive || user.sessionVersion !== session.sessionVersion) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

async function requireUser(): Promise<CurrentAdminUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirect(getAdminLoginPath())
  }

  return user
}

async function requirePermission(permission: Permission): Promise<CurrentAdminUser> {
  const user = await requireUser()

  if (!hasPermission(user.role, permission)) {
    redirect("/admin?error=forbidden")
  }

  return user
}

export { getCurrentUser, requirePermission, requireUser }
export type { CurrentAdminUser }
