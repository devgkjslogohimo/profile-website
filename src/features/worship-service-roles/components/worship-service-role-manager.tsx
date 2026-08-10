import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateRoleForm } from "@/features/worship-service-roles/components/create-role-form"
import { DeleteRoleButton } from "@/features/worship-service-roles/components/delete-role-button"
import { ToggleRoleStatus } from "@/features/worship-service-roles/components/toggle-role-status"

type WorshipServiceRoleListItem = {
  id: string
  name: string
  sortOrder: number
  isActive: boolean
}

type WorshipServiceRoleManagerProps = {
  roles: WorshipServiceRoleListItem[]
}

function WorshipServiceRoleManager({ roles }: WorshipServiceRoleManagerProps) {
  const activeRoles = roles.filter((role) => role.isActive).length
  const inactiveRoles = roles.length - activeRoles

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Jadwal Ibadah</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Peran Petugas Ibadah
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola master peran yang dapat digunakan saat menentukan petugas pada jadwal ibadah.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Peran</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{roles.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aktif</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{activeRoles}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nonaktif</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{inactiveRoles}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Peran</CardTitle>

          <p className="text-sm text-muted-foreground">
            Tambahkan peran petugas yang nantinya dapat digunakan pada jadwal ibadah.
          </p>
        </CardHeader>

        <CardContent>
          <CreateRoleForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Peran</CardTitle>

          <p className="text-sm text-muted-foreground">
            {activeRoles} dari {roles.length} peran aktif
          </p>
        </CardHeader>

        <CardContent>
          {roles.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-sm font-medium">Belum ada peran petugas</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan peran petugas ibadah menggunakan formulir di atas.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{role.name}</p>

                    <p className="mt-1 text-sm text-muted-foreground">Urutan {role.sortOrder}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={role.isActive ? "secondary" : "outline"}>
                      {role.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>

                    <ToggleRoleStatus id={role.id} name={role.name} isActive={role.isActive} />

                    {!role.isActive ? <DeleteRoleButton id={role.id} name={role.name} /> : null}

                    <Link
                      href={`/admin/peran-petugas-ibadah/${role.id}/edit`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      Edit
                    </Link>
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

export { WorshipServiceRoleManager }
