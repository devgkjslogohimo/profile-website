import { FileText, Megaphone } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnnouncementCreateForm } from "@/features/announcements/components/announcement-create-form"
import { canEditAnnouncement } from "@/features/announcements/lib/announcement-permissions"
import { type AdminRole, hasPermission } from "@/lib/auth/permissions"

import { AnnouncementPublicationButton } from "./announcement-publication-button"
import { DeleteAnnouncementButton } from "./delete-announcement-button"

type AnnouncementListItem = {
  id: string
  title: string
  slug: string

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

type AnnouncementManagerProps = {
  announcements: AnnouncementListItem[]
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

function AnnouncementManager({
  announcements,
  currentUserId,
  currentUserRole,
}: AnnouncementManagerProps) {
  const draftCount = announcements.filter((item) => item.status === "DRAFT").length

  const publishedCount = announcements.filter((item) => item.status === "PUBLISHED").length

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Konten</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Pengumuman
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola pengumuman resmi GKJ Slogohimo yang akan diinformasikan melalui website.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pengumuman
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{announcements.length}</p>
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
          <CardTitle>Tambah Pengumuman</CardTitle>

          <p className="text-sm text-muted-foreground">
            Pengumuman baru selalu disimpan sebagai Draft dan belum tampil pada website publik.
          </p>
        </CardHeader>

        <CardContent>
          <AnnouncementCreateForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengumuman</CardTitle>

          <p className="text-sm text-muted-foreground">
            {announcements.length} pengumuman tersimpan.
          </p>
        </CardHeader>

        <CardContent>
          {announcements.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <Megaphone className="mx-auto size-6 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">Belum ada pengumuman</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan pengumuman pertama melalui form di atas.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {announcements.map((item) => {
                const isOwner = item.author.id === currentUserId

                const canEdit = canEditAnnouncement({
                  role: currentUserRole,
                  userId: currentUserId,
                  authorId: item.author.id,
                })

                const canPublish = hasPermission(currentUserRole, "content.publish")

                const canDelete = canEdit && item.status === "DRAFT"

                return (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 py-6 first:pt-0 last:pb-0 lg:flex-row lg:items-start lg:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <FileText className="size-4 shrink-0 text-muted-foreground" />

                        <h2 className="font-medium">{item.title}</h2>

                        <Badge variant={item.status === "PUBLISHED" ? "secondary" : "outline"}>
                          {item.status === "PUBLISHED" ? "Published" : "Draft"}
                        </Badge>

                        {isOwner ? <Badge variant="outline">Milik Anda</Badge> : null}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span>Penulis: {item.author.name}</span>

                        <span>Dibuat: {formatDateTime(item.createdAt)}</span>

                        {item.publishedAt ? (
                          <span>Dipublikasikan: {formatDateTime(item.publishedAt)}</span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-xs break-all text-muted-foreground">
                        Slug: {item.slug}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      {canPublish ? (
                        <AnnouncementPublicationButton
                          id={item.id}
                          title={item.title}
                          status={item.status}
                        />
                      ) : null}

                      {canEdit ? (
                        <Link
                          href={`/admin/pengumuman/${item.id}/edit`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          Edit
                        </Link>
                      ) : null}

                      {canDelete ? (
                        <DeleteAnnouncementButton id={item.id} title={item.title} />
                      ) : null}
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

export { AnnouncementManager }
