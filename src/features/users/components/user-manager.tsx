import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCreateForm } from "@/features/users/components/user-create-form"
import { userRoleLabels, type UserRoleValue } from "@/features/users/lib/user-role"

import { ToggleUserStatus } from "./toggle-user-status"

type UserListItem = {
  id: string
  name: string
  email: string
  role: UserRoleValue
  isActive: boolean
  lastLoginAt: Date | null
  createdAt: Date
}

type UserManagerProps = {
  users: UserListItem[]
  currentUserId: string
}

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
})

function formatDateTime(date: Date | null) {
  if (!date) {
    return "Belum pernah login"
  }

  return `${dateTimeFormatter.format(date)} WIB`
}

function UserManager({ users, currentUserId }: UserManagerProps) {
  const activeCount = users.filter((user) => user.isActive).length
  const superAdminCount = users.filter((user) => user.role === "SUPER_ADMIN").length

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Sistem</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Pengguna
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola akun administrator dan hak akses panel admin GKJ Slogohimo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pengguna
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{users.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pengguna Aktif
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{activeCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Super Admin</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{superAdminCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Pengguna</CardTitle>

          <p className="text-sm text-muted-foreground">
            Buat akun baru untuk mengakses panel admin.
          </p>
        </CardHeader>

        <CardContent>
          <UserCreateForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>

          <p className="text-sm text-muted-foreground">
            {activeCount} dari {users.length} pengguna aktif.
          </p>
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-sm font-medium">Belum ada pengguna</p>
            </div>
          ) : (
            <div className="divide-y">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 md:flex-row md:items-start md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{user.name}</p>

                      {user.id === currentUserId ? (
                        <Badge variant="outline">Akun Anda</Badge>
                      ) : null}

                      <Badge variant="outline">{userRoleLabels[user.role]}</Badge>

                      <Badge variant={user.isActive ? "secondary" : "outline"}>
                        {user.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>

                    <p className="mt-1 text-sm break-all text-muted-foreground">{user.email}</p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 md:items-end">
                    <div className="text-sm md:text-right">
                      <p className="text-muted-foreground">Login terakhir</p>

                      <p className="mt-1 font-medium">{formatDateTime(user.lastLoginAt)}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <ToggleUserStatus
                        id={user.id}
                        name={user.name}
                        isActive={user.isActive}
                        isCurrentUser={user.id === currentUserId}
                      />

                      <Link
                        href={`/admin/pengguna/${user.id}/edit`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export { UserManager }
