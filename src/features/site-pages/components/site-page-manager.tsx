import { FileText } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SitePageCreateForm } from "@/features/site-pages/components/site-page-create-form"
import { canEditSitePage } from "@/features/site-pages/lib/site-page-permissions"
import { type AdminRole, hasPermission } from "@/lib/auth/permissions"

import { DeleteSitePageButton } from "./delete-site-page-button"
import { SitePagePublicationButton } from "./site-page-publication-button"

type SitePageListItem = {
  id: string
  title: string
  slug: string

  status: "DRAFT" | "PUBLISHED"
  publishedAt: Date | null

  showInNavigation: boolean
  navigationLabel: string | null
  navigationOrder: number

  createdAt: Date
  updatedAt: Date

  author: {
    id: string
    name: string
    email: string
  }
}

type SitePageManagerProps = {
  sitePages: SitePageListItem[]
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

function SitePageManager({ sitePages, currentUserId, currentUserRole }: SitePageManagerProps) {
  const draftCount = sitePages.filter((item) => item.status === "DRAFT").length

  const publishedCount = sitePages.filter((item) => item.status === "PUBLISHED").length

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Konten</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Halaman
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola halaman statis website seperti sejarah, visi dan misi, profil gereja, serta
          informasi umum lainnya.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Halaman
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{sitePages.length}</p>
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
          <CardTitle>Tambah Halaman</CardTitle>

          <p className="text-sm text-muted-foreground">
            Halaman baru selalu disimpan sebagai Draft sampai dipublikasikan oleh pengguna yang
            memiliki izin.
          </p>
        </CardHeader>

        <CardContent>
          <SitePageCreateForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Halaman</CardTitle>

          <p className="text-sm text-muted-foreground">{sitePages.length} halaman tersimpan.</p>
        </CardHeader>

        <CardContent>
          {sitePages.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <FileText className="mx-auto size-6 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">Belum ada halaman</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan halaman CMS pertama melalui form di atas.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {sitePages.map((item) => {
                const isOwner = item.author.id === currentUserId

                const canEdit = canEditSitePage({
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

                      <p className="mt-3 text-sm text-muted-foreground">
                        Alamat publik: <span className="font-mono">/{item.slug}</span>
                      </p>

                      {item.showInNavigation ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Menu:{" "}
                          <span className="font-medium text-foreground">
                            {item.navigationLabel}
                          </span>
                          {" · "}
                          urutan {item.navigationOrder}
                          {item.status === "DRAFT" ? (
                            <span>{" · "}akan tampil setelah Published</span>
                          ) : null}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Tidak ditampilkan di navigasi.
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span>Penulis: {item.author.name}</span>

                        <span>Dibuat: {formatDateTime(item.createdAt)}</span>

                        {item.publishedAt ? (
                          <span>Dipublikasikan: {formatDateTime(item.publishedAt)}</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      {canPublish ? (
                        <SitePagePublicationButton
                          id={item.id}
                          title={item.title}
                          status={item.status}
                        />
                      ) : null}

                      {canEdit ? (
                        <Link
                          href={`/admin/halaman/${item.id}/edit`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          Edit
                        </Link>
                      ) : null}

                      {canDelete ? <DeleteSitePageButton id={item.id} title={item.title} /> : null}
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

export { SitePageManager }
