import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SitePageEditForm } from "@/features/site-pages/components/site-page-edit-form"
import type { RichTextContent } from "@/lib/rich-text"

import { DeleteSitePageButton } from "./delete-site-page-button"
import { SitePagePublicationButton } from "./site-page-publication-button"

type EditSitePageViewProps = {
  sitePage: {
    id: string
    title: string
    slug: string
    content: RichTextContent

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

function formatDateTime(value: Date | null) {
  if (!value) {
    return "Belum tersedia"
  }

  return `${dateTimeFormatter.format(value)} WIB`
}

function EditSitePageView({ sitePage, canPublish }: EditSitePageViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/halaman"
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
                Edit Halaman
              </h1>

              <Badge variant={sitePage.status === "PUBLISHED" ? "secondary" : "outline"}>
                {sitePage.status === "PUBLISHED" ? "Published" : "Draft"}
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{sitePage.title}</p>
          </div>

          {canPublish ? (
            <SitePagePublicationButton
              id={sitePage.id}
              title={sitePage.title}
              status={sitePage.status}
            />
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Isi Halaman</CardTitle>
        </CardHeader>

        <CardContent>
          <SitePageEditForm
            sitePage={{
              id: sitePage.id,
              title: sitePage.title,
              content: sitePage.content,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Penulis</p>

            <p className="mt-1 font-medium">{sitePage.author.name}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Alamat Publik</p>

            <p className="mt-1 font-mono font-medium break-all">/{sitePage.slug}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>

            <p className="mt-1 font-medium">
              {sitePage.status === "PUBLISHED" ? "Published" : "Draft"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Dipublikasikan</p>

            <p className="mt-1 font-medium">{formatDateTime(sitePage.publishedAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Dibuat</p>

            <p className="mt-1 font-medium">{formatDateTime(sitePage.createdAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Diperbarui</p>

            <p className="mt-1 font-medium">{formatDateTime(sitePage.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hapus Halaman</CardTitle>

          <p className="text-sm text-muted-foreground">
            {sitePage.status === "DRAFT"
              ? "Hapus halaman secara permanen dari CMS."
              : "Halaman Published harus dikembalikan menjadi Draft sebelum dapat dihapus."}
          </p>
        </CardHeader>

        <CardContent>
          {sitePage.status === "DRAFT" ? (
            <DeleteSitePageButton id={sitePage.id} title={sitePage.title} redirectAfterDelete />
          ) : (
            <p className="text-sm text-muted-foreground">
              Batalkan publikasi terlebih dahulu untuk mengaktifkan operasi hapus.
            </p>
          )}
        </CardContent>
      </Card>

      {sitePage.status === "PUBLISHED" ? (
        <p className="text-xs text-muted-foreground">
          Halaman sudah dipublikasikan. Perubahan judul tidak akan mengubah alamat publik agar URL
          tetap stabil.
        </p>
      ) : null}
    </main>
  )
}

export { EditSitePageView }
