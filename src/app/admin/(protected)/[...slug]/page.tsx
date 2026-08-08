import { adminRouteLabels } from "@/components/admin/admin-route-labels"
import { adminRoutePermissions } from "@/components/admin/admin-route-permissions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requirePermission, requireUser } from "@/dal/auth"

export default async function AdminModulePlaceholder({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const route = slug[0] ?? ""
  const title = adminRouteLabels[route] ?? "Modul Admin"
  const permission = adminRoutePermissions[route]

  if (permission) {
    await requirePermission(permission)
  } else {
    await requireUser()
  }

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">GKJ Slogohimo Admin</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modul belum diaktifkan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Struktur halaman sudah tersedia. Fitur CRUD akan dibangun pada milestone modul terkait.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
