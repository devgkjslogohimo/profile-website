import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpdateRoleForm } from "@/features/worship-service-roles/components/update-role-form"

type EditWorshipServiceRoleViewProps = {
  role: {
    id: string
    name: string
    sortOrder: number
    isActive: boolean
  }
}

function EditWorshipServiceRoleView({ role }: EditWorshipServiceRoleViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/peran-petugas-ibadah"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">Jadwal Ibadah</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Edit Peran Petugas
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">{role.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Peran</CardTitle>
        </CardHeader>

        <CardContent>
          <UpdateRoleForm
            role={{
              id: role.id,
              name: role.name,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Urutan</p>
            <p className="mt-1 font-medium">{role.sortOrder}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="mt-1 font-medium">{role.isActive ? "Aktif" : "Nonaktif"}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export { EditWorshipServiceRoleView }
