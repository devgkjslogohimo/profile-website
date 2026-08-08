"use server"

import { redirect } from "next/navigation"

import { destroyAdminSession } from "@/lib/auth/session"

async function logoutAction() {
  await destroyAdminSession()
  redirect("/admin/login")
}

export { logoutAction }
