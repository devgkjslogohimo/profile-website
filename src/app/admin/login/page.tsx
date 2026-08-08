import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/dal/auth"
import { LoginForm } from "@/features/auth/components/login-form"

export const metadata: Metadata = {
  title: "Admin Login",
}

export default async function AdminLoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/admin")
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            GKJ Slogohimo
          </p>
          <h1 className="mt-3 font-heading text-3xl font-medium tracking-tight">Admin Portal</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masuk untuk mengelola informasi website.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Masuk</CardTitle>
            <CardDescription>Gunakan akun administrator yang telah terdaftar.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
