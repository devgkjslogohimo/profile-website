import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserEditForm } from "@/features/users/components/user-edit-form"
import { userRoleLabels, type UserRoleValue } from "@/features/users/lib/user-role"

import { ResetUserPasswordButton } from "./reset-user-password-button"
import { ToggleUserStatus } from "./toggle-user-status"

type EditUserViewProps = {
  user: {
    id: string
    name: string
    email: string
    role: UserRoleValue
    isActive: boolean
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
  }
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

function EditUserView({ user, currentUserId }: EditUserViewProps) {
  const isCurrentUser = user.id === currentUserId

  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/pengguna"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">Sistem</p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Edit Pengguna
          </h1>

          <Badge variant={user.isActive ? "secondary" : "outline"}>
            {user.isActive ? "Aktif" : "Nonaktif"}
          </Badge>

          {isCurrentUser ? <Badge variant="outline">Akun Anda</Badge> : null}
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{user.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pengguna</CardTitle>
        </CardHeader>

        <CardContent>
          <UserEditForm
            user={{
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }}
            isCurrentUser={isCurrentUser}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Akun</CardTitle>

          <p className="text-sm text-muted-foreground">
            {user.isActive
              ? "Akun saat ini dapat digunakan untuk login ke panel admin."
              : "Akun saat ini tidak dapat digunakan untuk login."}
          </p>
        </CardHeader>

        <CardContent>
          {isCurrentUser ? (
            <p className="text-sm text-muted-foreground">
              Akun yang sedang anda gunakan tidak dapat dinonaktifkan.
            </p>
          ) : (
            <ToggleUserStatus
              id={user.id}
              name={user.name}
              isActive={user.isActive}
              isCurrentUser={false}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keamanan Akun</CardTitle>

          <p className="text-sm text-muted-foreground">
            Reset password pengguna dan cabut seluruh sesi login yang masih aktif.
          </p>
        </CardHeader>

        <CardContent>
          <ResetUserPasswordButton id={user.id} name={user.name} isCurrentUser={isCurrentUser} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Peran</p>
            <p className="mt-1 font-medium">{userRoleLabels[user.role]}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="mt-1 font-medium">{user.isActive ? "Aktif" : "Nonaktif"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Login terakhir</p>
            <p className="mt-1 font-medium">{formatDateTime(user.lastLoginAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Dibuat</p>
            <p className="mt-1 font-medium">{formatDateTime(user.createdAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Terakhir diperbarui</p>
            <p className="mt-1 font-medium">{formatDateTime(user.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Password dan status akun dikelola melalui operasi terpisah.
      </p>
    </main>
  )
}

export { EditUserView }
