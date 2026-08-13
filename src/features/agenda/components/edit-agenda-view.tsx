import { ArrowLeft, ExternalLink, MapPin } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AgendaEditForm } from "@/features/agenda/components/agenda-edit-form"
import { getAgendaDateTimeInputValue } from "@/features/agenda/lib/agenda-date-time"
import type { RichTextContent } from "@/lib/rich-text"

import { AgendaPublicationButton } from "./agenda-publication-button"
import { DeleteAgendaButton } from "./delete-agenda-button"

type EditAgendaViewProps = {
  agenda: {
    id: string
    title: string
    slug: string
    excerpt: string
    content: RichTextContent

    startsAt: Date
    endsAt: Date | null

    location: string | null
    googleMapsUrl: string | null

    coverImageUrl: string | null

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

function EditAgendaView({ agenda, canPublish }: EditAgendaViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/agenda"
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
                Edit Agenda
              </h1>

              <Badge variant={agenda.status === "PUBLISHED" ? "secondary" : "outline"}>
                {agenda.status === "PUBLISHED" ? "Published" : "Draft"}
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{agenda.title}</p>
          </div>

          {canPublish ? (
            <AgendaPublicationButton id={agenda.id} title={agenda.title} status={agenda.status} />
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Agenda</CardTitle>
        </CardHeader>

        <CardContent>
          <AgendaEditForm
            agenda={{
              id: agenda.id,
              title: agenda.title,
              excerpt: agenda.excerpt,
              content: agenda.content,

              startsAt: getAgendaDateTimeInputValue(agenda.startsAt),

              endsAt: agenda.endsAt ? getAgendaDateTimeInputValue(agenda.endsAt) : null,

              location: agenda.location,
              googleMapsUrl: agenda.googleMapsUrl,

              coverImageUrl: agenda.coverImageUrl,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jadwal dan Lokasi</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Mulai</p>

            <p className="mt-1 font-medium">{formatDateTime(agenda.startsAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Selesai</p>

            <p className="mt-1 font-medium">{formatDateTime(agenda.endsAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Lokasi</p>

            <p className="mt-1 font-medium">{agenda.location || "Belum tersedia"}</p>

            {agenda.googleMapsUrl ? (
              <Link
                href={agenda.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm underline underline-offset-4"
              >
                <MapPin className="size-4" />
                Buka Google Maps
                <ExternalLink className="size-3.5" />
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Penulis</p>

            <p className="mt-1 font-medium">{agenda.author.name}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Slug</p>

            <p className="mt-1 font-medium break-all">{agenda.slug}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>

            <p className="mt-1 font-medium">
              {agenda.status === "PUBLISHED" ? "Published" : "Draft"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Dipublikasikan</p>

            <p className="mt-1 font-medium">{formatDateTime(agenda.publishedAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Dibuat</p>

            <p className="mt-1 font-medium">{formatDateTime(agenda.createdAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Diperbarui</p>

            <p className="mt-1 font-medium">{formatDateTime(agenda.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hapus Agenda</CardTitle>

          <p className="text-sm text-muted-foreground">
            {agenda.status === "DRAFT"
              ? "Hapus agenda secara permanen dari sistem."
              : "Agenda yang sudah dipublikasikan harus dikembalikan menjadi Draft sebelum dapat dihapus."}
          </p>
        </CardHeader>

        <CardContent>
          {agenda.status === "DRAFT" ? (
            <DeleteAgendaButton id={agenda.id} title={agenda.title} redirectAfterDelete />
          ) : (
            <p className="text-sm text-muted-foreground">
              Batalkan publikasi terlebih dahulu untuk mengaktifkan operasi hapus.
            </p>
          )}
        </CardContent>
      </Card>

      {agenda.status === "PUBLISHED" ? (
        <p className="text-xs text-muted-foreground">
          Agenda sudah dipublikasikan. Perubahan judul tidak akan mengubah slug agar URL publik
          tetap stabil.
        </p>
      ) : null}
    </main>
  )
}

export { EditAgendaView }
