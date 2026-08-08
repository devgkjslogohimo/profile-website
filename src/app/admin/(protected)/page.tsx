import { ShieldCheck } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireUser } from "@/dal/auth"

export default async function AdminPage() {
  const user = await requireUser()

  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Selamat datang kembali</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{user.name}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Kelola informasi dan konten website GKJ Slogohimo dari satu tempat.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Pawartos", "Belum tersedia"],
          ["Berita", "Belum tersedia"],
          ["Agenda", "Belum tersedia"],
          ["Pengajuan", "Belum tersedia"],
        ].map(([title, value]) => (
          <Card key={title}>
            <CardHeader className="pb-2">
              <CardDescription>{title}</CardDescription>
              <CardTitle className="text-xl">{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
              <ShieldCheck className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle>Admin foundation aktif</CardTitle>
              <CardDescription>
                Authentication, authorization, database, dan admin shell telah terhubung.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Modul operasional akan mulai diaktifkan pada milestone berikutnya.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
