import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireUser } from "@/dal/auth"
import { logoutAction } from "@/features/auth/actions/logout"

export default async function AdminPage() {
  const user = await requireUser()

  return (
    <main className="min-h-svh bg-muted/30 p-5 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-muted-foreground">GKJ Slogohimo Admin</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Dashboard</h1>
          </div>

          <form action={logoutAction}>
            <Button type="submit" variant="outline">
              Keluar
            </Button>
          </form>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Authentication berhasil</CardTitle>
            <CardDescription>
              Session admin aktif dan user telah diverifikasi dari database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="text-muted-foreground">Nama:</span> {user.name}
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span> {user.email}
            </p>
            <p>
              <span className="text-muted-foreground">Role:</span> {user.role}
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
