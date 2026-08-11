import { ExternalLink, FileText } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurchFormCreateForm } from "@/features/church-forms/components/church-form-create-form"
import { DeleteChurchFormButton } from "@/features/church-forms/components/delete-church-form-button"
import { ReorderChurchFormButtons } from "@/features/church-forms/components/reorder-church-form-buttons"
import { ToggleChurchFormStatus } from "@/features/church-forms/components/toggle-church-form-status"

type ChurchFormListItem = {
  id: string
  title: string
  description: string | null
  googleFormUrl: string
  sortOrder: number
  isActive: boolean
}

type ChurchFormManagerProps = {
  churchForms: ChurchFormListItem[]
}

function ChurchFormManager({ churchForms }: ChurchFormManagerProps) {
  const activeCount = churchForms.filter((churchForm) => churchForm.isActive).length

  const inactiveCount = churchForms.length - activeCount

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Layanan</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Formulir
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola daftar formulir Google Form yang dapat digunakan jemaat.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Formulir
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-muted-foreground" />

              <p className="text-2xl font-semibold">{churchForms.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aktif</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{activeCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nonaktif</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{inactiveCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <details>
            <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
              + Tambah Formulir
            </summary>

            <div className="mt-6 border-t pt-6">
              <ChurchFormCreateForm />
            </div>
          </details>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-semibold">Daftar Formulir</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Urutan formulir dapat disesuaikan menggunakan tombol naik dan turun.
          </p>
        </div>

        {churchForms.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm font-medium">Belum ada formulir</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan formulir menggunakan formulir di atas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {churchForms.map((churchForm, index) => (
              <Card key={churchForm.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="wrap-break-word">{churchForm.title}</CardTitle>

                    <Badge variant={churchForm.isActive ? "secondary" : "outline"}>
                      {churchForm.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {churchForm.description ? (
                    <p className="text-sm text-muted-foreground">{churchForm.description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Belum ada deskripsi.</p>
                  )}

                  <Link
                    href={churchForm.googleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <ExternalLink />
                    Buka Google Form
                  </Link>

                  <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                    <ReorderChurchFormButtons
                      id={churchForm.id}
                      title={churchForm.title}
                      canMoveUp={index > 0}
                      canMoveDown={index < churchForms.length - 1}
                    />

                    <ToggleChurchFormStatus
                      id={churchForm.id}
                      title={churchForm.title}
                      isActive={churchForm.isActive}
                    />

                    <Link
                      href={`/admin/pengajuan/${churchForm.id}/edit`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      Edit
                    </Link>

                    {!churchForm.isActive ? (
                      <DeleteChurchFormButton id={churchForm.id} title={churchForm.title} />
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export { ChurchFormManager }
