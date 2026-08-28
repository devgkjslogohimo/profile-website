"use server"

import { redirect } from "next/navigation"

import { getAdminLoginPath } from "@/lib/auth/admin-login-entry"
import { destroyAdminSession } from "@/lib/auth/session"

async function logoutAction() {
  await destroyAdminSession()
  redirect(getAdminLoginPath())
}

export { logoutAction }
