import { CalendarDays, FileText, MapPin } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AgendaCreateForm } from "@/features/agenda/components/agenda-create-form"
import { canEditAgenda } from "@/features/agenda/lib/agenda-permissions"
import { type AdminRole, hasPermission } from "@/lib/auth/permissions"

import { AgendaPublicationButton } from "./agenda-publication-button"
import { DeleteAgendaButton } from "./delete-agenda-button"

type AgendaListItem = {
  id: string
  title: string
  slug: string
  excerpt: string

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

type AgendaManagerProps = {
  agendas: AgendaListItem[]
  currentUserId: string
  currentUserRole: AdminRole
}

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
})

function formatDateTime(value: Date) {
  return `${dateTimeFormatter.format(value)} WIB`
}

function AgendaManager({ agendas, currentUserId, currentUserRole }: AgendaManagerProps) {
  const draftCount = agendas.filter((item) => item.status === "DRAFT").length

  const publishedCount = agendas.filter((item) => item.status === "PUBLISHED").length

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Konten</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Agenda
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola agenda dan kegiatan GKJ Slogohimo yang akan diinformasikan melalui website.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Agenda
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{agendas.length}</p>
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
          <CardTitle>Tambah Agenda</CardTitle>

          <p className="text-sm text-muted-foreground">
            Agenda baru selalu disimpan sebagai Draft dan belum tampil pada website publik.
          </p>
        </CardHeader>

        <CardContent>
          <AgendaCreateForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Agenda</CardTitle>

          <p className="text-sm text-muted-foreground">{agendas.length} agenda tersimpan.</p>
        </CardHeader>

        <CardContent>
          {agendas.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <FileText className="mx-auto size-6 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">Belum ada agenda</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan agenda pertama melalui form di atas.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {agendas.map((item) => {
                const isOwner = item.author.id === currentUserId

                const canEdit = canEditAgenda({
                  role: currentUserRole,
                  userId: currentUserId,
                  authorId: item.author.id,
                })

                const canPublish = hasPermission(currentUserRole, "content.publish")

                const canDelete = canEdit && item.status === "DRAFT"

                return (
                  <article
                    key={item.id}
                    className="grid gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-start"
                  >
                    <GoogleDriveImage url={item.coverImageUrl} alt={`Cover ${item.title}`} />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-medium">{item.title}</h2>

                        <Badge variant={item.status === "PUBLISHED" ? "secondary" : "outline"}>
                          {item.status === "PUBLISHED" ? "Published" : "Draft"}
                        </Badge>

                        {isOwner ? <Badge variant="outline">Milik Anda</Badge> : null}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.excerpt}</p>

                      <div className="mt-3 flex flex-col gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-3.5 shrink-0" />
                          Mulai: {formatDateTime(item.startsAt)}
                        </span>

                        {item.endsAt ? (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="size-3.5 shrink-0" />
                            Selesai: {formatDateTime(item.endsAt)}
                          </span>
                        ) : null}

                        {item.location ? (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-3.5 shrink-0" />

                            {item.location}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span>Penulis: {item.author.name}</span>

                        <span>Dibuat: {formatDateTime(item.createdAt)}</span>
                      </div>

                      <p className="mt-2 text-xs break-all text-muted-foreground">
                        Slug: {item.slug}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      {canPublish ? (
                        <AgendaPublicationButton
                          id={item.id}
                          title={item.title}
                          status={item.status}
                        />
                      ) : null}

                      {canEdit ? (
                        <Link
                          href={`/admin/agenda/${item.id}/edit`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          Edit
                        </Link>
                      ) : null}

                      {canDelete ? <DeleteAgendaButton id={item.id} title={item.title} /> : null}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export { AgendaManager }
