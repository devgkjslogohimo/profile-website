import { ExternalLink, FileText } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PawartosCreateForm } from "@/features/pawartos/components/pawartos-create-form"
import { AdminRole, hasPermission } from "@/lib/auth/permissions"

import { canEditPawartos } from "../lib/pawartos-permissions"
import { DeletePawartosButton } from "./delete-pawartos-button"
import { PawartosPublicationButton } from "./pawartos-publication-button"

type PawartosListItem = {
  id: string
  title: string
  slug: string
  publicationDate: Date
  description: string | null
  googleDriveUrl: string
  status: "DRAFT" | "PUBLISHED"
  publishedAt: Date | null
  createdAt: Date
  author: {
    id: string
    name: string
    email: string
  }
}

type PawartosManagerProps = {
  pawartos: PawartosListItem[]
  currentUserId: string
  currentUserRole: AdminRole
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function PawartosManager({ pawartos, currentUserId, currentUserRole }: PawartosManagerProps) {
  const draftCount = pawartos.filter((item) => item.status === "DRAFT").length

  const publishedCount = pawartos.filter((item) => item.status === "PUBLISHED").length

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Konten</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Pawartos
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola Pawartos GKJ Slogohimo dalam bentuk dokumen PDF Google Drive.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pawartos
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{pawartos.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{draftCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{publishedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Pawartos</CardTitle>

          <p className="text-sm text-muted-foreground">
            Pawartos baru akan disimpan sebagai draft dan belum tampil pada website publik.
          </p>
        </CardHeader>

        <CardContent>
          <PawartosCreateForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pawartos</CardTitle>

          <p className="text-sm text-muted-foreground">
            {pawartos.length} dokumen Pawartos tersimpan.
          </p>
        </CardHeader>

        <CardContent>
          {pawartos.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <FileText className="mx-auto size-6 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">Belum ada Pawartos</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan dokumen Pawartos pertama melalui form di atas.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {pawartos.map((item) => {
                const isOwner = item.author.id === currentUserId

                const canEdit = canEditPawartos({
                  role: currentUserRole,
                  userId: currentUserId,
                  authorId: item.author.id,
                })

                const canPublish = hasPermission(currentUserRole, "content.publish")

                const canDelete = canEdit && item.status === "DRAFT"

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 lg:flex-row lg:items-start lg:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{item.title}</p>

                        <Badge variant={item.status === "PUBLISHED" ? "secondary" : "outline"}>
                          {item.status === "PUBLISHED" ? "Published" : "Draft"}
                        </Badge>

                        {isOwner ? <Badge variant="outline">Milik Anda</Badge> : null}
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {dateFormatter.format(item.publicationDate)}
                      </p>

                      {item.description ? (
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Penulis: {item.author.name}</span>

                        <span>Slug: {item.slug}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Link
                        href={item.googleDriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        <ExternalLink />
                        Buka PDF
                      </Link>

                      {canPublish ? (
                        <PawartosPublicationButton
                          id={item.id}
                          title={item.title}
                          status={item.status}
                        />
                      ) : null}

                      {canEdit ? (
                        <Link
                          href={`/admin/pawartos/${item.id}/edit`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          Edit
                        </Link>
                      ) : null}

                      {canDelete ? <DeletePawartosButton id={item.id} title={item.title} /> : null}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export { PawartosManager }
