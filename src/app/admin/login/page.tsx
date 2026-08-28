import { notFound, redirect } from "next/navigation"

import { getCurrentUser } from "@/dal/auth"

export default async function AdminLoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/admin")
  }

  notFound()
}
