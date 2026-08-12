import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PawartosEditForm } from "@/features/pawartos/components/pawartos-edit-form"

import { DeletePawartosButton } from "./delete-pawartos-button"
import { PawartosPublicationButton } from "./pawartos-publication-button"

type EditPawartosViewProps = {
  pawartos: {
    id: string
    title: string
    slug: string
    publicationDate: string
    description: string | null
    googleDriveUrl: string
    status: "DRAFT" | "PUBLISHED"
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    author: {
      id: string
      name: string
      email: string
    }
  }
  canPublish: boolean
}

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
})

function formatDateTime(date: Date | null) {
  if (!date) {
    return "Belum tersedia"
  }

  return `${dateTimeFormatter.format(date)} WIB`
}

function EditPawartosView({ pawartos, canPublish }: EditPawartosViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/pawartos"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Konten</p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                Edit Pawartos
              </h1>

              <Badge variant={pawartos.status === "PUBLISHED" ? "secondary" : "outline"}>
                {pawartos.status === "PUBLISHED" ? "Published" : "Draft"}
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{pawartos.title}</p>
          </div>

          {canPublish ? (
            <PawartosPublicationButton
              id={pawartos.id}
              title={pawartos.title}
              status={pawartos.status}
            />
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pawartos</CardTitle>
        </CardHeader>

        <CardContent>
          <PawartosEditForm
            pawartos={{
              id: pawartos.id,
              title: pawartos.title,
              publicationDate: pawartos.publicationDate,
              description: pawartos.description,
              googleDriveUrl: pawartos.googleDriveUrl,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dokumen PDF</CardTitle>
        </CardHeader>

        <CardContent>
          <Link
            href={pawartos.googleDriveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            <ExternalLink />
            Buka PDF Google Drive
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hapus Pawartos</CardTitle>

          <p className="text-sm text-muted-foreground">
            {pawartos.status === "DRAFT"
              ? "Hapus Pawartos secara permanen dari sistem."
              : "Pawartos yang sudah dipublikasikan harus dikembalikan menjadi Draft sebelum dapat dihapus."}
          </p>
        </CardHeader>

        <CardContent>
          {pawartos.status === "DRAFT" ? (
            <DeletePawartosButton id={pawartos.id} title={pawartos.title} redirectAfterDelete />
          ) : (
            <p className="text-sm text-muted-foreground">
              Batalkan publikasi terlebih dahulu untuk mengaktifkan operasi hapus.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Penulis</p>
            <p className="mt-1 font-medium">{pawartos.author.name}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Slug</p>
            <p className="mt-1 font-medium break-all">{pawartos.slug}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="mt-1 font-medium">
              {pawartos.status === "PUBLISHED" ? "Published" : "Draft"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Dipublikasikan</p>
            <p className="mt-1 font-medium">{formatDateTime(pawartos.publishedAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Dibuat</p>
            <p className="mt-1 font-medium">{formatDateTime(pawartos.createdAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Diperbarui</p>
            <p className="mt-1 font-medium">{formatDateTime(pawartos.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      {pawartos.status === "PUBLISHED" ? (
        <p className="text-xs text-muted-foreground">
          Pawartos sudah dipublikasikan. Perubahan judul tidak akan mengubah slug agar URL publik
          tetap stabil.
        </p>
      ) : null}
    </main>
  )
}

export { EditPawartosView }
