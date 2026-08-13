import { FileText, Images } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewsCreateForm } from "@/features/news/components/news-create-form"
import { AdminRole, hasPermission } from "@/lib/auth/permissions"

import { canEditNews } from "../lib/news-permissions"
import { DeleteNewsButton } from "./delete-news-button"
import { NewsPublicationButton } from "./news-publication-button"

type NewsListItem = {
  id: string
  title: string
  slug: string
  excerpt: string
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

  _count: {
    images: number
  }
}

type NewsManagerProps = {
  news: NewsListItem[]
  currentUserId: string
  currentUserRole: AdminRole
}

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
})

function NewsManager({ news, currentUserId, currentUserRole }: NewsManagerProps) {
  const draftCount = news.filter((item) => item.status === "DRAFT").length

  const publishedCount = news.filter((item) => item.status === "PUBLISHED").length

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Konten</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Berita
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola berita dan dokumentasi kegiatan GKJ Slogohimo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Berita
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{news.length}</p>
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
          <CardTitle>Tambah Berita</CardTitle>

          <p className="text-sm text-muted-foreground">
            Berita baru selalu disimpan sebagai Draft dan belum tampil di website publik.
          </p>
        </CardHeader>

        <CardContent>
          <NewsCreateForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Berita</CardTitle>

          <p className="text-sm text-muted-foreground">{news.length} berita tersimpan.</p>
        </CardHeader>

        <CardContent>
          {news.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <FileText className="mx-auto size-6 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">Belum ada berita</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan berita pertama melalui form di atas.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {news.map((item) => {
                const isOwner = item.author.id === currentUserId

                const canEdit = canEditNews({
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

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span>Penulis: {item.author.name}</span>

                        <span>Dibuat: {dateTimeFormatter.format(item.createdAt)} WIB</span>

                        <span className="inline-flex items-center gap-1">
                          <Images className="size-3.5" />
                          {item._count.images} foto
                        </span>
                      </div>

                      <p className="mt-2 text-xs break-all text-muted-foreground">
                        Slug: {item.slug}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      {canPublish ? (
                        <NewsPublicationButton
                          id={item.id}
                          title={item.title}
                          status={item.status}
                        />
                      ) : null}

                      {canEdit ? (
                        <Link
                          href={`/admin/berita/${item.id}/edit`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          Edit
                        </Link>
                      ) : null}

                      {canDelete ? (
                        <DeleteNewsButton
                          id={item.id}
                          title={item.title}
                          imageCount={item._count.images}
                        />
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

export { NewsManager }
