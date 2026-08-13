import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnnouncementEditForm } from "@/features/announcements/components/announcement-edit-form"
import type { RichTextContent } from "@/lib/rich-text"

import { AnnouncementPublicationButton } from "./announcement-publication-button"
import { DeleteAnnouncementButton } from "./delete-announcement-button"

type EditAnnouncementViewProps = {
  announcement: {
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

function EditAnnouncementView({ announcement, canPublish }: EditAnnouncementViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/pengumuman"
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
                Edit Pengumuman
              </h1>

              <Badge variant={announcement.status === "PUBLISHED" ? "secondary" : "outline"}>
                {announcement.status === "PUBLISHED" ? "Published" : "Draft"}
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{announcement.title}</p>
          </div>

          {canPublish ? (
            <AnnouncementPublicationButton
              id={announcement.id}
              title={announcement.title}
              status={announcement.status}
            />
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pengumuman</CardTitle>
        </CardHeader>

        <CardContent>
          <AnnouncementEditForm
            announcement={{
              id: announcement.id,
              title: announcement.title,
              content: announcement.content,
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

            <p className="mt-1 font-medium">{announcement.author.name}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Slug</p>

            <p className="mt-1 font-medium break-all">{announcement.slug}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>

            <p className="mt-1 font-medium">
              {announcement.status === "PUBLISHED" ? "Published" : "Draft"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Dipublikasikan</p>

            <p className="mt-1 font-medium">{formatDateTime(announcement.publishedAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Dibuat</p>

            <p className="mt-1 font-medium">{formatDateTime(announcement.createdAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Diperbarui</p>

            <p className="mt-1 font-medium">{formatDateTime(announcement.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hapus Pengumuman</CardTitle>

          <p className="text-sm text-muted-foreground">
            {announcement.status === "DRAFT"
              ? "Hapus pengumuman secara permanen dari sistem."
              : "Pengumuman yang sudah dipublikasikan harus dikembalikan menjadi Draft sebelum dapat dihapus."}
          </p>
        </CardHeader>

        <CardContent>
          {announcement.status === "DRAFT" ? (
            <DeleteAnnouncementButton
              id={announcement.id}
              title={announcement.title}
              redirectAfterDelete
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Batalkan publikasi terlebih dahulu untuk mengaktifkan operasi hapus.
            </p>
          )}
        </CardContent>
      </Card>

      {announcement.status === "PUBLISHED" ? (
        <p className="text-xs text-muted-foreground">
          Pengumuman sudah dipublikasikan. Perubahan judul tidak akan mengubah slug agar URL publik
          tetap stabil.
        </p>
      ) : null}
    </main>
  )
}

export { EditAnnouncementView }
